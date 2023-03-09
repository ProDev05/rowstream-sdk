/**
 * Copyright (c) 2019 Jonathan Andersen
 *
 * This software is proprietary and owned by Jonathan Andersen.
 */
import { Device } from './ble-plex';
export declare const reverseEnum: (enumeration: any) => any;
export declare enum WorkoutType {
    "Just Row - No Splits" = 0,
    "Just Row - Splits" = 1,
    "Fixed Distance - No Splits" = 2,
    "Fixed Distance - Splits" = 3,
    "Fixed Time - No Splits" = 4,
    "Fixed Time - Splits" = 5,
    "Fixed Time - Interval" = 6,
    "Fixed Distance - Interval" = 7,
    "Variable (Interval)" = 8,
    "Variable (Undefined) Rest (Interval)" = 9,
    "Fixed Calorie" = 10,
    "Fixed Watt Minutes" = 11,
    "Fixed Calories - Interval" = 12,
    "Num" = 13
}
export declare enum IntervalType {
    "Time" = 0,
    "Dist" = 1,
    "Rest" = 2,
    "Time Rest Undefined" = 3,
    "Distance Rest Undefined" = 4,
    "Rest Undefined" = 5,
    "Calorie" = 6,
    "Calorie Rest Undefined" = 7,
    "Wait Minute" = 8,
    "Wait Minute Rest Undefined" = 9,
    "None" = 255
}
export declare enum WorkoutState {
    "Wait to Begin" = 0,
    "Workout Row" = 1,
    "Countdown Pause" = 2,
    "Interval Rest" = 3,
    "Interval Work Time" = 4,
    "Interval Work Distance" = 5,
    "Interval Rest End To Work Time" = 6,
    "Interval Rest End To Work Time Distance" = 7,
    "Interval Work Time To Rest" = 8,
    "Interval Work Distance To Rest" = 9,
    "Workout End" = 10,
    "Terminate" = 11,
    "Workout Logged" = 12,
    "Re-Arm" = 13
}
export declare enum RowingState {
    Inactive = 0,
    Active = 1
}
export declare enum StrokeState {
    "Waiting for Wheel to Reach Min Speed" = 0,
    "Waiting for Wheel to Accelerate" = 1,
    "Driving" = 2,
    "Dwelling After Drive" = 3,
    "Recovery" = 4
}
export declare enum WorkoutDurationType {
    "Time Duration" = 0,
    "Calories Duration" = 64,
    "Distance Duration" = 128,
    "Watts Duration" = 192
}
export interface PM5Stat {
    elapsedTime: Date;
}
export interface GeneralStatus extends PM5Stat {
    distance: number;
    workoutType: WorkoutType;
    intervalType: IntervalType;
    workoutState: WorkoutState;
    rowingState: RowingState;
    strokeState: StrokeState;
    totalWorkDistance: number;
    workoutDuration: number | any;
    workoutDurationType: WorkoutDurationType;
    dragFactor: any;
}
export interface StatMetadata {
    humanName: string;
    unit?: string;
    conversion?: (value: any) => any;
}
export interface StatMap {
    [name: string]: StatMetadata;
}
export declare const roundDecimal: (num: number) => number;
export declare const generalStatusFields: StatMap;
export interface AdditionalStatus1Bytes {
    elapsedTimeLo: number;
    elapsedTimeMid: number;
    elapsedTimeHigh: number;
    speedLow: number;
    speedHigh: number;
    strokeRate: number;
    heartRate: number;
    currentPaceLo: number;
    currentPaceHigh: number;
    averagePaceLo: number;
    averagePaceHigh: number;
    restDistanceLow: number;
    restDistanceHigh: number;
    restTimeLo: number;
    restTimeMid: number;
    restTimeHigh: number;
}
export declare const additional1StatusFields: StatMap;
export declare enum StatType {
    General = "general",
    Additional1 = "additional1",
    Additional2 = "additional2",
    StrokeData = "strokeData"
}
export interface AdditionalStatus1 extends PM5Stat {
    speed: number;
    strokeRate: number;
    heartRate: number;
    currentPace: Date;
    averagePace: Date;
    restDistance: number;
    restTime: number;
}
export interface RowingStrokeDataBytes {
    elapsedTimeLo: number;
    elapsedTimeMid: number;
    elapsedTimeHigh: number;
    distanceLo: number;
    distanceMid: number;
    distanceHigh: number;
    driveLength: number;
    driveTime: number;
    strokeRecoveryTimeLo: number;
    strokeRecoveryTimeHi: number;
    strokeDistanceLo: number;
    strokeDistanceHi: number;
    peakDriveForceLo: number;
    peakDriveForceHi: number;
    averageDriveForceLo: number;
    averageDriveForceHi: number;
    workPerStrokeLo: number;
    workPerStrokeHi: number;
    strokeCountLo: number;
    strokeCountHi: number;
}
export interface RowingStrokeData extends PM5Stat {
    distance: number;
    driveLength: number;
    driveTime: number;
    strokeRecoveryTime: number;
    strokeDistance: number;
    peakDriveForce: number;
    averageDriveForce: number;
    workPerStroke: number;
    strokeCount: number;
}
export declare const additional2StatusFields: StatMap;
export interface AdditionalStatus2 extends PM5Stat {
    intervalCount: number;
    averagePower: number;
    totalCalories: number;
    splitIntAvgPace: number;
    splitIntAvgPower: number;
    splitIntAvgCalories: number;
    lastSplitTime: number;
    lastSplitDistance: number;
}
export interface AdditionalStatus2Bytes {
    elapsedTimeLo: number;
    elapsedTimeMid: number;
    elapsedTimeHigh: number;
    intervalCount: number;
    averagePowerLo: number;
    averagePowerHi: number;
    totalCaloriesLo: number;
    totalCaloriesHi: number;
    splitIntAvgPaceLo: number;
    splitIntAvgPaceHi: number;
    splitIntAvgPowerLo: number;
    splitIntAvgPowerHi: number;
    splitIntAvgCaloriesLo: number;
    splitIntAvgCaloriesHi: number;
    lastSplitTimeLo: number;
    lastSplitTimeMid: number;
    lastSplitTimeHi: number;
    lastSplitDistanceLo: number;
    lastSplitDistanceMid: number;
    lastSplitDistanceHi: number;
}
export declare class PM5RowingService {
    private device;
    private subscriptions;
    constructor(device: Device);
    subscribeAdditionalStatus1: (callback: (status: AdditionalStatus1) => void) => void;
    subscribeAdditionalStatus2: (callback: (status: AdditionalStatus2) => void) => void;
    subscribeRowingStrokeData: (callback: (status: RowingStrokeData) => void) => void;
    subscribeGeneralStatus: (callback: (status: GeneralStatus) => void) => void;
    unsubscribeAll: () => Promise<void>;
}
