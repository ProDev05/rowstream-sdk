/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/ReactNativeStarter,
 * licensed under the MIT license.
 */
import { AggResult, BaseObject, BucketQueryParamsAPI, BucketQueryReturn, SessionInternal, APIUser } from '../models';
import { EventLoggerSDK, ProfileSDK, WorkoutSDK, SessionAdditional1StatSDK, SessionAdditional2StatSDK, SessionGeneralStatSDK, SessionSDK, SessionStrokeDataStatSDK, TeamSDK, TokenSDK, UserSDK } from '../sdks';
import { MessageSDK } from '../sdks/message-sdk';
export declare const buildHTTPHost: (hostname: string, tls: boolean) => string;
export declare const buildWSHost: (hostname: string, tls: boolean) => string;
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
export declare const buildSDKs: (host: string) => SDKs;
export declare const host: string;
export declare const wsHost: string;
export declare const userSDK: UserSDK;
export declare const sessionSDK: SessionSDK;
export declare const sessionGeneralStatSDK: SessionGeneralStatSDK;
export declare const sessionAdditional1StatSDK: SessionAdditional1StatSDK;
export declare const sessionAdditional2StatSDK: SessionAdditional2StatSDK;
export declare const sessionStrokeDataStatSDK: SessionStrokeDataStatSDK;
export declare const teamSDK: TeamSDK;
export declare const profileSDK: ProfileSDK;
export declare const eventLoggerSDK: EventLoggerSDK;
export declare const tokenSDK: TokenSDK;
export declare const workoutSDK: WorkoutSDK;
export declare const messageSDK: MessageSDK;
export declare const distanceFieldGeneral = "distance";
export declare const elapsedTimeFieldGeneral = "elapsedTime";
export declare const currentPaceFieldAdditional1 = "currentPace";
export declare const strokeRateFieldAdditional1 = "strokeRate";
export declare const averagePowerFieldAdditional2 = "averagePower";
export declare const strokeCountStrokeData = "strokeCount";
export declare const intervalCountAdditional2 = "intervalCount";
export declare enum ParamType {
    General = 0,
    Additonal1 = 1,
    Additional2 = 2
}
export declare const ParamTypeToSDKMap: {
    [ParamType.General]: SessionGeneralStatSDK;
    [ParamType.Additonal1]: SessionAdditional1StatSDK;
    [ParamType.Additional2]: SessionAdditional2StatSDK;
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
    elapsedRowingTime: number;
    averageStrokeRate: number;
    averagePower: number;
    totalDistance: number;
    totalTime: number;
    averageSplit: number;
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
export declare const getStatHighlights: (session: ClosedSessionInternal, stats: SessionStats) => SessionHighlights;
export declare const getStatBuckets: (params: BucketQueryParamsAPI, statType: ParamType, token: string) => Promise<BucketQueryReturn[]>;
export declare const getStats: (sessionId: string, statName: string, statType: ParamType, token: string) => Promise<Stat[]>;
export declare const getSessions: (params: GetSessionParams, token: string) => Promise<SessionSummary[]>;
export declare const getTeam: (user: APIUser, token: string) => Promise<import("../models").TeamInternal>;
