 /**
  * Copyright (c) 2019 Jonathan Andersen
  *
  * This software is proprietary and owned by Jonathan Andersen.
  */

 import { Device, Subscription } from './ble-plex';
 import { render2Digits } from './util';

 interface Characteristic {
   id: string;
   uuid: string;
   isReadable: boolean;
   value: string;
 }

 interface Service {
   id: string;
   uuid: string;
   isPrimary: boolean;
   characteristics: Characteristic[];
 }

 enum Rate {
   //
 }

 //  Services and Characteristics
 const createPM5Id = (id: string) => (`CE06${id}-43E5-11E4-916C-0800200C9A66`);

 //
 //  Services
 //

 enum PM5Service {
   GAP, GATT, Controller, Rowing, Info
 }

 const PM5ServiceUUIDs = {
   [PM5Service.GAP]: createPM5Id('1800'),
   [PM5Service.GATT]: createPM5Id('1801'),
   [PM5Service.Controller]: createPM5Id('0020'),
   [PM5Service.Rowing]: createPM5Id('0030'),
   [PM5Service.Info]: createPM5Id('0010')
 };

 enum PM5Characteristic {
   GAP, GATT, Controller, Rowing, Info
 }

 //
 //  GAP Service
 //

 enum GAPCharacteristic {
   DeviceName, Appearance, PeripheralPrivacy, ReconnectAddress, PeripheralPreferredConnectionParameters
 }

 const GAPCharacteristicUUIDs = {
   [GAPCharacteristic.DeviceName]: createPM5Id('2A00'),
   [GAPCharacteristic.Appearance]: createPM5Id('2A01'),
   [GAPCharacteristic.PeripheralPrivacy]: createPM5Id('2A02'),
   [GAPCharacteristic.ReconnectAddress]: createPM5Id('2A03'),
   [GAPCharacteristic.PeripheralPreferredConnectionParameters]: createPM5Id('2A04')
 };

 //
 //  GATT Service
 //

 enum GATTCharacteristic {
   ServiceChanged, ClientConfiguration
 }

 const GATTCharacteristicUUIDs = {
   [GATTCharacteristic.ServiceChanged]: createPM5Id('2A05'),
   [GATTCharacteristic.ClientConfiguration]: createPM5Id('2902')
 };

 //
 //  Information Service
 //

 enum InformationCharacteristic {
   ModuleNumberString, SerialNumberString, HardwareRevisionString, FirmwareRevisionString, ManufacturerNameString, ErgMachineType
 }

 const InformationCharacteristicUUIDs = {
   [InformationCharacteristic.ModuleNumberString]: createPM5Id('0011'),
   [InformationCharacteristic.SerialNumberString]: createPM5Id('0012'),
   [InformationCharacteristic.HardwareRevisionString]: createPM5Id('0013'),
   [InformationCharacteristic.FirmwareRevisionString]: createPM5Id('0014'),
   [InformationCharacteristic.ManufacturerNameString]: createPM5Id('0015'),
   [InformationCharacteristic.ErgMachineType]: createPM5Id('0016')
 };

 //
 //  Control Service
 //

 enum ControlCharacteristic {
   Receive, Transmit
 }

 const ControlCharacteristicUUIds = {
   [ControlCharacteristic.Receive]: createPM5Id('0021'),
   [ControlCharacteristic.Transmit]: createPM5Id('0022')
 };

 //
 //  Rowing Service
 //  TODO:  Include Multiplex info.
 //

 enum RowingCharacteristic {
   GeneralStatus, AdditionalStatus1, AdditionalStatus2, GeneralAndAdditionalStatusSampleRate, StrokeData,
   AdditionalStrokeData, SplitIntervalData, AdditionalSplitIntervalData, EndOfWorkoutSummaryData,
   EndOfWorkoutSummaryAdditionalData, HeartBeatBeltInformation, ForceCurveData, MultiplexedInformation
 }

 const RowingCharacteristicUUIds = {
   [RowingCharacteristic.GeneralStatus]: createPM5Id('0031'),
   [RowingCharacteristic.AdditionalStatus1]: createPM5Id('0032'),
   [RowingCharacteristic.AdditionalStatus2]: createPM5Id('0033'),
   [RowingCharacteristic.GeneralAndAdditionalStatusSampleRate]: createPM5Id('0034'),
   [RowingCharacteristic.StrokeData]: createPM5Id('0035'),
   [RowingCharacteristic.AdditionalStrokeData]: createPM5Id('0036'),
   [RowingCharacteristic.SplitIntervalData]: createPM5Id('0037'),
   [RowingCharacteristic.AdditionalSplitIntervalData]: createPM5Id('0038'),
   [RowingCharacteristic.EndOfWorkoutSummaryData]: createPM5Id('0039'),
   [RowingCharacteristic.EndOfWorkoutSummaryAdditionalData]: createPM5Id('003A'),
   [RowingCharacteristic.HeartBeatBeltInformation]: createPM5Id('003B'),
   [RowingCharacteristic.ForceCurveData]: createPM5Id('003D'),
   [RowingCharacteristic.MultiplexedInformation]: createPM5Id('0080'),
 };

 export const reverseEnum = (enumeration: any) => {
   const reversedEnum: any = {};
   Object.keys(enumeration).forEach((key) => {
     const value = enumeration[key];
     reversedEnum[key] = value;
   });
   return reversedEnum;
 };

 export enum WorkoutType {
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

 export enum IntervalType {
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

 export enum WorkoutState {
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

 export enum RowingState {
   Inactive = 0,
   Active = 1
 }

 export enum StrokeState {
   "Waiting for Wheel to Reach Min Speed" = 0,
   "Waiting for Wheel to Accelerate" = 1,
   "Driving" = 2,
   "Dwelling After Drive" = 3,
   "Recovery" = 4
 }

 export enum WorkoutDurationType {
   "Time Duration" = 0,
   "Calories Duration" = 0x40,
   "Distance Duration" = 0x80,
   "Watts Duration" = 0xC0
 }

 enum DragFactor {

 }

 export interface PM5Stat {
   elapsedTime: Date;  //  Milliseconds
 }

 export interface GeneralStatus extends PM5Stat {
   distance: number;    // 0.1 meters
   workoutType: WorkoutType;
   intervalType: IntervalType;
   workoutState: WorkoutState;
   rowingState: RowingState;
   strokeState: StrokeState;
   totalWorkDistance: number;
   workoutDuration: number | any; // (if time, 0.01 sec) //  TODO:  Not sure what other values this can take.
   workoutDurationType: WorkoutDurationType;
   dragFactor: any; //  TODO:  Not listed in the doc.
 }

 export interface StatMetadata {
   humanName: string;
   unit?: string;
   conversion?: (value: any) => any;
 }

 export interface StatMap {
   [name: string]: StatMetadata;
 }

 export const roundDecimal = (num: number): number => {
   //  REFERENCE:  https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places#comment49416157_15762794
   const rounded = Math.round((num * 100));
   return rounded / 100;
   // const remainder = rounded % 100;
   // const base = rounded - remainder;
 };

 export const generalStatusFields: StatMap = {
   elapsedTime: {
     humanName: "Elapsed Time",
     unit: "HH:MM:SS",
     conversion: (value: number) => roundDecimal(value / 1000)  //  TODO:  Is it right to round a time?
   },
   distance: {
     humanName: "Distance",
     unit: "METERS",
     conversion: (meters: number) => roundDecimal(meters / 10)
   },
   // workoutType,
   // intervalType,
   // workoutState,
   // rowingState,
   // strokeState,
   totalWorkDistance: {
     humanName: "Total Work Distance",
     unit: "METERS",
     conversion: roundDecimal
   },
   workoutDuration: {
     humanName: "Workout Duration",
     unit: "HH:MM:SS",
     conversion: roundDecimal  //  TODO:  Is it right to round a time?
   },
   // workoutDurationType,
   dragFactor: {
     humanName: "Drag Factor",
     conversion: roundDecimal
   }
 };

 export interface AdditionalStatus1Bytes {
   elapsedTimeLo: number;
   elapsedTimeMid: number;
   elapsedTimeHigh: number;
   speedLow: number;  //  CSAFE_GETSPEED_CMD6
   speedHigh: number;
   strokeRate: number; //  (strokes/min), CSAFE_PM_GET_STROKERA TE
   heartRate: number;  //  (bpm, 255=invalid), CSAFE_PM_GET_AVG_HEARTRATE
   currentPaceLo: number;  //  (0.01 sec lsb), CSAFE_PM_GET_STROKE_500MPACE
   currentPaceHigh: number;
   averagePaceLo: number;  //  (0.01 sec lsb), CSAFE_PM_GET_TOTAL_AVG_500MPACE
   averagePaceHigh: number;
   restDistanceLow: number;  //  CSAFE_PM_GET_RESTDISTANCE
   restDistanceHigh: number;
   restTimeLo: number;  //  (0.01 sec lsb) CSAFE_PM_GET_RESTTIME
   restTimeMid: number;
   restTimeHigh: number;
 }

 //  TODO:  Double check all these metrics and units!
 //  TODO:  We're storing values in .01 and .001 multiples of the unit.  THEN taking avg, var, std.dev, etc... is it OK to convert AFTER in all cases?
 export const additional1StatusFields: StatMap = {
   speed: {
     humanName: "Speed",
     unit: "METERS / SEC.",
     conversion: (value: number) => roundDecimal(value / 1000)
   },
   strokeRate: {
     humanName: "Stroke Rate",
     unit: "STROKES / MIN.",
     conversion: (strokesPerMin: number) => roundDecimal(strokesPerMin)
   },
   heartRate: {
     humanName: "Heart Rate",
     unit: "BBS",
     conversion: roundDecimal
   },
   currentPace: {
     humanName: "Current Pace",
     unit: "METERS / SEC.",
     conversion: (paceDateString: string) => {
       const paceDate = new Date(paceDateString);
       const paceTenths = paceDate.getTime() / 100; //  Pace expressed in 1/10 second.  Normally its 1/1000 second.
       const roundedPaceTenths = Math.round(paceTenths);
       const paceThousandths = new Date(roundedPaceTenths * 100);
       const pace = `${paceThousandths.getUTCMinutes()}:${render2Digits(paceThousandths.getUTCSeconds())}.${paceThousandths.getUTCMilliseconds() / 100}`;
       return pace;
     }
   },
   averagePace: {
     humanName: "Average Pace",
     unit: "METERS / SEC.",
     conversion: roundDecimal
   },
   restDistance: {
     humanName: "Real Distance",
     unit: "METERS",
     conversion: roundDecimal
   },
   restTime: {
     humanName: "Rest Time",
     unit: "HH:MM:SS",
     conversion: roundDecimal  //  TODO:  Is it right to round a time?
   }
 };

 export enum StatType {
   General = 'general',
   Additional1 = 'additional1',
   Additional2 = 'additional2',
   StrokeData = 'strokeData'
 }

 export interface AdditionalStatus1 extends PM5Stat {
   speed: number;  //  (0.001m/s lsb) CSAFE_GETSPEED_CMD6
   strokeRate: number; //  (strokes/min), CSAFE_PM_GET_STROKERA TE
   heartRate: number;  //  (bpm, 255=invalid), CSAFE_PM_GET_AVG_HEARTRATE
   currentPace: Date;  //  (0.01 sec lsb), CSAFE_PM_GET_STROKE_500MPACE
   averagePace: Date;  //  (0.01 sec lsb), CSAFE_PM_GET_TOTAL_AVG_500MPACE
   restDistance: number;  //  CSAFE_PM_GET_RESTDISTANCE
   restTime: number;  //  (0.01 sec lsb) CSAFE_PM_GET_RESTTIME
 }

 export interface RowingStrokeDataBytes {
   elapsedTimeLo: number; //  (0.01 sec lsb)
   elapsedTimeMid: number;
   elapsedTimeHigh: number;
   distanceLo: number; //  (0.1 m lsb)
   distanceMid: number;
   distanceHigh: number;
   driveLength: number; //  (0.01 meters, max = 2.55m), CSAFE_PM_GET_STROKESTATS
   driveTime: number; //  (0.01 sec, max = 2.55 sec),
   strokeRecoveryTimeLo: number; //  (0.01 sec, max = 655.35 sec), CSAFE_PM_GET_STROKESTATS
   strokeRecoveryTimeHi: number; //  CSAFE_PM_GET_STROKESTATS8
   strokeDistanceLo: number; //  (0.01 m, max=655.35m), CSAFE_PM_GET_STROKESTATS
   strokeDistanceHi: number;
   peakDriveForceLo: number; //  (0.1 lbs of force, max=6553.5m), CSAFE_PM_GET_STROKESTATS
   peakDriveForceHi: number;
   averageDriveForceLo: number; //  (0.1 lbs of force, max=6553.5m), CSAFE_PM_GET_STROKESTATS
   averageDriveForceHi: number;
   workPerStrokeLo: number; //  (0.1 Joules, max=6553.5 Joules), CSAFE_PM_GET_STROKESTATS
   workPerStrokeHi: number;
   strokeCountLo: number; //  CSAFE_PM_GET_STROKESTATS
   strokeCountHi: number;
 }

 export interface RowingStrokeData extends PM5Stat {
   distance: number; //  (0.1 m lsb)
   driveLength: number; //  (0.01 meters, max = 2.55m), CSAFE_PM_GET_STROKESTATS
   driveTime: number; //  (0.01 sec, max = 2.55 sec),
   strokeRecoveryTime: number; //  (0.01 sec, max = 655.35 sec), CSAFE_PM_GET_STROKESTATS
   strokeDistance: number; //  (0.01 m, max=655.35m), CSAFE_PM_GET_STROKESTATS
   peakDriveForce: number; //  (0.1 lbs of force, max=6553.5m), CSAFE_PM_GET_STROKESTATS
   averageDriveForce: number; //  (0.1 lbs of force, max=6553.5m), CSAFE_PM_GET_STROKESTATS
   workPerStroke: number; //  (0.1 Joules, max=6553.5 Joules), CSAFE_PM_GET_STROKESTATS
   strokeCount: number; //  CSAFE_PM_GET_STROKESTATS
 }

 export const additional2StatusFields: StatMap = {
   // "elapsedTime",
   intervalCount: {
     humanName: "Interval Count",
     conversion: roundDecimal
   },
   averagePower: {
     humanName: "Average Power",
     unit: "WATTS",  //  TODO:  Ask Jon to check the units, and double check the BLE docs.
     conversion: roundDecimal
   },
   totalCalories: {
     humanName: "Total Calories",
     unit: "CALORIES",
     conversion: roundDecimal
   },
   // splitIntAvgPace,
   // splitIntAvgPower,
   splitIntAvgCalories: {
     humanName: "Split Interval Average Calories",
     unit: "CALORIES",
     conversion: roundDecimal
   },
   lastSplitTime: {
     humanName: "Last Split Time",
     unit: "HH:MM:SS",  //  TODO:  Def check this...
     conversion: roundDecimal  //  TODO:  Is it right to round a time?
   },
   lastSplitDistance: {
     humanName: "Last Split Distance",
     unit: "METERS",
     conversion: roundDecimal
   }
 };

 export interface AdditionalStatus2 extends PM5Stat {
   intervalCount: number;  //  CSAFE_PM_GET_WORKOUTINTERVALCOUNT7
   averagePower: number;  //  CSAFE_PM_GET_TOTAL_AVG_POWER
   totalCalories: number;  //  (cals), CSAFE_PM_GET_TOTAL_AVG_CALORIES
   splitIntAvgPace: number;  //  (0.01 sec lsb), CSAFE_PM_GET_SPLIT_AVG_500MPACE
   splitIntAvgPower: number;  //  (watts), CSAFE_PM_GET_SPLIT_A VG_POWER
   splitIntAvgCalories: number;  //  (cals/hr), CSAFE_PM_GET_SPLIT_A VG_CALORIES
   lastSplitTime: number;  //  (0.1 sec lsb), CSAFE_PM_GET_LAST_SPLITTIME
   lastSplitDistance: number;  //  , CSAFE_PM_GET_LAST_SPLITDISTANCE (in meters)
 }

 export interface AdditionalStatus2Bytes {
   elapsedTimeLo: number;  //  (0.01 sec lsb),
   elapsedTimeMid: number;
   elapsedTimeHigh: number;
   intervalCount: number;  //  CSAFE_PM_GET_WORKOUTINTERVALCOUNT7
   averagePowerLo: number;  //  CSAFE_PM_GET_TOTAL_AVG_POWER
   averagePowerHi: number;
   totalCaloriesLo: number;  //  (cals), CSAFE_PM_GET_TOTAL_AVG_CALORIES
   totalCaloriesHi: number;
   splitIntAvgPaceLo: number;  //  (0.01 sec lsb), CSAFE_PM_GET_SPLIT_AVG_500MPACE
   splitIntAvgPaceHi: number;
   splitIntAvgPowerLo: number;  //  (watts), CSAFE_PM_GET_SPLIT_A VG_POWER
   splitIntAvgPowerHi: number;
   splitIntAvgCaloriesLo: number;  //  (cals/hr), CSAFE_PM_GET_SPLIT_A VG_CALORIES
   splitIntAvgCaloriesHi: number;
   lastSplitTimeLo: number;  //  (0.1 sec lsb), CSAFE_PM_GET_LAST_SPLITTIME
   lastSplitTimeMid: number;
   lastSplitTimeHi: number;
   lastSplitDistanceLo: number;  //  , CSAFE_PM_GET_LAST_SPLITDISTANCE (in meters)
   lastSplitDistanceMid: number;
   lastSplitDistanceHi: number;
 }

 interface GeneralStatusBytes {
   elapsedTimeLo: number;
   elapsedTimeMid: number;
   elapsedTimeHigh: number;
   distanceLo: number;
   distanceMid: number;
   distanceHigh: number;
   workoutType: WorkoutType;
   intervalType: IntervalType;
   workoutState: WorkoutState;
   rowingState: RowingState;
   strokeState: StrokeState;
   totalWorkDistanceLo: number;
   totalWorkDistanceMid: number;
   totalWorkDistanceHi: number;
   workoutDurationLo: number;
   workoutDurationMed: number;
   workoutDurationHi: number;
   workoutDurationType: WorkoutDurationType;
   dragFactor: number;
 }

 const combine3Bytes = (lo: number, mid: number, hi: number) => (
   lo + mid * (Math.pow(2, 8)) + hi * (Math.pow(2, 16))
 );

 const combine2Bytes = (lo: number, hi: number) => (
   lo + hi * (Math.pow(2, 8))
 );

 export class PM5RowingService {
   private subscriptions: Subscription[] = [];

   constructor(private device: Device) {}

   public subscribeAdditionalStatus1 = (callback: (status: AdditionalStatus1) => void) => {
     const service = PM5Service.Rowing;
     const characteristic = RowingCharacteristic.AdditionalStatus1;
     const serviceUUID = PM5ServiceUUIDs[service];
     const characteristicUUID = RowingCharacteristicUUIds[characteristic];
     const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err: any, char: Characteristic) => {
       if (char) {
         //  Create the GeneralStatus

         //  A string of 16-bit Base64 (10 zero bits, 6 data bits) characters
         const base64Value = char.value;

         //  A string of 16-bit bytes (8 bits)
         const parsedValue = atob(base64Value);

         //  Generate a list of numbers where each number corresponds to the decimal value of the 8bit value.
         const byteArray = [];
         for (let i = 0; i < parsedValue.length; i ++) {
           const charCode = parsedValue.charCodeAt(i);
           byteArray.push(charCode);
         }

         //  Map the byte array to the GeneralStatusByte object
         const additionalStatus1Bytes: AdditionalStatus1Bytes = {
           elapsedTimeLo: byteArray[0],
           elapsedTimeMid: byteArray[1],
           elapsedTimeHigh: byteArray[2],
           speedLow: byteArray[3],
           speedHigh: byteArray[4],
           strokeRate: byteArray[5],
           heartRate: byteArray[6],
           currentPaceLo: byteArray[7],
           currentPaceHigh: byteArray[8],
           averagePaceLo: byteArray[9],
           averagePaceHigh: byteArray[10],
           restDistanceLow: byteArray[11],
           restDistanceHigh: byteArray[12],
           restTimeLo: byteArray[13],
           restTimeMid: byteArray[14],
           restTimeHigh: byteArray[15]
         };

         //  Get Elapsed Time
         const { elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh } = additionalStatus1Bytes;
         const elapsedTimeHundreths = combine3Bytes(elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh);
         const elapsedTimeThousandths = 10 * elapsedTimeHundreths;
         const elapsedTime = new Date(elapsedTimeThousandths);


         //  Get Speed
         const { speedLow, speedHigh } = additionalStatus1Bytes;
         const speed = combine2Bytes(speedLow, speedHigh);

         //  Get Current Pace
         const { currentPaceLo, currentPaceHigh } = additionalStatus1Bytes;
         const currentPaceHundreths = combine2Bytes(currentPaceLo, currentPaceHigh);
         const currentPaceThousandths = 10 * currentPaceHundreths;
         const currentPace = new Date(currentPaceThousandths);

         //  Get Average Pace
         const { averagePaceLo, averagePaceHigh } = additionalStatus1Bytes;
         const averagePaceHundreths = combine2Bytes(averagePaceLo, averagePaceHigh);
         const averagePaceThousandths = 10 * averagePaceHundreths;
         const averagePace = new Date(averagePaceThousandths);

         //  Get Rest Distance
         const { restDistanceLow, restDistanceHigh } = additionalStatus1Bytes;
         const restDistance = combine2Bytes(restDistanceLow, restDistanceHigh);

         //  Get Rest Time
         const { restTimeLo, restTimeMid, restTimeHigh } = additionalStatus1Bytes;
         const restTime = combine3Bytes(restTimeLo, restTimeMid, restTimeHigh);

         const additionalStatus1: AdditionalStatus1 = {
           elapsedTime,
           speed,
           strokeRate: additionalStatus1Bytes.strokeRate,
           heartRate: additionalStatus1Bytes.heartRate,
           currentPace,
           averagePace,
           restDistance,
           restTime
         };

         callback(additionalStatus1);
       }
     });
     this.subscriptions.push(subscription);
   }

   public subscribeAdditionalStatus2 = (callback: (status: AdditionalStatus2) => void) => {
     const service = PM5Service.Rowing;
     const characteristic = RowingCharacteristic.AdditionalStatus2;
     const serviceUUID = PM5ServiceUUIDs[service];
     const characteristicUUID = RowingCharacteristicUUIds[characteristic];
     const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err: any, char: Characteristic) => {
       if (char) {
         //  Create the GeneralStatus

         //  A string of 16-bit Base64 (10 zero bits, 6 data bits) characters
         const base64Value = char.value;

         //  A string of 16-bit bytes (8 bits)
         const parsedValue = atob(base64Value);

         //  Generate a list of numbers where each number corresponds to the decimal value of the 8bit value.
         const byteArray = [];
         for (let i = 0; i < parsedValue.length; i ++) {
           const charCode = parsedValue.charCodeAt(i);
           byteArray.push(charCode);
         }

         //  Map the byte array to the GeneralStatusByte object
         const additionalStatus2Bytes: AdditionalStatus2Bytes = {
           elapsedTimeLo: byteArray[0],
           elapsedTimeMid: byteArray[1],
           elapsedTimeHigh: byteArray[2],
           intervalCount: byteArray[3],
           averagePowerLo: byteArray[4],
           averagePowerHi: byteArray[5],
           totalCaloriesLo: byteArray[6],
           totalCaloriesHi: byteArray[7],
           splitIntAvgPaceLo: byteArray[8],
           splitIntAvgPaceHi: byteArray[9],
           splitIntAvgPowerLo: byteArray[10],
           splitIntAvgPowerHi: byteArray[11],
           splitIntAvgCaloriesLo: byteArray[12],
           splitIntAvgCaloriesHi: byteArray[13],
           lastSplitTimeLo: byteArray[14],
           lastSplitTimeMid: byteArray[15],
           lastSplitTimeHi: byteArray[16],
           lastSplitDistanceLo: byteArray[17],
           lastSplitDistanceMid: byteArray[18],
           lastSplitDistanceHi: byteArray[19],
         };

         //  Get Elapsed Time
         const { elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh } = additionalStatus2Bytes;
         const elapsedTimeHundreths = combine3Bytes(elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh);
         const elapsedTimeThousandths = 10 * elapsedTimeHundreths;
         const elapsedTime = new Date(elapsedTimeThousandths);

         //  Ger Average Power
         const { averagePowerLo, averagePowerHi } = additionalStatus2Bytes;
         const averagePower = combine2Bytes(averagePowerLo, averagePowerHi);

         //  Get Total Calories
         const { totalCaloriesLo, totalCaloriesHi } = additionalStatus2Bytes;
         const totalCalories = combine2Bytes(totalCaloriesLo, totalCaloriesHi);

         //  Get Split Int Avg Pace
         const { splitIntAvgPaceLo, splitIntAvgPaceHi } = additionalStatus2Bytes;
         const splitIntAvgPace = combine2Bytes(splitIntAvgPaceLo, splitIntAvgPaceHi);

         //  Get Split Int Avg Power
         const { splitIntAvgPowerLo, splitIntAvgPowerHi } = additionalStatus2Bytes;
         const splitIntAvgPower = combine2Bytes(splitIntAvgPowerLo, splitIntAvgPowerHi);

         //  Get Split Int Avg Calories
         const { splitIntAvgCaloriesLo, splitIntAvgCaloriesHi } = additionalStatus2Bytes;
         const splitIntAvgCalories = combine2Bytes(splitIntAvgCaloriesLo, splitIntAvgCaloriesHi);

         //  Get Last Split Time
         const { lastSplitTimeLo, lastSplitTimeMid, lastSplitTimeHi } = additionalStatus2Bytes;
         const lastSplitTime = combine3Bytes(lastSplitTimeLo, lastSplitTimeMid, lastSplitTimeHi);

         //  Get Last Split Distance
         const { lastSplitDistanceLo, lastSplitDistanceMid, lastSplitDistanceHi } = additionalStatus2Bytes;
         const lastSplitDistance = combine3Bytes(lastSplitDistanceLo, lastSplitDistanceMid, lastSplitDistanceHi);

         const additionalStatus2: AdditionalStatus2 = {
           elapsedTime,
           intervalCount: additionalStatus2Bytes.intervalCount,
           averagePower,
           totalCalories,
           splitIntAvgPace,
           splitIntAvgPower,
           splitIntAvgCalories,
           lastSplitTime,
           lastSplitDistance
         };

         callback(additionalStatus2);
       }
     });
     this.subscriptions.push(subscription);
   }

   public subscribeRowingStrokeData = (callback: (status: RowingStrokeData) => void) => {
     const service = PM5Service.Rowing;
     const characteristic = RowingCharacteristic;
     const serviceUUID = PM5ServiceUUIDs[service];
     const characteristicUUID = RowingCharacteristicUUIds[characteristic.StrokeData];
     const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err: any, char: Characteristic) => {
       if (char) {
         //  Create the RowingStrokeData

         //  A string of 16-bit Base64 (10 zero bits, 6 data bits) characters
         const base64Value = char.value;

         //  A string of 16-bit bytes (8 bits)
         const parsedValue = atob(base64Value);

         //  Generate a list of numbers where each number corresponds to the decimal value of the 8bit value.
         const byteArray = [];
         for (let i = 0; i < parsedValue.length; i ++) {
           const charCode = parsedValue.charCodeAt(i);
           byteArray.push(charCode);
         }

         //  Map the byte array to the GeneralStatusByte object
         const rowingStrokeDataBytes: RowingStrokeDataBytes = {
           elapsedTimeLo: byteArray[0],
           elapsedTimeMid: byteArray[1],
           elapsedTimeHigh: byteArray[2],
           distanceLo: byteArray[3],
           distanceMid: byteArray[4],
           distanceHigh: byteArray[5],
           driveLength: byteArray[6],
           driveTime: byteArray[7],
           strokeRecoveryTimeLo: byteArray[8],
           strokeRecoveryTimeHi: byteArray[9],
           strokeDistanceLo: byteArray[10],
           strokeDistanceHi: byteArray[11],
           peakDriveForceLo: byteArray[12],
           peakDriveForceHi: byteArray[13],
           averageDriveForceLo: byteArray[14],
           averageDriveForceHi: byteArray[15],
           workPerStrokeLo: byteArray[16],
           workPerStrokeHi: byteArray[17],
           strokeCountLo: byteArray[18],
           strokeCountHi: byteArray[19],
         };

         //  Get Elapsed Time
         const { elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh } = rowingStrokeDataBytes;
         const elapsedTimeHundreths = combine3Bytes(elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh);
         const elapsedTimeThousandths = 10 * elapsedTimeHundreths;
         const elapsedTime = new Date(elapsedTimeThousandths);

         //  Get Distance
         const { distanceLo, distanceMid, distanceHigh } = rowingStrokeDataBytes;
         const distance = combine3Bytes(distanceLo, distanceMid, distanceHigh);

         //  Get Stroke Recovery Time
         const { strokeRecoveryTimeLo, strokeRecoveryTimeHi } = rowingStrokeDataBytes;
         const strokeRecoveryTime = combine2Bytes(strokeRecoveryTimeLo, strokeRecoveryTimeHi);

         //  Get Stroke Distance
         const { strokeDistanceLo, strokeDistanceHi } = rowingStrokeDataBytes;
         const strokeDistance = combine2Bytes(strokeDistanceLo, strokeDistanceHi);

         //  Get Peak Drive Force
         const { peakDriveForceLo, peakDriveForceHi } = rowingStrokeDataBytes;
         const peakDriveForce = combine2Bytes(peakDriveForceLo, peakDriveForceHi);

         //  Get Average Drive Force
         const { averageDriveForceLo, averageDriveForceHi } = rowingStrokeDataBytes;
         const averageDriveForce = combine2Bytes(averageDriveForceLo, averageDriveForceHi);

         //  Get Work Per Stroke
         const { workPerStrokeLo, workPerStrokeHi } = rowingStrokeDataBytes;
         const workPerStroke = combine2Bytes(workPerStrokeLo, workPerStrokeHi);

         //  Get Stroke Count
         const { strokeCountLo, strokeCountHi } = rowingStrokeDataBytes;
         const strokeCount = combine2Bytes(strokeCountLo, strokeCountHi);

         const rowingStrokeData: RowingStrokeData = {
           elapsedTime,
           distance,
           driveLength: rowingStrokeDataBytes.driveLength,
           driveTime: rowingStrokeDataBytes.driveTime,
           strokeRecoveryTime,
           strokeDistance,
           peakDriveForce,
           averageDriveForce,
           workPerStroke,
           strokeCount,
         };

         callback(rowingStrokeData);
       }
     });
     this.subscriptions.push(subscription);
   }

   subscribeGeneralStatus = (callback: (status: GeneralStatus) => void) => {
     const service = PM5Service.Rowing;
     const characteristic = RowingCharacteristic.GeneralStatus;
     const serviceUUID = PM5ServiceUUIDs[service];
     const characteristicUUID = RowingCharacteristicUUIds[characteristic];
     const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err: any, char: Characteristic) => {
       if (char) {
         //  Create the AdditionalStatus1

         //  A string of 16-bit Base64 (10 zero bits, 6 data bits each) characters
         const base64Value = char.value;

         //  A string of 16-bit bytes (8 data bits each)
         const parsedValue = atob(base64Value);

         //  A list of results
         const byteArray = [];
         for (let i = 0; i < parsedValue.length; i ++) {
           const charCode = parsedValue.charCodeAt(i);
           byteArray.push(charCode);
         }

         //  Map the byte array to the GeneralStatusByte object
         const generalStatusBytes: GeneralStatusBytes = {
           elapsedTimeLo: byteArray[0],
           elapsedTimeMid: byteArray[1],
           elapsedTimeHigh: byteArray[2],
           distanceLo: byteArray[3],
           distanceMid: byteArray[4],
           distanceHigh: byteArray[5],
           workoutType: byteArray[6],
           intervalType: byteArray[7],
           workoutState: byteArray[8],
           rowingState: byteArray[9],
           strokeState: byteArray[10],
           totalWorkDistanceLo: byteArray[11],
           totalWorkDistanceMid: byteArray[12],
           totalWorkDistanceHi: byteArray[13],
           workoutDurationLo: byteArray[14],
           workoutDurationMed: byteArray[15],
           workoutDurationHi: byteArray[16],
           workoutDurationType: byteArray[17],
           dragFactor: byteArray[18]
         };

         //  Get Elapsed Time
         const { elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh } = generalStatusBytes;
         const elapsedTimeHundreths = combine3Bytes(elapsedTimeLo, elapsedTimeMid, elapsedTimeHigh);
         const elapsedTime = new Date(elapsedTimeHundreths * 10);

         //  Get Distance
         const { distanceLo, distanceMid, distanceHigh } = generalStatusBytes;
         const distance = combine3Bytes(distanceLo, distanceMid, distanceHigh);

         //  Get Total Work Distance
         const { totalWorkDistanceLo, totalWorkDistanceMid, totalWorkDistanceHi } = generalStatusBytes;
         const totalWorkDistance = combine3Bytes(totalWorkDistanceLo, totalWorkDistanceMid, totalWorkDistanceHi);

         //  Get Workout Duration
         const { workoutDurationLo, workoutDurationMed, workoutDurationHi } = generalStatusBytes;
         const workoutDuration = combine3Bytes(workoutDurationLo, workoutDurationMed, workoutDurationHi);

         const generalStatus: GeneralStatus = {
           elapsedTime,
           distance,
           workoutType: generalStatusBytes.workoutType,
           intervalType: generalStatusBytes.intervalType,
           workoutState: generalStatusBytes.workoutState,
           rowingState: generalStatusBytes.rowingState,
           strokeState: generalStatusBytes.strokeState,
           totalWorkDistance,
           workoutDuration,
           workoutDurationType: generalStatusBytes.workoutDurationType,
           dragFactor: generalStatusBytes.dragFactor
         };

         callback(generalStatus);
       }
     });
     this.subscriptions.push(subscription);
   }

   public unsubscribeAll = async () => {
     this.subscriptions.forEach((subscription: Subscription) => {
       subscription.remove();
     });
     await this.device.cancelConnection();
   }
 }

 class PM5Device {
   constructor(private device: Device) {}
   public setRate() {
     //  SNIPPET:  Use this to set the PM5 rate
     //  Encoded in Base64 represented as an array of 16 bit characters.
     //  Decode to a string of 16 bit characters with the original bytes.
     //  View the charCoteAt to see the decimal value of each byte.
     // const sampleRateChar = await device.readCharacteristicForService(rowingServiceUUID, statusSampleRateCharUUID);
     // console.warn(atob(sampleRateChar.value));
     // const res = await device.writeCharacteristicWithResponseForService(rowingServiceUUID, statusSampleRateCharUUID, btoa('3'));
     // console.warn(res);
     // const sampleRateCharUpdated = await device.readCharacteristicForService(rowingServiceUUID, statusSampleRateCharUUID);
     // console.warn(atob(sampleRateCharUpdated.value));
   }

 }
