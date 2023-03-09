// /**
//  * Copyright (c) 2019 Jonathan Andersen
//  *
//  * This software is proprietary and owned by Jonathan Andersen.
//  */

// export enum WorkoutType {
//   "Just Row - No Splits" = 0,
//   "Just Row - Splits" = 1,
//   "Fixed Distance - No Splits" = 2,
//   "Fixed Distance - Splits" = 3,
//   "Fixed Time - No Splits" = 4,
//   "Fixed Time - Splits" = 5,
//   "Fixed Time - Interval" = 6,
//   "Fixed Distance - Interval" = 7,
//   "Variable (Interval)" = 8,
//   "Variable (Undefined) Rest (Interval)" = 9,
//   "Fixed Calorie" = 10,
//   "Fixed Watt Minutes" = 11,
//   "Fixed Calories - Interval" = 12,
//   "Num" = 13
// }

// export enum IntervalType {
//   "Time" = 0,
//   "Dist" = 1,
//   "Rest" = 2,
//   "Time Rest Undefined" = 3,
//   "Distance Rest Undefined" = 4,
//   "Rest Undefined" = 5,
//   "Calorie" = 6,
//   "Calorie Rest Undefined" = 7,
//   "Wait Minute" = 8,
//   "Wait Minute Rest Undefined" = 9,
//   "None" = 255
// }

// export enum WorkoutState {
//   "Wait to Begin" = 0,
//   "Workout Row" = 1,
//   "Countdown Pause" = 2,
//   "Interval Rest" = 3,
//   "Interval Work Time" = 4,
//   "Interval Work Distance" = 5,
//   "Interval Rest End To Work Time" = 6,
//   "Interval Rest End To Work Time Distance" = 7,
//   "Interval Work Time To Rest" = 8,
//   "Interval Work Distance To Rest" = 9,
//   "Workout End" = 10,
//   "Terminate" = 11,
//   "Workout Logged" = 12,
//   "Re-Arm" = 13
// }

// export enum RowingState {
//   Inactive = 0,
//   Active = 1
// }

// export enum StrokeState {
//   "Waiting for Wheel to Reach Min Speed" = 0,
//   "Waiting for Wheel to Accelerate" = 1,
//   "Driving" = 2,
//   "Dwelling After Drive" = 3,
//   "Recovery" = 4
// }

// export enum WorkoutDurationType {
//   "Time Duration" = 0,
//   "Calories Duration" = 0x40,
//   "Distance Duration" = 0x80,
//   "Watts Duration" = 0xC0
// }

// export enum DragFactor {

// }

// //  //  Average Time / 500m, Average Stroke Rate, Average Power, and Total Distance.
// export interface GeneralStatus {
//   elapsedTime: Date; //  0.01 seconds
//   distance: number;    // 0.1 meters
//   workoutType: WorkoutType;
//   intervalType: IntervalType;
//   workoutState: WorkoutState;
//   rowingState: RowingState;
//   strokeState: StrokeState;
//   totalWorkDistance: number;
//   workoutDuration: number | any; // (if time, 0.01 sec) //  TODO:  Not sure what other values this can take.
//   workoutDurationType: WorkoutDurationType;
//   dragFactor: any; //  TODO:  Not listed in the doc.
// }


// export interface AdditionalStatus1 {
//   elapsedTime: Date;
//   speed: number;  //  CSAFE_GETSPEED_CMD6
//   strokeRate: number; //  (strokes/min), CSAFE_PM_GET_STROKERA TE
//   heartRate: number;  //  (bpm, 255=invalid), CSAFE_PM_GET_AVG_HEARTRATE
//   currentPace: Date;  //  (0.01 sec lsb), CSAFE_PM_GET_STROKE_500MPACE
//   averagePace: Date;  //  (0.01 sec lsb), CSAFE_PM_GET_TOTAL_AVG_500MPACE
//   restDistance: number;  //  CSAFE_PM_GET_RESTDISTANCE
//   restTime: number;  //  (0.01 sec lsb) CSAFE_PM_GET_RESTTIME
// }

// export interface AdditionalStatus2 {
//   elapsedTime: Date;  //  (0.01 sec lsb),
//   intervalCount: number;  //  CSAFE_PM_GET_WORKOUTINTERVALCOUNT7
//   averagePower: number;  //  CSAFE_PM_GET_TOTAL_AVG_POWER
//   totalCalories: number;  //  (cals), CSAFE_PM_GET_TOTAL_AVG_CALORIES
//   splitIntAvgPace: number;  //  (0.01 sec lsb), CSAFE_PM_GET_SPLIT_AVG_500MPACE
//   splitIntAvgPower: number;  //  (watts), CSAFE_PM_GET_SPLIT_A VG_POWER
//   splitIntAvgCalories: number;  //  (cals/hr), CSAFE_PM_GET_SPLIT_A VG_CALORIES
//   lastSplitTime: number;  //  (0.1 sec lsb), CSAFE_PM_GET_LAST_SPLITTIME
//   lastSplitDistance: number;  //  , CSAFE_PM_GET_LAST_SPLITDISTANCE (in meters)
// }

// export interface RowingStrokeData {
//   elapsedTime: Date;  //  (0.01 sec lsb),
//   distance: number; //  (0.1 m lsb)
//   driveLength: number; //  (0.01 meters, max = 2.55m), CSAFE_PM_GET_STROKESTATS
//   driveTime: number; //  (0.01 sec, max = 2.55 sec),
//   strokeRecoveryTime: number; //  (0.01 sec, max = 655.35 sec), CSAFE_PM_GET_STROKESTATS
//   strokeDistance: number; //  (0.01 m, max=655.35m), CSAFE_PM_GET_STROKESTATS
//   peakDriveForce: number; //  (0.1 lbs of force, max=6553.5m), CSAFE_PM_GET_STROKESTATS
//   averageDriveForce: number; //  (0.1 lbs of force, max=6553.5m), CSAFE_PM_GET_STROKESTATS
//   workPerStroke: number; //  (0.1 Joules, max=6553.5 Joules), CSAFE_PM_GET_STROKESTATS
//   strokeCount: number; //  CSAFE_PM_GET_STROKESTATS
// }