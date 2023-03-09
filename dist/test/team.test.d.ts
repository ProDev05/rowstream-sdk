/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
import { GeneralStatus, AdditionalStatus1, AdditionalStatus2 } from '../src/tools/pm5-sdk';
export interface ComboStat {
    generalStats: GeneralStatus[];
    additional1Stats: AdditionalStatus1[];
    additional2Stats: AdditionalStatus2[];
}
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
export declare const stripTime: (date: Date) => Date;
export declare const generateSessionStats: (token: string, sessionId: string, multiplier: number) => Promise<void>;
/**
 * Creates Sessions with the specified parameters.
 * Both StartDate and EndDate are candidate dates.
 */
export declare const generateData: (params: SessionGeneratorParams) => Promise<void>;
