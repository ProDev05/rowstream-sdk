/**
 * Copyright (c) 2019 Jonathan Andersen
 *
 * This software is proprietary and owned by Jonathan Andersen.
 */

 import { APIUser, LoggerEventName, LoggerEventType, WorkoutInternal, Session, SessionInternal } from '../models';
import { AdditionalStatus1, AdditionalStatus2, GeneralStatus, PM5RowingService, PM5Stat, RowingStrokeData, StatType as StatType, WorkoutState, WorkoutType } from './pm5-sdk';
import { eventLoggerSDK, sessionSDK } from './rowstream-utils';
import { SessionStorage } from './session-storage';


 //  IDEA:  Make a templated "StatManager" class to handle the different stat types.  This would separate the Session concerns from the SessionStat concerns.
 //  TODO:  Do not repeat so much code here.  Make a structure which lists the stats and iterates this list instead of manually updating the code for each new stat!


 class BulkStatUploadError extends Error {}
 class SessionUndefinedError extends Error {}
 class StartTimeUndefinedError extends Error {}

 export enum SessionRecorderErrorType {
  IntervalWorkoutError
}

 export interface SessionRecorderError {
   type: SessionRecorderErrorType;
   message: string;
 }

 /**
  * Records an active Session with Event / Error Logging, Local Storage, and Normalized Logic.
  */
 export class SessionRecorder {

   //  Define Session Start Indicator
   private sessionStarted = false;

   //  Store the Status Sets
   private statusStores: { [statType: string]: PM5Stat[] } = {};
   private firstStatusEntries: { [statType: string]: PM5Stat } = {};
   private lastStatusEntries: { [statType: string]: PM5Stat } = {};
   private statSyncTimers: { [statType: string]: any } = {};

   //  Set the Sync Interval (ms)
   private syncInterval = 5000;

   //  Define Session
   private sessionInternal?: SessionInternal;
   private session?: Session;

   //  Define Start Time
   private startTime?: Date;

   //  Define SessionStorage
   private sessionStorage: SessionStorage;


   constructor(private rowingService: PM5RowingService, private token: string, private onStat: (stat: PM5Stat, statType: StatType) => void, private user: APIUser, storage: any, private onError: (error: SessionRecorderError) => void, private workout?: WorkoutInternal) {
     this.sessionStorage = new SessionStorage(token, user, (): any => undefined, storage);
   }

   public async init() {

     //  Initialize Storage
     await this.sessionStorage.init();

     //  Define the Session
     this.session = {
       start: new Date().toISOString(),
     };

     if (this.workout != undefined) {
      this.session.workoutId = this.workout.id;
     }

     //  Save the Session
     this.sessionInternal = await sessionSDK.create(this.session, this.token);

     //  Log New Session Success Event
     await eventLoggerSDK.create({
       name: LoggerEventName.CreateSession,
       description: 'Successfully created a new session.',
       user: this.user.username,
       type: LoggerEventType.Success
     }, this.token);

     //  Set Up Producers
     this.rowingService.subscribeGeneralStatus((status: GeneralStatus) => {

       //  Define the Workout Blacklist
       const workoutTypeBlacklist = [
         WorkoutType["Fixed Calories - Interval"],
         WorkoutType["Fixed Distance - Interval"],
         WorkoutType["Fixed Time - Interval"],
         WorkoutType["Variable (Interval)"],
         WorkoutType["Variable (Undefined) Rest (Interval)"]
       ];

       //  Validate the Type
       if (workoutTypeBlacklist.indexOf(status.workoutType) != -1) {
         this.onError({ type: SessionRecorderErrorType.IntervalWorkoutError, message: "Interval Workouts are not currently supported.  However, support for Interval Workouts is high on our priority list." });
         return;
       }

       //  Check Session Start Event
       const firstGeneralStatus = this.firstStatusEntries[StatType.General];
       if (!firstGeneralStatus && status.workoutState == WorkoutState["Workout Row"]) {
         this.sessionStarted = true;
         this.startTime = new Date();
       }

       //  Handle the General Status
       this.handleStatus(status, StatType.General);
     });
     this.rowingService.subscribeAdditionalStatus1((status: AdditionalStatus1) => this.handleStatus(status, StatType.Additional1));
     this.rowingService.subscribeAdditionalStatus2((status: AdditionalStatus2) => this.handleStatus(status, StatType.Additional2));
     this.rowingService.subscribeRowingStrokeData((status: RowingStrokeData) => this.handleStatus(status, StatType.StrokeData));

     //  Set up Consumers
     this.statSyncTimers[StatType.General] = setInterval(() => this.syncStatuses(StatType.General), this.syncInterval);
     this.statSyncTimers[StatType.Additional1] = setInterval(() => this.syncStatuses(StatType.Additional1), this.syncInterval);
     this.statSyncTimers[StatType.Additional2] = setInterval(() => this.syncStatuses(StatType.Additional2), this.syncInterval);
     this.statSyncTimers[StatType.StrokeData] = setInterval(() => this.syncStatuses(StatType.StrokeData), this.syncInterval);

   }

   //  TODO:  Make sure there is no race condition here.  May be possible with the shared state?
   private async syncStatuses (statType: StatType) {

     //  Check Session
     if (this.sessionInternal == undefined) {
       // console.error(`Cannot upload the ${statType} Stats while there is no active Session.`);
       throw new SessionUndefinedError();
     }

     //  Unpack SessionId to avoid TS error
     const { id: sessionId } = this.sessionInternal;

     //  Get the Stats
     const stats = this.statusStores[statType] || [];

     // Check Empty
     if (stats.length <= 0) { console.log(`Empty ${statType} Stats`); return; }

     //  Upload the Stats
     await this.sessionStorage.uploadStats(sessionId, stats, statType);

     //  Clear the List
     this.statusStores[statType] = [];
   }

   private handleStatus (stat: PM5Stat, statType: StatType) {

     //  Check Session Started
     if (!this.sessionStarted) { return; }

     //  Get the Data Store
     if (!this.statusStores[statType]) { this.statusStores[statType] = []; }
     const statusSet = this.statusStores[statType];

     //  Get the First Data Point
     const firstEntry = this.firstStatusEntries[statType];
     if (firstEntry == undefined) { this.firstStatusEntries[statType] = stat; }

     //  Get the Last Data Point
     const lastEntry = this.lastStatusEntries[statType];

     //  Filter Duplicate Data and Earlier Date
     //  TODO:  Validate that it makes sense to remove these duplicates with PM5 docs and Scott H.
     if (lastEntry && stat.elapsedTime.getTime() <= lastEntry.elapsedTime.getTime()) { return; }

     //  Add the Status to the List
     statusSet.push(stat);

     //  Update the Last Status
     this.lastStatusEntries[statType] = stat;

     //  Update the Caller
     this.onStat(stat, statType);
   }

   public async endSession() {

    // Cancel the Timer
    clearInterval(this.statSyncTimers[StatType.General]);
    clearInterval(this.statSyncTimers[StatType.Additional1]);
    clearInterval(this.statSyncTimers[StatType.Additional2]);
    clearInterval(this.statSyncTimers[StatType.StrokeData]);

    //  Unsubscribe the Rowing Service
     if (this.rowingService) {
       await this.rowingService.unsubscribeAll();
     }

     //  Guard Session
     if (this.sessionInternal == undefined || this.session == undefined) {

       //  Log Session Close Error Event
       await eventLoggerSDK.create({
         name: LoggerEventName.CloseSession,
         description: `Failed to close the session:  Cannot end an undefined session.`,
         user: this.user.username,
         type: LoggerEventType.Error
       }, this.token);

       return;
     }

     //  Guard Start Time
     if (this.startTime == undefined) {

       //  Log Session Close Error Event
       await eventLoggerSDK.create({
        name: LoggerEventName.CloseSession,
        description: `Failed to close the session:  Cannot end a session without a start time.`,
        user: this.user.username,
        type: LoggerEventType.Error
      }, this.token);

      return;
     }

    // Final Upload
    await this.syncStatuses(StatType.General);
    await this.syncStatuses(StatType.Additional1);
    await this.syncStatuses(StatType.Additional2);
    await this.syncStatuses(StatType.StrokeData);

    //  End the Session
    //  NOTE:  I believe there IS a difference between actual elapsed time, and session elapsed time (reported by PM5).  It only measures time spent actually rowing, and THIS is what we want to use in our calculations.
    const updatedSession: Session = { ...this.session, start: this.startTime.toISOString(), end: new Date().toISOString() };

    //  Update the Session with an End Time
    await this.sessionStorage.closeSession(updatedSession, this.sessionInternal.id);
   }
 }

// class MockSessionRecorder extends SessionRecorder {

//   public async init() {

//     setTimeout(() => {

//       const intervals = 60 * 60 / 20;  //  60 x 60 Seconds (1 Hour) / 20 Seconds
//       const sessionGeneralStatList = generateTestData(sessionGeneralStatParamsStart as any, sessionGeneralStatParamsEnd as any, intervals, TestDataGenerator.Linear, multiplier) as any[];
//       const sessionGeneralStatListUpdated = sessionGeneralStatList.map((testData) => ({ ...testData, sessionId: sessionId }));
//       await sessionAdditional1SDK.createBulk(sessionId, sessionGeneralStatListUpdated, token);
//       const status: AdditionalStatus1 = generateSessionStats()
//       (status: AdditionalStatus1) => this.handleStatus(status, StatType.Additional1)
//     })
//     this.rowingService.subscribeAdditionalStatus1();
//     this.rowingService.subscribeAdditionalStatus2((status: AdditionalStatus2) => this.handleStatus(status, StatType.Additional2));
//     this.rowingService.subscribeRowingStrokeData((status: RowingStrokeData) => this.handleStatus(status, StatType.StrokeData));

//     //  Set up Consumers
//     this.statSyncTimers[StatType.General] = setInterval(() => this.syncStatuses(StatType.General), this.syncInterval);
//     this.statSyncTimers[StatType.Additional1] = setInterval(() => this.syncStatuses(StatType.Additional1), this.syncInterval);
//     this.statSyncTimers[StatType.Additional2] = setInterval(() => this.syncStatuses(StatType.Additional2), this.syncInterval);
//     this.statSyncTimers[StatType.StrokeData] = setInterval(() => this.syncStatuses(StatType.StrokeData), this.syncInterval);

//   }

//   //  TODO:  Make sure there is no race condition here.  May be possible with the shared state?
//   private async syncStatuses (statType: StatType) {

//     //  Check Session
//     if (this.sessionInternal == undefined) {
//       // console.error(`Cannot upload the ${statType} Stats while there is no active Session.`);
//       throw new SessionUndefinedError();
//     }

//     //  Unpack SessionId to avoid TS error
//     const { id: sessionId } = this.sessionInternal;

//     //  Get the Stats
//     const stats = this.statusStores[statType] || [];

//     // Check Empty
//     if (stats.length <= 0) { console.log(`Empty ${statType} Stats`); return; }

//     //  Upload the Stats
//     await this.sessionStorage.uploadStats(sessionId, stats, statType);

//     //  Clear the List
//     this.statusStores[statType] = [];
//   }

//   private handleStatus (stat: PM5Stat, statType: StatType) {

//     //  Check Session Started
//     if (!this.sessionStarted) { return; }

//     //  Get the Data Store
//     if (!this.statusStores[statType]) { this.statusStores[statType] = []; }
//     const statusSet = this.statusStores[statType];

//     //  Get the First Data Point
//     const firstEntry = this.firstStatusEntries[statType];
//     if (firstEntry == undefined) { this.firstStatusEntries[statType] = stat; }

//     //  Get the Last Data Point
//     const lastEntry = this.lastStatusEntries[statType];

//     //  Filter Duplicate Data and Earlier Date
//     //  TODO:  Validate that it makes sense to remove these duplicates with PM5 docs and Scott H.
//     if (lastEntry && stat.elapsedTime.getTime() <= lastEntry.elapsedTime.getTime()) { return; }

//     //  Add the Status to the List
//     statusSet.push(stat);

//     //  Update the Last Status
//     this.lastStatusEntries[statType] = stat;

//     //  Update the Caller
//     this.onStat(stat, statType);
//   }

//   public async endSession() {

//     //  Check Session
//     if (this.sessionInternal == undefined || this.session == undefined) {
//       console.error(`Cannot end an undefined Session.`);

//       //  Log Session Close Error Event
//       await eventLoggerSDK.create({
//         name: LoggerEventName.CloseSession,
//         description: `Failed to close the session:  Cannot end an undefined session.`,
//         user: this.user.username,
//         type: LoggerEventType.Error
//       }, this.token);

//       throw new SessionUndefinedError();
//     }

//     //  Check Start Time
//     if (this.startTime == undefined) {
//       console.error(`Cannot end a session with no start time.`);

//       //  Log Session Close Error Event
//       await eventLoggerSDK.create({
//         name: LoggerEventName.CloseSession,
//         description: `Failed to close the session:  Cannot end a session without a start time.`,
//         user: this.user.username,
//         type: LoggerEventType.Error
//       }, this.token);

//       throw new StartTimeUndefinedError();
//     }

//     // Cancel the Timer
//     clearInterval(this.statSyncTimers[StatType.General]);
//     clearInterval(this.statSyncTimers[StatType.Additional1]);
//     clearInterval(this.statSyncTimers[StatType.Additional2]);
//     clearInterval(this.statSyncTimers[StatType.StrokeData]);

//     // Final Upload
//     await this.syncStatuses(StatType.General);
//     await this.syncStatuses(StatType.Additional1);
//     await this.syncStatuses(StatType.Additional2);
//     await this.syncStatuses(StatType.StrokeData);

//     //  End the Session
//     //  NOTE:  I believe there IS a difference between actual elapsed time, and session elapsed time (reported by PM5).  It only measures time spent actually rowing, and THIS is what we want to use in our calculations.
//     const updatedSession: Session = { ...this.session, start: this.startTime.toISOString(), end: new Date().toISOString() };

//     //  Update the Session with an End Time
//     await this.sessionStorage.closeSession(updatedSession, this.sessionInternal.id);

//     //  Unsubscribe the Rowing Service
//     if (this.rowingService) {
//       await this.rowingService.unsubscribeAll();
//     }
//   }
// }