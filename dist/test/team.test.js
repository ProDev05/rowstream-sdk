"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sdk_test_1 = require("./sdk.test");
const rowstream_utils_1 = require("../src/tools/rowstream-utils");
const coach = {
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
const coachProfile = {
    name: 'Pete Rodgers',
    city: 'Avon',
    state: 'CT',
    avatar: 'https://dmcvsharks.com/wp-content/uploads/2018/09/Duarte-Andrde.jpg'
};
const tm1Profile = {
    name: 'Joe Kettering',
    city: 'Acton',
    state: 'MA',
    avatar: 'https://images.pexels.com/photos/555790/pexels-photo-555790.png?auto=compress&cs=tinysrgb&dpr=1&w=500'
};
const tm2Profile = {
    name: 'Joshua Valin',
    city: 'Canton',
    state: 'MA',
    avatar: 'https://therideshareguy.com/wp-content/uploads/2014/05/About-Page2.jpg'
};
const tm3Profile = {
    name: 'George Redford',
    city: 'Los Angeles',
    state: 'CA',
    avatar: 'https://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg'
};
const sessionParams = {
    start: new Date().toISOString()
};
const tokenParams = {
    username: coach.username,
    password: coach.password
};
exports.stripTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
exports.generateSessionStats = (token, sessionId, multiplier) => __awaiter(this, void 0, void 0, function* () {
    //  Intervals
    //  TODO:  Don't hard-code this.
    //  TODO:  I believe PM5 defaults to 3 seconds... we should probably do the same here instead of 20?
    const intervals = 60 * 60 / 20; //  60 x 60 Seconds (1 Hour) / 20 Seconds
    //  Create General Stats
    const sessionGeneralStatList = sdk_test_1.generateTestData(sdk_test_1.sessionGeneralStatParamsStart, sdk_test_1.sessionGeneralStatParamsEnd, intervals, sdk_test_1.TestDataGenerator.Linear, multiplier);
    const sessionGeneralStatListUpdated = sessionGeneralStatList.map((testData) => (Object.assign({}, testData, { sessionId: sessionId })));
    yield rowstream_utils_1.sessionAdditional1StatSDK.createBulk(sessionId, sessionGeneralStatListUpdated, token);
    //  Create Additional1 Stats
    const sessionAdditional1StatList = sdk_test_1.generateTestData(sdk_test_1.sessionAdditional1StatParamsStart, sdk_test_1.sessionAdditional1StatParamsEnd, intervals, sdk_test_1.TestDataGenerator.Linear, multiplier);
    const sessionAdditional1StatListUpdated = sessionAdditional1StatList.map((testData) => (Object.assign({}, testData, { sessionId: sessionId })));
    yield rowstream_utils_1.sessionAdditional1StatSDK.createBulk(sessionId, sessionAdditional1StatListUpdated, token);
    //  Create Additional2 Stats
    const sessionAdditional2StatList = sdk_test_1.generateTestData(sdk_test_1.sessionAdditional2StatParamsStart, sdk_test_1.sessionAdditional2StatParamsEnd, intervals, sdk_test_1.TestDataGenerator.Linear, multiplier);
    const sessionAdditional2StatListUpdated = sessionAdditional2StatList.map((testData) => (Object.assign({}, testData, { sessionId: sessionId })));
    yield rowstream_utils_1.sessionAdditional2StatSDK.createBulk(sessionId, sessionAdditional2StatListUpdated, token);
});
/**
 * Creates Sessions with the specified parameters.
 * Both StartDate and EndDate are candidate dates.
 */
exports.generateData = (params) => __awaiter(this, void 0, void 0, function* () {
    //  Unpack Params
    const { firstDate, lastDate, maxSessionsPerDay, minSessionsPerDay, minDays, maxDays, token, multiplier } = params;
    //  Validate
    if (maxSessionsPerDay > 24) {
        throw new Error('maxSessionPerDay must be less than 24.  Each session is 1 hour long.');
    }
    //  Remove Time
    const firstDateNoTime = exports.stripTime(firstDate);
    const lastDateNoTime = exports.stripTime(lastDate);
    //  Get All Dates
    const allDates = [];
    const currentDate = firstDateNoTime;
    while (currentDate.getTime() <= lastDateNoTime.getTime()) {
        allDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    //  Select Number of Days
    const numDays = minDays + Math.floor(Math.random() * (maxDays + 1 - minDays));
    //  Select Dates
    const remainingDates = [...allDates];
    const selectedDates = [];
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
            const sessionParams = { start: sessionStartTime.toISOString(), end: sessionEndTime.toISOString() };
            const sessionInternal = yield rowstream_utils_1.sessionSDK.create(sessionParams, token);
            //  Create the SessionStats
            yield exports.generateSessionStats(token, sessionInternal.id, multiplier);
        }
    }
});
//  Test the SDKs
describe('Teams', () => {
    let coachToken;
    let tm1Token;
    let tm2Token;
    let tm3Token;
    let session;
    let team;
    it('should create the tokens', () => __awaiter(this, void 0, void 0, function* () {
        coachToken = (yield rowstream_utils_1.tokenSDK.create(tokenParams)).token;
        tm1Token = (yield rowstream_utils_1.tokenSDK.create(tm1TokenParams)).token;
        tm2Token = (yield rowstream_utils_1.tokenSDK.create(tm2TokenParams)).token;
        tm3Token = (yield rowstream_utils_1.tokenSDK.create(tm3TokenParams)).token;
    }));
    it('should create team member profiles', () => __awaiter(this, void 0, void 0, function* () {
        yield rowstream_utils_1.profileSDK.create(coachProfile, coachToken);
        yield rowstream_utils_1.profileSDK.create(tm1Profile, tm1Token);
        yield rowstream_utils_1.profileSDK.create(tm2Profile, tm2Token);
        yield rowstream_utils_1.profileSDK.create(tm3Profile, tm3Token);
    }));
    //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
    it.skip('should create team member sessions', () => __awaiter(this, void 0, void 0, function* () {
        //  Create Generator Params
        const START_DATE = new Date();
        START_DATE.setDate(new Date().getDate() - 7);
        const END_DATE = new Date();
        const createGeneratorParams = (token, multiplier) => ({
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
        yield exports.generateData(createGeneratorParams(tm1Token, 1));
        yield exports.generateData(createGeneratorParams(tm2Token, 2));
        yield exports.generateData(createGeneratorParams(tm3Token, 3));
    }));
    describe('ACL', () => {
        it('should retrieve another user\'s profile', () => __awaiter(this, void 0, void 0, function* () {
            const coachProf = yield rowstream_utils_1.profileSDK.retrieve(coach.username, coachToken);
            const tm1Prof = yield rowstream_utils_1.profileSDK.retrieve(coach.username, tm1Token);
            chai_1.expect(coachProf).to.deep.equal(tm1Prof);
        }));
        // it('should assign the user a Coach role', async () => {
        //   //  TODO:  Support separate mechanism for password update.
        //   const userParams: UpdateUserParams = { email: coach.email, password: coach.password, roles: [Role.Coach] };
        //   await userSDK.update(coach.username, userParams, coachToken);
        // });
    });
    describe('Team', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            //  Get a Session from TM1  //  TODO:  It's POSSIBLE that these could be no sessions from the algorithm above.
            const sessions = yield rowstream_utils_1.sessionSDK.search({}, tm1Token);
            session = sessions.results[0]; //  TODO-CRITICAL:  Fix "sessions.total" so it reflects the total number of permissioned results instead of the pure total.  I'm not yet sure how we should calculate that... maybe store this separately?  Maybe avoid ACL rules that depend on the data itself and rely on explicit white / black lists to support query with a search filter.
        }));
        it('should create a team', () => __awaiter(this, void 0, void 0, function* () {
            const teamParams = { name: 'Sample Boathouse', players: [], invites: ['wrsulliv@umich.edu', 'tm1@rowstream.com', 'tm2@rowstream.com', 'tm3@rowstream.com'] };
            team = yield rowstream_utils_1.teamSDK.create(teamParams, coachToken);
        }));
        it('should retrieve a team instance', () => __awaiter(this, void 0, void 0, function* () {
            const teamInst = yield rowstream_utils_1.teamSDK.retrieve(team.id, coachToken);
        }));
        it('should search team instances', () => __awaiter(this, void 0, void 0, function* () {
            const teams = yield rowstream_utils_1.teamSDK.search({}, coachToken);
        }));
        it('should allow the invited rower to search teams', () => __awaiter(this, void 0, void 0, function* () {
            const teams = yield rowstream_utils_1.teamSDK.search({}, tm1Token);
            if (teams.results.length <= 0) {
                throw new Error("Expected teams");
            }
        }));
        //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
        it.skip('should NOT allow the coach to see team members sessions before they join the team', () => __awaiter(this, void 0, void 0, function* () {
            const sessions = yield rowstream_utils_1.sessionSDK.search({}, coachToken);
            if (sessions.total != 0) {
                throw new Error('Unexpected number of sessions!');
            }
        }));
        //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
        it.skip('should NOT allow the coach to see team members session-stats before they join the team', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionStats = yield rowstream_utils_1.sessionAdditional2StatSDK.search({ metadata: { sessionId: session.id } }, coachToken);
                console.log(sessionStats);
            }
            catch (err) {
                console.log(err);
                return;
            }
            throw new Error('Unexpected return value.');
        }));
        it('should update a team (add the rower)', () => __awaiter(this, void 0, void 0, function* () {
            //  TODO:  Block users from accessing this object at the field level... actually, disable the Team update API altogether?
            //  TODO-CRITICAL:  Update operation should NOT allow the user to specify their own username...  It should validate from the list and add it in the server.
            const teamParams = { name: 'Sample Boathouse', players: ['team_member_1'], invites: ['tm2@rowstream.com', 'tm3@rowstream.com'] };
            team = yield rowstream_utils_1.teamSDK.update(team.id, teamParams, tm1Token);
        }));
        //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
        it.skip('should allow coach to see team members sessions', () => __awaiter(this, void 0, void 0, function* () {
            const sessions = yield rowstream_utils_1.sessionSDK.search({}, coachToken);
            if (sessions.total == 0) {
                throw new Error('Unexpected number of sessions!');
            }
        }));
        //  TODO-IMPORTANT:  Unskip this.  Skipping to test the app without so much data to slow it down (eventually need some optimizations like caching SessionStat results on the Session object)!
        it.skip('should allow the coach to see team members session-stats', () => __awaiter(this, void 0, void 0, function* () {
            const sessionStats = yield rowstream_utils_1.sessionAdditional2StatSDK.search({ metadata: { sessionId: session.id } }, coachToken);
            if (sessionStats.results.length == 0) {
                throw new Error('Unexpected number of session-stats!');
            }
        }));
        it('should create team members with profiles ', () => __awaiter(this, void 0, void 0, function* () {
            //  Join the Team
            //  TODO-CRITICAL:  Prevent a user from getting direct access to this list!  Right now, ANY user with access can add ANYBODY to the list...  MAYBE field level ACL, OR create a separate system to handle this.  Maybe an "JoinRequest"?
            const teamParams = { name: 'Sample Boathouse', players: ['team_member_1', 'team_member_2', 'team_member_3'], invites: [] };
            team = yield rowstream_utils_1.teamSDK.update(team.id, teamParams, tm1Token);
        }));
    });
});
//# sourceMappingURL=team.test.js.map