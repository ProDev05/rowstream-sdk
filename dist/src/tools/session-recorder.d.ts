/**
 * Copyright (c) 2019 Jonathan Andersen
 *
 * This software is proprietary and owned by Jonathan Andersen.
 */
import { APIUser, WorkoutInternal } from '../models';
import { PM5RowingService, PM5Stat, StatType as StatType } from './pm5-sdk';
export declare enum SessionRecorderErrorType {
    IntervalWorkoutError = 0
}
export interface SessionRecorderError {
    type: SessionRecorderErrorType;
    message: string;
}
/**
 * Records an active Session with Event / Error Logging, Local Storage, and Normalized Logic.
 */
export declare class SessionRecorder {
    private rowingService;
    private token;
    private onStat;
    private user;
    private onError;
    private workout?;
    private sessionStarted;
    private statusStores;
    private firstStatusEntries;
    private lastStatusEntries;
    private statSyncTimers;
    private syncInterval;
    private sessionInternal?;
    private session?;
    private startTime?;
    private sessionStorage;
    constructor(rowingService: PM5RowingService, token: string, onStat: (stat: PM5Stat, statType: StatType) => void, user: APIUser, storage: any, onError: (error: SessionRecorderError) => void, workout?: WorkoutInternal);
    init(): Promise<void>;
    private syncStatuses;
    private handleStatus;
    endSession(): Promise<void>;
}
