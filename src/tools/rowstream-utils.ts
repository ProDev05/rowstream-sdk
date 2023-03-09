 /**
  * Copyright (c) 2019 Jonathan Andersen
  * Copyright (c) 2019 William R. Sullivan
  *
  * This software is proprietary and owned by Jonathan Andersen.
  *
  * This software was based on https://github.com/wrsulliv/ReactNativeStarter,
  * licensed under the MIT license.
  */

 //  TODO:  General:  Make the verification page look nicer AND move to the RowStream.com domain.  Improve email template.

 import { AggResult, BaseObject, BucketQueryParamsAPI, BucketQueryReturn, SessionInternal, APIUser } from '../models';
import { EventLoggerSDK, ProfileSDK, WorkoutSDK, SessionAdditional1StatSDK, SessionAdditional2StatSDK, SessionGeneralStatSDK, SessionSDK, SessionStrokeDataStatSDK, TeamSDK, TokenSDK, UserSDK } from '../sdks';
import { MessageSDK } from '../sdks/message-sdk';

export const buildHTTPHost = (hostname: string, tls: boolean) => {
  return `http${ tls ? 's' : '' }://${ hostname }:3000/v0`;
};

export const buildWSHost = (hostname: string, tls: boolean) => {
  return `ws${ tls ? 's' : '' }://${ hostname }:3000`;
};

export interface SDKs {
  userSDK: UserSDK;
  sessionSDK: SessionSDK;
  sessionGeneralStatSDK: SessionGeneralStatSDK;
  sessionAdditional1StatSDK: SessionAdditional1StatSDK;
  sessionAdditional2StatSDK: SessionAdditional2StatSDK;
  sessionStrokeDataStatSDK: SessionStrokeDataStatSDK;
  teamSDK: TeamSDK;
  profileSDK: ProfileSDK;
  eventLoggerSDK: EventLoggerSDK;
  tokenSDK: TokenSDK;
  workoutSDK: WorkoutSDK;
  messageSDK: MessageSDK;
}

export const buildSDKs = (host: string): SDKs => {

  return {
    userSDK: new UserSDK(host),
    sessionSDK: new SessionSDK(host),
    sessionGeneralStatSDK: new SessionGeneralStatSDK(host),
    sessionAdditional1StatSDK: new SessionAdditional1StatSDK(host),
    sessionAdditional2StatSDK: new SessionAdditional2StatSDK(host),
    sessionStrokeDataStatSDK: new SessionStrokeDataStatSDK(host),
    teamSDK: new TeamSDK(host),
    profileSDK: new ProfileSDK(host),
    eventLoggerSDK: new EventLoggerSDK(host),
    tokenSDK: new TokenSDK(host),
    workoutSDK: new WorkoutSDK(host),
    messageSDK: new MessageSDK(host)
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
export const host = `https://${remote_host}:3000/v0`;
console.log('RowStream:  Running with host: ' + host);
// export const wsHost = 'wss://rowstream.herokuapp.com';
export const wsHost = `wss://${remote_host}:3000`;

 //  SDKS
 export const userSDK = new UserSDK(host);
 export const sessionSDK = new SessionSDK(host);
 export const sessionGeneralStatSDK = new SessionGeneralStatSDK(host);
 export const sessionAdditional1StatSDK = new SessionAdditional1StatSDK(host);
 export const sessionAdditional2StatSDK = new SessionAdditional2StatSDK(host);
 export const sessionStrokeDataStatSDK = new SessionStrokeDataStatSDK(host);
 export const teamSDK = new TeamSDK(host);
 export const profileSDK = new ProfileSDK(host);
 export const eventLoggerSDK = new EventLoggerSDK(host);
 export const tokenSDK = new TokenSDK(host);
 export const workoutSDK = new WorkoutSDK(host);

 export const messageSDK = new MessageSDK(host);


 //  Constants
 //  Constants
 export const distanceFieldGeneral = 'distance';
 export const elapsedTimeFieldGeneral = 'elapsedTime';
 export const currentPaceFieldAdditional1 = 'currentPace';
 export const strokeRateFieldAdditional1 = 'strokeRate';
 export const averagePowerFieldAdditional2 = 'averagePower';
 export const strokeCountStrokeData = 'strokeCount';
 export const intervalCountAdditional2 = 'intervalCount';

 export enum ParamType {
   General, Additonal1, Additional2
 }

 export const ParamTypeToSDKMap = {
   [ParamType.General]: sessionGeneralStatSDK,
   [ParamType.Additonal1]: sessionAdditional1StatSDK,
   [ParamType.Additional2]: sessionAdditional2StatSDK,
 };

 export interface GetSessionParams {
   generalStats: string[];
   additional1Stats: string[];
   additional2Stats: string[];
   strokeDataStats: string[];
   sessionIds?: string[];
   owners?: string[];
   allowOpen?: boolean;
 }

 export interface SessionStats {
   generalStats: AggResult;
   additional1Stats: AggResult;
   additional2Stats: AggResult;
   strokeDataStats: AggResult;
   [statName: string]: AggResult;
 }

 export interface SessionHighlights {
   elapsedRowingTime: number; //  MS
   averageStrokeRate: number; //  Strokes / MS
   averagePower: number; //  Watts
   totalDistance: number; //  Meters
   totalTime: number; //  MS
   averageSplit: number; //  MS / 500M
   intervalCount: number;
 }

 export interface SessionSummary {
   internal: ClosedSessionInternal;
   stats: SessionStats;
   highlights: SessionHighlights;
 }

 export interface Stat extends BaseObject {
   statName: string;
   statType: ParamType;
   value: any;
   elapsedTime: Date;
 }

 export interface ClosedSessionInternal extends SessionInternal {
   end: string;
 }

 export const getStatHighlights = (session: ClosedSessionInternal, stats: SessionStats): SessionHighlights => {

   //  Get Session Values
   const totalSessionDistanceMeters = stats.generalStats[distanceFieldGeneral].max / 10; //  Convert from 1/10M to M.
   const totalSessionRowingTime = stats.generalStats[elapsedTimeFieldGeneral].max;  //  TODO:  Make sure this isn't supposed to be WorkoutDuration... maybe ElapsedTime is for the total time again, but measured by the PM5.
   const totalSessionStrokeCount = stats.strokeDataStats[strokeCountStrokeData].max;
   const sessionStartTime = new Date(session.start);
   const sessionEndTime = new Date(session.end);
   const averagePower = stats.additional2Stats[averagePowerFieldAdditional2].avg;  //  TODO:  Needs to be updated like the others.
   const intervalCount = stats.additional2Stats[intervalCountAdditional2].max;

   //  Determine Derived Stats
   const totalNum500MetersTravelled = (totalSessionDistanceMeters / 500);
   const averageStrokeRate = totalSessionStrokeCount / totalSessionRowingTime;
   const averageSplit = totalSessionRowingTime / totalNum500MetersTravelled;
   const totalTime = (sessionEndTime.getTime() - sessionStartTime.getTime());

   //  Define the SessionHighlights
   const sessionHighlights: SessionHighlights = {
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

 export const getStatBuckets = async (params: BucketQueryParamsAPI, statType: ParamType, token: string): Promise<BucketQueryReturn[]> => {
   const sdk = ParamTypeToSDKMap[statType];
   const buckets = await sdk.bucketQuery(params, token);  //  TODO:  Filter by statName!
   return buckets;
 };

 export const getStats = async (sessionId: string, statName: string, statType: ParamType, token: string): Promise<Stat[]> => {
   console.warn('Get Stats');
   const sdk = ParamTypeToSDKMap[statType];
   const stats: any[] = (await sdk.search({ search: { match: { sessionId } } }, token)).results;  //  TODO:  Filter by statName!
   const statList = stats.map((rawStat: any) => {
     const stat: Stat = { statName, statType, value: (rawStat as any)[statName], id: rawStat.id, created: rawStat.created, updated: rawStat.updated, owner: rawStat.owner, elapsedTime: (rawStat as any).elapsedTime };
     return stat;
   });
   return statList;
 };

 //  TODO-CRITICAL:  Deal with paging.
 export const getSessions = async (params: GetSessionParams, token: string): Promise<SessionSummary[]> => {

     //  Unpack Params
     const { generalStats, additional1Stats, additional2Stats, strokeDataStats, sessionIds = [], owners = [], allowOpen = false } = params;

     //  Handle Undefined Case
     //  TODO:  This SHOULD be handled by the backend.  When an empty array is passed to "any" we need to decide what to do with that... Does it permit ALL or disallow ALL?
     if (params.owners && params.owners.length <= 0) { return []; }
     if (params.sessionIds && params.sessionIds.length <= 0) { return []; }

     //  Create the Owner Search Terms
     const ownerSearchTerms = owners.map((owner) => ({ match: { owner } }));

     //  Create the SessionID Terms
     const sessionTerms = sessionIds.map((sessionId) => ({ match: { id: sessionId } }));

     //  Get the Sessions
     const sessionList: SessionInternal[] = (await sessionSDK.search({ search: { all: [ { any: ownerSearchTerms }, { any: sessionTerms } ] } }, token)).results;

     //  Filter Incomplete Sessions
     //  TODO:  Handle sessions without an end date!  Maybe show a message to the user upon login?
     const completeSessions = sessionList.filter((session) => {
       if (session.start == undefined) { return false; }
       if (session.end == undefined) { return allowOpen ? true : false; }
       return true;
     }) as ClosedSessionInternal[];  //  Convert to 'ClosedSessionInternal' because the end date is present.

     //  Convert Session -> SessionSummary
     const sessionSummaryList: SessionSummary[] = [];
     for (const session of completeSessions) {

       //  Get the Stats
       //  TODO-CRITICAL:  Optimize this... We should not need to get the stats for ALL sessions.  Cache summary info on "Session" instead.
       const { id: sessionId } = session;
       const sessionGeneralStatList = generalStats.length ? await sessionGeneralStatSDK.getStats({ match: { sessionId }, fields: generalStats }, token) : undefined;
       console.log('test');

       const sessionAdditional1StatList = additional1Stats.length ? await sessionAdditional1StatSDK.getStats({ match: { sessionId }, fields: additional1Stats }, token) : undefined;
       console.log('test');

       const sessionAdditional2StatList = additional2Stats.length ? await sessionAdditional2StatSDK.getStats({ match: { sessionId }, fields: additional2Stats }, token) : undefined;
       console.log('test');

       const sessionStrokeDataStatList = strokeDataStats.length ? await sessionStrokeDataStatSDK.getStats({ match: { sessionId }, fields: strokeDataStats }, token) : undefined;
       console.log('test');

       const sessionStats: SessionStats = {
         generalStats: sessionGeneralStatList,
         additional1Stats: sessionAdditional1StatList,
         additional2Stats: sessionAdditional2StatList,
         strokeDataStats: sessionStrokeDataStatList
       };

       //  Create the SessionHighlights
       const sessionHighlights = await getStatHighlights(session, sessionStats);

       //  Create the SessionSummary
       const sessionSummary: SessionSummary = { internal: session, stats: sessionStats, highlights: sessionHighlights };
       sessionSummaryList.push(sessionSummary);
     }

     return sessionSummaryList;
 };

 export const getTeam = async (user: APIUser, token: string) => {



   //  Get the Team Owned by this Coach
   const teams = await teamSDK.search({}, token);

   //  Validate
   //  TODO-CRITICAL:  Enforce only one team per member... Maybe don't let an invite be sent?  Maybe just support multiple?
  //  if (teams.results.length > 1) { throw new Error("Multiple Teams per Member are not currently supported."); }
  return teams.results.find(team => team.players.indexOf(user.username));

  //  //  Get the Team
  //  const team = teams.results[0];

  //  return team;
 };
