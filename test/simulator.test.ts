// /**
//  * Copyright (c) 2019 Jonathan Andersen
//  * Copyright (c) 2019 William R. Sullivan
//  *
//  * This software is proprietary and owned by Jonathan Andersen.
//  *
//  * This software was based on https://github.com/wrsulliv/SDKLibrary,
//  * licensed under the MIT license.
//  */

// import { CreateUserParams, Profile, Role, APIUser, ProfileResult, SessionRecorder, Device } from '../src';
// import { TokenParams } from '../src/models/token-model';
// import { Team, TeamInternal } from '../src/models/team';
// import { generateTestData, sessionGeneralStatParamsStart, sessionGeneralStatParamsEnd, TestDataGenerator, sessionAdditional1StatParamsStart, sessionAdditional1StatParamsEnd, sessionAdditional2StatParamsStart, sessionAdditional2StatParamsEnd, rowingStrokeDataStatParamsStart } from './sdk.test';
// import { teamSDK, userSDK, profileSDK, tokenSDK } from '../src/tools/rowstream-utils';
// import { GeneralStatus, AdditionalStatus1, AdditionalStatus2, PM5RowingService, RowingStrokeData, PM5Stat, StatType } from '../src/tools/pm5-sdk';
// import * as sinon from 'sinon';

// //  TODO-IMPORTANT:  Remove this!
// const ROWSTREAM_SECRET = 'RowStreamSecret123!';

// interface SimulatorParams {
//   numTeams: number;
//   numPlayersPerTeam: number;
//   simTime: number;  //  Time to run in MS.
// }

// interface LoggedInCoach {
//   coach: APIUser;
//   token: string;
//   team: TeamInternal;
//   profile: ProfileResult;
//   members: LoggedInMember[];
// }

// interface LoggedInMember {
//   coach: LoggedInCoach;
//   member: APIUser;
//   token: string;
//   profile: ProfileResult;
// }

// /**
//  * Simulates 20 user accounts:  2 Coaches, each with 9 team members uploading session data in parallel.
//  * TODO:  The Simulator should clean up after itself.
//  */
// class RowStreamSimulator {
//   private coaches: LoggedInCoach[] = [];
//   constructor(private params: SimulatorParams) {}

//   /**
//    * Initializes the Simulator by creating users.
//    */
//   public async init() {

//     //  Make Coaches
//     for (let coachIndex = 0; coachIndex < this.params.numTeams; coachIndex++) {

//       //  Create the Coach
//       const userParams: CreateUserParams = { email: `coach_${coachIndex}@rowstream.com`, username: `coach_${coachIndex}`, password: `coach_${coachIndex}_password`, roles: [ Role.Rower, Role.Coach ], verified: true, secret: ROWSTREAM_SECRET };
//       const coach = await userSDK.create(userParams);

//       //  Create the Token
//       const tokenParams: TokenParams = { username: userParams.username, password: userParams.password };
//       const { token } = await tokenSDK.create(tokenParams);

//       //  Create the Coach Profile
//       const profileParams: Profile = { name: `coach_${coachIndex}`, city: 'Test City', state: 'MA' };
//       const profile = await profileSDK.create(profileParams, token);

//       //  Create the Team
//       const teamParams: Team = { name: 'Sample Boathouse', players: [], invites: [] };
//       const team = await teamSDK.create(teamParams, token);

//       //  Make the LoggedInCoach Structure
//       const loggedInCoach: LoggedInCoach = { coach, token, team, profile, members: [] };

//       //  Make Team Members
//       const members: LoggedInMember[] = [];
//       for (let memberIndex = 0; memberIndex < this.params.numPlayersPerTeam; memberIndex++) {

//         //  Create the Member
//         const memberUsername = `member_${coachIndex}_${memberIndex}`;
//         const userParams: CreateUserParams = { email: `${memberUsername}@rowstream.com`, username: memberUsername, password: `${memberUsername}_password`, roles: [ Role.Rower, Role.Member ], verified: true, secret: ROWSTREAM_SECRET };
//         const member = await userSDK.create(userParams);

//         //  Create the Token
//         const tokenParams: TokenParams = { username: userParams.username, password: userParams.password };
//         const { token } = await tokenSDK.create(tokenParams);

//         //  Create the Coach Profile
//         const profileParams: Profile = { name: memberUsername, city: 'Test City', state: 'MA' };
//         const profile = await profileSDK.create(profileParams, token);

//         //  Update the Team (use the Coach token)
//         const teamParams: Team = { name: 'Sample Boathouse', players: [ ...loggedInCoach.team.players, userParams.username ], invites: [] };
//         const team = await teamSDK.update(loggedInCoach.team.id, teamParams, loggedInCoach.token);

//         //  Create the LoggedInMember Structure
//         const loggedInMember: LoggedInMember = { coach: loggedInCoach, member, token, profile };

//         //  Update the LoggedInCoach Structure
//         loggedInCoach.members.push(loggedInMember);
//       }

//       //  Add to the Coaches List
//       this.coaches.push(loggedInCoach);
//     }
//   }

//   public stubRowingService = (rowingService: PM5RowingService) => {

//     //  IDEA:  Show the Elastic graphs to show how it handles the load!

//     //  Mock the RowingService
//     let generalTimer: NodeJS.Timer;
//     let ad1Timer: NodeJS.Timer;
//     let ad2Timer: NodeJS.Timer;
//     let strokeTimer: NodeJS.Timer;

//     //  General Stats
//     sinon.stub(rowingService, 'subscribeGeneralStatus').callsFake((callback: (status: GeneralStatus) => void) => {
//       const createGeneralStatus = () => {
//         // const sessionGeneralStatList = generateTestData(sessionGeneralStatParamsStart as any, sessionGeneralStatParamsEnd as any, 1, TestDataGenerator.Linear, 1) as any[];
//         // const generalStats: GeneralStatus = sessionGeneralStatList[0];
//         callback({ ...sessionGeneralStatParamsStart, elapsedTime: new Date() });
//       };
//       generalTimer = setInterval(createGeneralStatus, 3000);
//     });

//     //  Additional Stats 1
//     sinon.stub(rowingService, 'subscribeAdditionalStatus1').callsFake((callback: (status: AdditionalStatus1) => void) => {
//       const createAdditional1Stats = () => {
//         // const additional1StatList = generateTestData(sessionAdditional1StatParamsStart as any, sessionAdditional1StatParamsEnd as any, 1, TestDataGenerator.Linear, 1) as any[];
//         // const addiitonl1Stat: AdditionalStatus1 = additional1StatList[0];
//         callback({ ...sessionAdditional1StatParamsStart, elapsedTime: new Date() });
//       };
//       ad1Timer = setInterval(createAdditional1Stats, 3000);
//     });

//     //  Additional Stats 2
//     sinon.stub(rowingService, 'subscribeAdditionalStatus2').callsFake((callback: (status: AdditionalStatus2) => void) => {
//       const createAdditional2Stats = () => {
//         // const additional2StatList = generateTestData(sessionAdditional2StatParamsStart as any, sessionAdditional2StatParamsEnd as any, 1, TestDataGenerator.Linear, 1) as any[];
//         // const addiitonl2Stat: AdditionalStatus2 = additional2StatList[0];
//         callback({ ...sessionAdditional2StatParamsStart, elapsedTime: new Date() });
//       };
//       ad2Timer = setInterval(createAdditional2Stats, 3000);
//     });

//     //  Rowing Stroke Data
//     sinon.stub(rowingService, 'subscribeRowingStrokeData').callsFake((callback: (status: RowingStrokeData) => void) => {
//       const createRowingStrokeDataStats = () => {
//         // const rowingStrokeDataStatList = generateTestData(rowingStrokeDataStatParamsStart as any, rowingStrokeDataStatParamsStart as any, 1, TestDataGenerator.Linear, 1) as any[];
//         // const rowingStrokeData: RowingStrokeData = rowingStrokeDataStatList[0];
//         callback({ ...rowingStrokeDataStatParamsStart, elapsedTime: new Date() });
//       };
//       strokeTimer = setInterval(createRowingStrokeDataStats, 3000);
//     });

//     //  Unsubscribe
//     sinon.stub(rowingService, 'unsubscribeAll').callsFake(async () => {
//       clearInterval(generalTimer);
//       clearInterval(ad1Timer);
//       clearInterval(ad2Timer);
//       clearInterval(strokeTimer);
//     });
//   }

//   /**
//    * Runs a 30 minute session for every member of all teams.
//    */
//   public async runSession() {

//     //  Run the Teams in Parallel
//     const memberPromises: Promise<any>[] = [];
//     this.coaches.forEach(coach => {
//       coach.members.map(async (member) => {
//         const memberPromise = new Promise<void>(async (resolve, reject) => {
//           const token = member.token;
//           const user = member.member;

//           const mockDevice: Device = {} as Device;
//           const mockRowingService = new PM5RowingService(mockDevice);
//           this.stubRowingService(mockRowingService);
//           const onStat = (stat: PM5Stat, type: StatType) => {
//             console.log(stat);
//           };
//           const mockStorage = {
//             getItem: (item: string): string => '[]',
//             setItem: (item: string): void => undefined
//           };
//           const recorder = new SessionRecorder(mockRowingService, token, onStat, user, mockStorage, () => undefined);
//           await recorder.init();
//           setTimeout(async () => {
//             await recorder.endSession();
//             resolve();
//           }, this.params.simTime);
//         });
//         memberPromises.push(memberPromise);
//       });
//     });
//     await Promise.all(memberPromises);
//   }
// }

// describe.only('Simulator', () => {

//   it('should successfully simulate 2 teams with 10 members each for 15 minutes.', async () => {
//     const simParams: SimulatorParams = { numTeams: 2, numPlayersPerTeam: 10, simTime: 15 * 60 * 1000 };
//     const sim = new RowStreamSimulator(simParams);
//     await sim.init();
//     await sim.runSession();
//   });
// });
