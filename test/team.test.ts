/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

import { UserSDK, ProfileSDK, CreateUserParams, Profile, Session, SessionInternal, AggParams, SessionGeneralStatusStatInternal, SessionGeneralStatusStat, SessionAdditionalStatus1Stat, SessionAdditionalStatus1StatInternal, SessionAdditionalStatus2StatInternal, SessionAdditionalStatus2Stat, BucketQueryParamsAPI, TeamSDK, UpdateUserParams, Role } from '../src';
import { TokenSDK } from '../src/sdks/token-sdk';
import { TokenParams } from '../src/models/token-model';
import { SessionSDK } from '../src/sdks/session-sdk';
import { SessionGeneralStatSDK } from '../src/sdks/session-general-stat';
import { SessionAdditional1StatSDK } from '../src/sdks/session-additional1-stat';
import { SessionAdditional2StatSDK } from '../src/sdks/session-additional2-stat';
import { Team, TeamInternal } from '../src/models/team';
import { expect } from 'chai';
import { generateTestData, sessionGeneralStatParamsStart, sessionGeneralStatParamsEnd, TestDataGenerator, sessionAdditional1StatParamsStart, sessionAdditional1StatParamsEnd, sessionAdditional2StatParamsStart, sessionAdditional2StatParamsEnd } from './sdk.test';
import { teamSDK, userSDK, profileSDK, tokenSDK, sessionSDK, sessionGeneralStatSDK, sessionAdditional1StatSDK, sessionAdditional2StatSDK } from '../src/tools/rowstream-utils';
import { GeneralStatus, AdditionalStatus1, AdditionalStatus2 } from '../src/tools/pm5-sdk';

const coach: CreateUserParams = {
  username: 'coach',
  email: 'coach@rowstream.com',
  password: 'testpass123',
};

const tm1TokenParams = {
  username: 'team_member_1',
  password: 'testpass123'
};

const tm2TokenParams = {
  username: 'team_member_2',
  password: 'testpass123'
};

const tm3TokenParams = {
  username: 'team_member_3',
  password: 'testpass123'
};

const coachProfile: Profile = {
  name: 'Pete Rodgers',
  city: 'Avon',
  state: 'CT',
  avatar: 'https://dmcvsharks.com/wp-content/uploads/2018/09/Duarte-Andrde.jpg'
};


const tm1Profile: Profile = {
  name: 'Joe Kettering',
  city: 'Acton',
  state: 'MA',
  avatar: 'https://images.pexels.com/photos/555790/pexels-photo-555790.png?auto=compress&cs=tinysrgb&dpr=1&w=500'
};

const tm2Profile: Profile = {
  name: 'Joshua Valin',
  city: 'Canton',
  state: 'MA',
  avatar: 'https://therideshareguy.com/wp-content/uploads/2014/05/About-Page2.jpg'
};

const tm3Profile: Profile = {
  name: 'George Redford',
  city: 'Los Angeles',
  state: 'CA',
  avatar: 'https://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg'
};

const sessionParams: Session = {
  start: new Date().toISOString()
};

const tokenParams: TokenParams = {
  username: coach.username,
  password: coach.password
};

export interface ComboStat {
  generalStats: GeneralStatus[];
  additional1Stats: AdditionalStatus1[];
  additional2Stats: AdditionalStatus2[];
}

//  IDEA:  Use a "RandomVariable" maybe with a generator to create values for the dummy data?

/**
 * Returns an array (res) of Status objects
 * res.length = Math.ceil(totalTime / uploadInterval)
 * NOTE:  The PM5 returns data at a configurable rate, and we currently upload all those intervals.
 *        We just look at these like a point at the elapsed time.  When a session ends, it's always <= 1 interval in length.
 *        That means the last data point represents the data for that last partial interval, not a full interval.
 * @param totalTime
 * @param uploadInterval
 * @param multiplier
 */

// const TOTAL_DISTANCE = 10 * 2000; //  Tenths of a Meter (0.1)

// const MIN_SPEED = 30
// const MAX_SPEED = 100;

// const MIN_STROKE_RATE = 20;
// const MAX_STROKE_RATE = 90;

// const MIN_HEART_RATE = 55;
// const MAX_HEART_RATE = 120;


// export const generateStats = (totalTimeMS: number, uploadIntervalMS: number, multiplier: number): ComboStat[] => {

//   const intervals = Math.ceil(totalTimeMS / uploadIntervalMS);
//   const generalStats: GeneralStatus[];
//   const additional1Stats: AdditionalStatus1[];
//   const additional2Stats: AdditionalStatus2[];
//   for (let interval = 0; interval < intervals; interval++) {
//     const elapsedTimeMS = uploadIntervalMS*interval;
//     const elapsedDistance = interval * (TOTAL_DISTANCE / intervals);
//     //  Create the General Stats
//     const generalStat: GeneralStatus = {
//       elapsedTime: new Date(elapsedTimeMS),
//       distance: elapsedDistance,
//       workoutType: WorkoutType["Fixed Calorie"],
//       intervalType: IntervalType.Calorie,
//       workoutState: WorkoutState["Countdown Pause"],
//       rowingState: RowingState.Active,
//       strokeState: StrokeState.Driving,
//       totalWorkDistance: elapsedDistance,
//       workoutDuration: elapsedTimeMS,
//       workoutDurationType: WorkoutDurationType["Calories Duration"],
//       dragFactor: 5
//     };

//     const additional1Stat = {
//       elapsedTime: new Date(elapsedTimeMS),
//       speed: MIN_SPEED + interval * ((MAX_SPEED - MIN_SPEED) / (intervals - 1)), //  NOTE:  Subtract 1 from intervals because MIN_SPEED is used for the first interval.
//       strokeRate: MIN_STROKE_RATE + interval * ((MAX_STROKE_RATE - MIN_STROKE_RATE) / (intervals - 1)),
//       heartRate: MIN_HEART_RATE + interval * ((MAX_HEART_RATE - MIN_HEART_RATE) / (intervals - 1)),
//       currentPace: MIN_SPEED + interval * ((MAX_SPEED - MIN_SPEED) / (intervals - 1)),
//       averagePace: MIN_SPEED + interval * ((MAX_SPEED - MIN_SPEED) / (intervals - 1)),
//       restDistance: 0,
//       restTime: 0,
//     };
//   }

// }

export interface SessionGeneratorParams {
  firstDate: Date;
  lastDate: Date;
  maxSessionsPerDay: number;
  minSessionsPerDay: number;
  minDays: number;
  maxDays: number;
  token: string;
  multiplier: number;
}

export const stripTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const generateSessionStats = async (token: string, sessionId: string, multiplier: number) => {

  //  Intervals
  //  TODO:  Don't hard-code this.
  //  TODO:  I believe PM5 defaults to 3 seconds... we should probably do the same here instead of 20?
  const intervals = 60 * 60 / 20;  //  60 x 60 Seconds (1 Hour) / 20 Seconds

  //  Create General Stats
  const sessionGeneralStatList = generateTestData(sessionGeneralStatParamsStart as any, sessionGeneralStatParamsEnd as any, intervals, TestDataGenerator.Linear, multiplier) as any[];
  const sessionGeneralStatListUpdated = sessionGeneralStatList.map((testData) => ({ ...testData, sessionId: sessionId }));
  await sessionAdditional1StatSDK.createBulk(sessionId, sessionGeneralStatListUpdated, token);

  //  Create Additional1 Stats
  const sessionAdditional1StatList = generateTestData(sessionAdditional1StatParamsStart as any, sessionAdditional1StatParamsEnd as any, intervals, TestDataGenerator.Linear, multiplier) as any[];
  const sessionAdditional1StatListUpdated = sessionAdditional1StatList.map((testData) => ({ ...testData, sessionId: sessionId }));
  await sessionAdditional1StatSDK.createBulk(sessionId, sessionAdditional1StatListUpdated, token);

  //  Create Additional2 Stats
  const sessionAdditional2StatList = generateTestData(sessionAdditional2StatParamsStart as any, sessionAdditional2StatParamsEnd as any, intervals, TestDataGenerator.Linear, multiplier) as any[];
  const sessionAdditional2StatListUpdated = sessionAdditional2StatList.map((testData) => ({ ...testData, sessionId: sessionId }));
  await sessionAdditional2StatSDK.createBulk(sessionId, sessionAdditional2StatListUpdated, token);
};

/**
 * Creates Sessions with the specified parameters.
 * Both StartDate and EndDate are candidate dates.
 */
export const generateData = async (params: SessionGeneratorParams) => {

  //  Unpack Params
  const { firstDate, lastDate, maxSessionsPerDay, minSessionsPerDay, minDays, maxDays, token, multiplier } = params;

  //  Validate
  if (maxSessionsPerDay > 24) {
    throw new Error('maxSessionPerDay must be less than 24.  Each session is 1 hour long.');
  }

  //  Remove Time
  const firstDateNoTime = stripTime(firstDate);
  const lastDateNoTime = stripTime(lastDate);

  //  Get All Dates
  const allDates: Date[] = [];
  const currentDate = firstDateNoTime;
  while (currentDate.getTime() <= lastDateNoTime.getTime()) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  //  Select Number of Days
  const numDays = minDays + Math.floor(Math.random() * (maxDays + 1 - minDays));

  //  Select Dates
  const remainingDates = [...allDates];
  const selectedDates: Date[] = [];
  for (let i = 0; i < numDays; i++) {
    const selectedDate = remainingDates[Math.floor(Math.random() * remainingDates.length)];
    const indexOfSelected = remainingDates.indexOf(selectedDate);
    remainingDates.splice(indexOfSelected, 1);
    selectedDates.push(selectedDate);
  }

  //  Create Sessions for each Date
  for (let i = 0; i < selectedDates.length; i++) {

    //  Get the Selected Date
    const selectedDate = selectedDates[i];

    //  Select Number of Sessions
    const numSessions = minSessionsPerDay + Math.floor(Math.random() * (maxSessionsPerDay + 1 - minSessionsPerDay));

    //  Create the Sessions for the current Date
    for (let sessionCount = 0; sessionCount < numSessions; sessionCount++) {

      //  Create the Session Start / End Times
      const sessionStartTime = new Date(selectedDate);
      const sessionEndTime = new Date(selectedDate);
      sessionStartTime.setHours(sessionCount);
      sessionEndTime.setHours(sessionCount + 1);

      //  Create the Session
      const sessionParams: Session = { start: sessionStartTime.toISOString(), end: sessionEndTime.toISOString() };
      const sessionInternal = await sessionSDK.create(sessionParams, token);

      //  Create the SessionStats
      await generateSessionStats(token, sessionInternal.id, multiplier);
    }

  }
};

//  Test the SDKs
describe('Teams', () => {

  let coachToken: string;
  let tm1Token: string;
  let tm2Token: string;
  let tm3Token: string;
  let session: SessionInternal;
  let team: TeamInternal;

  it('should create the tokens', async () => {
    coachToken = (await tokenSDK.create(tokenParams)).token;
    tm1Token = (await tokenSDK.create(tm1TokenParams)).token;
    tm2Token = (await tokenSDK.create(tm2TokenParams)).token;
    tm3Token = (await tokenSDK.create(tm3TokenParams)).token;
  });

  it('should create team member profiles', async () => {
    await profileSDK.create(coachProfile, coachToken);
    await profileSDK.create(tm1Profile, tm1Token);
    await profileSDK.create(tm2Profile, tm2Token);
    await profileSDK.create(tm3Profile, tm3Token);
  });

  //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
  it.skip('should create team member sessions', async () => {

    //  Create Generator Params
    const START_DATE = new Date();
    START_DATE.setDate(new Date().getDate() - 7);
    const END_DATE = new Date();
    const createGeneratorParams = (token: string, multiplier: number): SessionGeneratorParams => ({
      firstDate: START_DATE,
      lastDate: END_DATE,
      maxSessionsPerDay: 3,
      minSessionsPerDay: 0,
      minDays: 4,
      maxDays: 7,
      token,
      multiplier
    });
    //  Create Session Data
    await generateData(createGeneratorParams(tm1Token, 1));
    await generateData(createGeneratorParams(tm2Token, 2));
    await generateData(createGeneratorParams(tm3Token, 3));

  });

  describe('ACL', () => {

    it('should retrieve another user\'s profile', async () => {
      const coachProf = await profileSDK.retrieve(coach.username, coachToken);
      const tm1Prof = await profileSDK.retrieve(coach.username, tm1Token);
      expect(coachProf).to.deep.equal(tm1Prof);
    });

    // it('should assign the user a Coach role', async () => {
    //   //  TODO:  Support separate mechanism for password update.
    //   const userParams: UpdateUserParams = { email: coach.email, password: coach.password, roles: [Role.Coach] };
    //   await userSDK.update(coach.username, userParams, coachToken);
    // });
  });

  describe('Team', () => {

    before(async () => {
      //  Get a Session from TM1  //  TODO:  It's POSSIBLE that these could be no sessions from the algorithm above.
      const sessions = await sessionSDK.search({}, tm1Token);
      session = sessions.results[0];  //  TODO-CRITICAL:  Fix "sessions.total" so it reflects the total number of permissioned results instead of the pure total.  I'm not yet sure how we should calculate that... maybe store this separately?  Maybe avoid ACL rules that depend on the data itself and rely on explicit white / black lists to support query with a search filter.
    });

    it('should create a team', async () => {
      const teamParams: Team = { name: 'Sample Boathouse', players: [], invites: ['wrsulliv@umich.edu', 'tm1@rowstream.com', 'tm2@rowstream.com', 'tm3@rowstream.com'] };
      team = await teamSDK.create(teamParams, coachToken);
    });
    it('should retrieve a team instance', async () => {
      const teamInst = await teamSDK.retrieve(team.id, coachToken);
    });
    it('should search team instances', async () => {
      const teams = await teamSDK.search({}, coachToken);
    });
    it('should allow the invited rower to search teams', async () => {
      const teams = await teamSDK.search({}, tm1Token);
      if (teams.results.length <= 0) { throw new Error("Expected teams"); }
    });
    //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
    it.skip('should NOT allow the coach to see team members sessions before they join the team', async () => {
      const sessions = await sessionSDK.search({}, coachToken);
      if (sessions.total != 0) {
        throw new Error('Unexpected number of sessions!');
      }
    });

    //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
    it.skip('should NOT allow the coach to see team members session-stats before they join the team', async () => {
      try {
        const sessionStats = await sessionAdditional2StatSDK.search({ metadata: { sessionId: session.id } }, coachToken);
        console.log(sessionStats);
      } catch (err) {
        console.log(err);
        return;
      }
      throw new Error('Unexpected return value.');
    });
    it('should update a team (add the rower)', async () => {
      //  TODO:  Block users from accessing this object at the field level... actually, disable the Team update API altogether?
      //  TODO-CRITICAL:  Update operation should NOT allow the user to specify their own username...  It should validate from the list and add it in the server.
      const teamParams: Team = { name: 'Sample Boathouse', players: ['team_member_1'], invites: ['tm2@rowstream.com', 'tm3@rowstream.com'] };
      team = await teamSDK.update(team.id, teamParams, tm1Token);
    });

    //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
    it.skip('should allow coach to see team members sessions', async () => {
      const sessions = await sessionSDK.search({}, coachToken);
      if (sessions.total == 0) {
        throw new Error('Unexpected number of sessions!');
      }
    });

    //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
    it.skip('should allow the coach to see team members session-stats', async () => {
      const sessionStats = await sessionAdditional2StatSDK.search({ metadata: { sessionId: session.id } }, coachToken);
      if (sessionStats.results.length == 0) {
        throw new Error('Unexpected number of session-stats!');
      }
    });

    it('should create team members with profiles ', async () => {


      //  Join the Team
      //  TODO-CRITICAL:  Prevent a user from getting direct access to this list!  Right now, ANY user with access can add ANYBODY to the list...  MAYBE field level ACL, OR create a separate system to handle this.  Maybe an "JoinRequest"?
      const teamParams: Team = { name: 'Sample Boathouse', players: ['team_member_1', 'team_member_2', 'team_member_3'], invites: [] };
      team = await teamSDK.update(team.id, teamParams, tm1Token);
    });
  });
});
