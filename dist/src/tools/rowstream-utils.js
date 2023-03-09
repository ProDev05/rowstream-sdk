"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/ReactNativeStarter,
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
const sdks_1 = require("../sdks");
const message_sdk_1 = require("../sdks/message-sdk");
exports.buildHTTPHost = (hostname, tls) => {
    return `http${tls ? 's' : ''}://${hostname}:3000/v0`;
};
exports.buildWSHost = (hostname, tls) => {
    return `ws${tls ? 's' : ''}://${hostname}:3000`;
};
exports.buildSDKs = (host) => {
    return {
        userSDK: new sdks_1.UserSDK(host),
        sessionSDK: new sdks_1.SessionSDK(host),
        sessionGeneralStatSDK: new sdks_1.SessionGeneralStatSDK(host),
        sessionAdditional1StatSDK: new sdks_1.SessionAdditional1StatSDK(host),
        sessionAdditional2StatSDK: new sdks_1.SessionAdditional2StatSDK(host),
        sessionStrokeDataStatSDK: new sdks_1.SessionStrokeDataStatSDK(host),
        teamSDK: new sdks_1.TeamSDK(host),
        profileSDK: new sdks_1.ProfileSDK(host),
        eventLoggerSDK: new sdks_1.EventLoggerSDK(host),
        tokenSDK: new sdks_1.TokenSDK(host),
        workoutSDK: new sdks_1.WorkoutSDK(host),
        messageSDK: new message_sdk_1.MessageSDK(host)
    };
};
//  TODO:  Get this from an ENV var?  This would work in the Server context, not sure about the UI context?
//  TODO:  Refactor this so the SDKs can be re-built after setting the host, OR load from a config, etc...
// export const host = 'https://rowstream.herokuapp.com/v0';
//  Will's AWS Account
// const remote_host = 'ec2-18-119-0-131.us-east-2.compute.amazonaws.com';
//  Jon's AWS Account
// const remote_host = 'RowStream-Signed-LoadBalancer-1756237213.us-east-2.elb.amazonaws.com';
//  RowStream API
const remote_host = 'api.rowstream.com';
//  CONSIDER:  We can have a Debug / Production ENV var to start?  THEN differentiate further as needed.
//  Zach's
// const remote_host = '192.168.88.211';
//  iPhone
// const remote_host = "172.20.10.2";
//  Will's Wifi
// const remote_host = "192.168.88.239";
// const remote_host = "localhost";
//  TODO-CRITICAL:  Use HTTPS!
exports.host = `https://${remote_host}:3000/v0`;
console.log('RowStream:  Running with host: ' + exports.host);
// export const wsHost = 'wss://rowstream.herokuapp.com';
exports.wsHost = `wss://${remote_host}:3000`;
//  SDKS
exports.userSDK = new sdks_1.UserSDK(exports.host);
exports.sessionSDK = new sdks_1.SessionSDK(exports.host);
exports.sessionGeneralStatSDK = new sdks_1.SessionGeneralStatSDK(exports.host);
exports.sessionAdditional1StatSDK = new sdks_1.SessionAdditional1StatSDK(exports.host);
exports.sessionAdditional2StatSDK = new sdks_1.SessionAdditional2StatSDK(exports.host);
exports.sessionStrokeDataStatSDK = new sdks_1.SessionStrokeDataStatSDK(exports.host);
exports.teamSDK = new sdks_1.TeamSDK(exports.host);
exports.profileSDK = new sdks_1.ProfileSDK(exports.host);
exports.eventLoggerSDK = new sdks_1.EventLoggerSDK(exports.host);
exports.tokenSDK = new sdks_1.TokenSDK(exports.host);
exports.workoutSDK = new sdks_1.WorkoutSDK(exports.host);
exports.messageSDK = new message_sdk_1.MessageSDK(exports.host);
//  Constants
//  Constants
exports.distanceFieldGeneral = 'distance';
exports.elapsedTimeFieldGeneral = 'elapsedTime';
exports.currentPaceFieldAdditional1 = 'currentPace';
exports.strokeRateFieldAdditional1 = 'strokeRate';
exports.averagePowerFieldAdditional2 = 'averagePower';
exports.strokeCountStrokeData = 'strokeCount';
exports.intervalCountAdditional2 = 'intervalCount';
var ParamType;
(function (ParamType) {
    ParamType[ParamType["General"] = 0] = "General";
    ParamType[ParamType["Additonal1"] = 1] = "Additonal1";
    ParamType[ParamType["Additional2"] = 2] = "Additional2";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
exports.ParamTypeToSDKMap = {
    [ParamType.General]: exports.sessionGeneralStatSDK,
    [ParamType.Additonal1]: exports.sessionAdditional1StatSDK,
    [ParamType.Additional2]: exports.sessionAdditional2StatSDK,
};
exports.getStatHighlights = (session, stats) => {
    //  Get Session Values
    const totalSessionDistanceMeters = stats.generalStats[exports.distanceFieldGeneral].max / 10; //  Convert from 1/10M to M.
    const totalSessionRowingTime = stats.generalStats[exports.elapsedTimeFieldGeneral].max; //  TODO:  Make sure this isn't supposed to be WorkoutDuration... maybe ElapsedTime is for the total time again, but measured by the PM5.
    const totalSessionStrokeCount = stats.strokeDataStats[exports.strokeCountStrokeData].max;
    const sessionStartTime = new Date(session.start);
    const sessionEndTime = new Date(session.end);
    const averagePower = stats.additional2Stats[exports.averagePowerFieldAdditional2].avg; //  TODO:  Needs to be updated like the others.
    const intervalCount = stats.additional2Stats[exports.intervalCountAdditional2].max;
    //  Determine Derived Stats
    const totalNum500MetersTravelled = (totalSessionDistanceMeters / 500);
    const averageStrokeRate = totalSessionStrokeCount / totalSessionRowingTime;
    const averageSplit = totalSessionRowingTime / totalNum500MetersTravelled;
    const totalTime = (sessionEndTime.getTime() - sessionStartTime.getTime());
    //  Define the SessionHighlights
    const sessionHighlights = {
        elapsedRowingTime: totalSessionRowingTime,
        averageStrokeRate,
        averagePower,
        totalDistance: totalSessionDistanceMeters,
        totalTime,
        averageSplit,
        intervalCount
    };
    return sessionHighlights;
};
exports.getStatBuckets = (params, statType, token) => __awaiter(this, void 0, void 0, function* () {
    const sdk = exports.ParamTypeToSDKMap[statType];
    const buckets = yield sdk.bucketQuery(params, token); //  TODO:  Filter by statName!
    return buckets;
});
exports.getStats = (sessionId, statName, statType, token) => __awaiter(this, void 0, void 0, function* () {
    console.warn('Get Stats');
    const sdk = exports.ParamTypeToSDKMap[statType];
    const stats = (yield sdk.search({ search: { match: { sessionId } } }, token)).results; //  TODO:  Filter by statName!
    const statList = stats.map((rawStat) => {
        const stat = { statName, statType, value: rawStat[statName], id: rawStat.id, created: rawStat.created, updated: rawStat.updated, owner: rawStat.owner, elapsedTime: rawStat.elapsedTime };
        return stat;
    });
    return statList;
});
//  TODO-CRITICAL:  Deal with paging.
exports.getSessions = (params, token) => __awaiter(this, void 0, void 0, function* () {
    //  Unpack Params
    const { generalStats, additional1Stats, additional2Stats, strokeDataStats, sessionIds = [], owners = [], allowOpen = false } = params;
    //  Handle Undefined Case
    //  TODO:  This SHOULD be handled by the backend.  When an empty array is passed to "any" we need to decide what to do with that... Does it permit ALL or disallow ALL?
    if (params.owners && params.owners.length <= 0) {
        return [];
    }
    if (params.sessionIds && params.sessionIds.length <= 0) {
        return [];
    }
    //  Create the Owner Search Terms
    const ownerSearchTerms = owners.map((owner) => ({ match: { owner } }));
    //  Create the SessionID Terms
    const sessionTerms = sessionIds.map((sessionId) => ({ match: { id: sessionId } }));
    //  Get the Sessions
    const sessionList = (yield exports.sessionSDK.search({ search: { all: [{ any: ownerSearchTerms }, { any: sessionTerms }] } }, token)).results;
    //  Filter Incomplete Sessions
    //  TODO:  Handle sessions without an end date!  Maybe show a message to the user upon login?
    const completeSessions = sessionList.filter((session) => {
        if (session.start == undefined) {
            return false;
        }
        if (session.end == undefined) {
            return allowOpen ? true : false;
        }
        return true;
    }); //  Convert to 'ClosedSessionInternal' because the end date is present.
    //  Convert Session -> SessionSummary
    const sessionSummaryList = [];
    for (const session of completeSessions) {
        //  Get the Stats
        //  TODO-CRITICAL:  Optimize this... We should not need to get the stats for ALL sessions.  Cache summary info on "Session" instead.
        const { id: sessionId } = session;
        const sessionGeneralStatList = generalStats.length ? yield exports.sessionGeneralStatSDK.getStats({ match: { sessionId }, fields: generalStats }, token) : undefined;
        console.log('test');
        const sessionAdditional1StatList = additional1Stats.length ? yield exports.sessionAdditional1StatSDK.getStats({ match: { sessionId }, fields: additional1Stats }, token) : undefined;
        console.log('test');
        const sessionAdditional2StatList = additional2Stats.length ? yield exports.sessionAdditional2StatSDK.getStats({ match: { sessionId }, fields: additional2Stats }, token) : undefined;
        console.log('test');
        const sessionStrokeDataStatList = strokeDataStats.length ? yield exports.sessionStrokeDataStatSDK.getStats({ match: { sessionId }, fields: strokeDataStats }, token) : undefined;
        console.log('test');
        const sessionStats = {
            generalStats: sessionGeneralStatList,
            additional1Stats: sessionAdditional1StatList,
            additional2Stats: sessionAdditional2StatList,
            strokeDataStats: sessionStrokeDataStatList
        };
        //  Create the SessionHighlights
        const sessionHighlights = yield exports.getStatHighlights(session, sessionStats);
        //  Create the SessionSummary
        const sessionSummary = { internal: session, stats: sessionStats, highlights: sessionHighlights };
        sessionSummaryList.push(sessionSummary);
    }
    return sessionSummaryList;
});
exports.getTeam = (user, token) => __awaiter(this, void 0, void 0, function* () {
    //  Get the Team Owned by this Coach
    const teams = yield exports.teamSDK.search({}, token);
    //  Validate
    //  TODO-CRITICAL:  Enforce only one team per member... Maybe don't let an invite be sent?  Maybe just support multiple?
    //  if (teams.results.length > 1) { throw new Error("Multiple Teams per Member are not currently supported."); }
    return teams.results.find(team => team.players.indexOf(user.username));
    //  //  Get the Team
    //  const team = teams.results[0];
    //  return team;
});
//# sourceMappingURL=rowstream-utils.js.map