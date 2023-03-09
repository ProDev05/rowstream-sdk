"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 *
 * This software is proprietary and owned by Jonathan Andersen.
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
const util_1 = require("./util");
var Rate;
(function (Rate) {
    //
})(Rate || (Rate = {}));
//  Services and Characteristics
const createPM5Id = (id) => (`CE06${id}-43E5-11E4-916C-0800200C9A66`);
//
//  Services
//
var PM5Service;
(function (PM5Service) {
    PM5Service[PM5Service["GAP"] = 0] = "GAP";
    PM5Service[PM5Service["GATT"] = 1] = "GATT";
    PM5Service[PM5Service["Controller"] = 2] = "Controller";
    PM5Service[PM5Service["Rowing"] = 3] = "Rowing";
    PM5Service[PM5Service["Info"] = 4] = "Info";
})(PM5Service || (PM5Service = {}));
const PM5ServiceUUIDs = {
    [PM5Service.GAP]: createPM5Id('1800'),
    [PM5Service.GATT]: createPM5Id('1801'),
    [PM5Service.Controller]: createPM5Id('0020'),
    [PM5Service.Rowing]: createPM5Id('0030'),
    [PM5Service.Info]: createPM5Id('0010')
};
var PM5Characteristic;
(function (PM5Characteristic) {
    PM5Characteristic[PM5Characteristic["GAP"] = 0] = "GAP";
    PM5Characteristic[PM5Characteristic["GATT"] = 1] = "GATT";
    PM5Characteristic[PM5Characteristic["Controller"] = 2] = "Controller";
    PM5Characteristic[PM5Characteristic["Rowing"] = 3] = "Rowing";
    PM5Characteristic[PM5Characteristic["Info"] = 4] = "Info";
})(PM5Characteristic || (PM5Characteristic = {}));
//
//  GAP Service
//
var GAPCharacteristic;
(function (GAPCharacteristic) {
    GAPCharacteristic[GAPCharacteristic["DeviceName"] = 0] = "DeviceName";
    GAPCharacteristic[GAPCharacteristic["Appearance"] = 1] = "Appearance";
    GAPCharacteristic[GAPCharacteristic["PeripheralPrivacy"] = 2] = "PeripheralPrivacy";
    GAPCharacteristic[GAPCharacteristic["ReconnectAddress"] = 3] = "ReconnectAddress";
    GAPCharacteristic[GAPCharacteristic["PeripheralPreferredConnectionParameters"] = 4] = "PeripheralPreferredConnectionParameters";
})(GAPCharacteristic || (GAPCharacteristic = {}));
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
var GATTCharacteristic;
(function (GATTCharacteristic) {
    GATTCharacteristic[GATTCharacteristic["ServiceChanged"] = 0] = "ServiceChanged";
    GATTCharacteristic[GATTCharacteristic["ClientConfiguration"] = 1] = "ClientConfiguration";
})(GATTCharacteristic || (GATTCharacteristic = {}));
const GATTCharacteristicUUIDs = {
    [GATTCharacteristic.ServiceChanged]: createPM5Id('2A05'),
    [GATTCharacteristic.ClientConfiguration]: createPM5Id('2902')
};
//
//  Information Service
//
var InformationCharacteristic;
(function (InformationCharacteristic) {
    InformationCharacteristic[InformationCharacteristic["ModuleNumberString"] = 0] = "ModuleNumberString";
    InformationCharacteristic[InformationCharacteristic["SerialNumberString"] = 1] = "SerialNumberString";
    InformationCharacteristic[InformationCharacteristic["HardwareRevisionString"] = 2] = "HardwareRevisionString";
    InformationCharacteristic[InformationCharacteristic["FirmwareRevisionString"] = 3] = "FirmwareRevisionString";
    InformationCharacteristic[InformationCharacteristic["ManufacturerNameString"] = 4] = "ManufacturerNameString";
    InformationCharacteristic[InformationCharacteristic["ErgMachineType"] = 5] = "ErgMachineType";
})(InformationCharacteristic || (InformationCharacteristic = {}));
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
var ControlCharacteristic;
(function (ControlCharacteristic) {
    ControlCharacteristic[ControlCharacteristic["Receive"] = 0] = "Receive";
    ControlCharacteristic[ControlCharacteristic["Transmit"] = 1] = "Transmit";
})(ControlCharacteristic || (ControlCharacteristic = {}));
const ControlCharacteristicUUIds = {
    [ControlCharacteristic.Receive]: createPM5Id('0021'),
    [ControlCharacteristic.Transmit]: createPM5Id('0022')
};
//
//  Rowing Service
//  TODO:  Include Multiplex info.
//
var RowingCharacteristic;
(function (RowingCharacteristic) {
    RowingCharacteristic[RowingCharacteristic["GeneralStatus"] = 0] = "GeneralStatus";
    RowingCharacteristic[RowingCharacteristic["AdditionalStatus1"] = 1] = "AdditionalStatus1";
    RowingCharacteristic[RowingCharacteristic["AdditionalStatus2"] = 2] = "AdditionalStatus2";
    RowingCharacteristic[RowingCharacteristic["GeneralAndAdditionalStatusSampleRate"] = 3] = "GeneralAndAdditionalStatusSampleRate";
    RowingCharacteristic[RowingCharacteristic["StrokeData"] = 4] = "StrokeData";
    RowingCharacteristic[RowingCharacteristic["AdditionalStrokeData"] = 5] = "AdditionalStrokeData";
    RowingCharacteristic[RowingCharacteristic["SplitIntervalData"] = 6] = "SplitIntervalData";
    RowingCharacteristic[RowingCharacteristic["AdditionalSplitIntervalData"] = 7] = "AdditionalSplitIntervalData";
    RowingCharacteristic[RowingCharacteristic["EndOfWorkoutSummaryData"] = 8] = "EndOfWorkoutSummaryData";
    RowingCharacteristic[RowingCharacteristic["EndOfWorkoutSummaryAdditionalData"] = 9] = "EndOfWorkoutSummaryAdditionalData";
    RowingCharacteristic[RowingCharacteristic["HeartBeatBeltInformation"] = 10] = "HeartBeatBeltInformation";
    RowingCharacteristic[RowingCharacteristic["ForceCurveData"] = 11] = "ForceCurveData";
    RowingCharacteristic[RowingCharacteristic["MultiplexedInformation"] = 12] = "MultiplexedInformation";
})(RowingCharacteristic || (RowingCharacteristic = {}));
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
exports.reverseEnum = (enumeration) => {
    const reversedEnum = {};
    Object.keys(enumeration).forEach((key) => {
        const value = enumeration[key];
        reversedEnum[key] = value;
    });
    return reversedEnum;
};
var WorkoutType;
(function (WorkoutType) {
    WorkoutType[WorkoutType["Just Row - No Splits"] = 0] = "Just Row - No Splits";
    WorkoutType[WorkoutType["Just Row - Splits"] = 1] = "Just Row - Splits";
    WorkoutType[WorkoutType["Fixed Distance - No Splits"] = 2] = "Fixed Distance - No Splits";
    WorkoutType[WorkoutType["Fixed Distance - Splits"] = 3] = "Fixed Distance - Splits";
    WorkoutType[WorkoutType["Fixed Time - No Splits"] = 4] = "Fixed Time - No Splits";
    WorkoutType[WorkoutType["Fixed Time - Splits"] = 5] = "Fixed Time - Splits";
    WorkoutType[WorkoutType["Fixed Time - Interval"] = 6] = "Fixed Time - Interval";
    WorkoutType[WorkoutType["Fixed Distance - Interval"] = 7] = "Fixed Distance - Interval";
    WorkoutType[WorkoutType["Variable (Interval)"] = 8] = "Variable (Interval)";
    WorkoutType[WorkoutType["Variable (Undefined) Rest (Interval)"] = 9] = "Variable (Undefined) Rest (Interval)";
    WorkoutType[WorkoutType["Fixed Calorie"] = 10] = "Fixed Calorie";
    WorkoutType[WorkoutType["Fixed Watt Minutes"] = 11] = "Fixed Watt Minutes";
    WorkoutType[WorkoutType["Fixed Calories - Interval"] = 12] = "Fixed Calories - Interval";
    WorkoutType[WorkoutType["Num"] = 13] = "Num";
})(WorkoutType = exports.WorkoutType || (exports.WorkoutType = {}));
var IntervalType;
(function (IntervalType) {
    IntervalType[IntervalType["Time"] = 0] = "Time";
    IntervalType[IntervalType["Dist"] = 1] = "Dist";
    IntervalType[IntervalType["Rest"] = 2] = "Rest";
    IntervalType[IntervalType["Time Rest Undefined"] = 3] = "Time Rest Undefined";
    IntervalType[IntervalType["Distance Rest Undefined"] = 4] = "Distance Rest Undefined";
    IntervalType[IntervalType["Rest Undefined"] = 5] = "Rest Undefined";
    IntervalType[IntervalType["Calorie"] = 6] = "Calorie";
    IntervalType[IntervalType["Calorie Rest Undefined"] = 7] = "Calorie Rest Undefined";
    IntervalType[IntervalType["Wait Minute"] = 8] = "Wait Minute";
    IntervalType[IntervalType["Wait Minute Rest Undefined"] = 9] = "Wait Minute Rest Undefined";
    IntervalType[IntervalType["None"] = 255] = "None";
})(IntervalType = exports.IntervalType || (exports.IntervalType = {}));
var WorkoutState;
(function (WorkoutState) {
    WorkoutState[WorkoutState["Wait to Begin"] = 0] = "Wait to Begin";
    WorkoutState[WorkoutState["Workout Row"] = 1] = "Workout Row";
    WorkoutState[WorkoutState["Countdown Pause"] = 2] = "Countdown Pause";
    WorkoutState[WorkoutState["Interval Rest"] = 3] = "Interval Rest";
    WorkoutState[WorkoutState["Interval Work Time"] = 4] = "Interval Work Time";
    WorkoutState[WorkoutState["Interval Work Distance"] = 5] = "Interval Work Distance";
    WorkoutState[WorkoutState["Interval Rest End To Work Time"] = 6] = "Interval Rest End To Work Time";
    WorkoutState[WorkoutState["Interval Rest End To Work Time Distance"] = 7] = "Interval Rest End To Work Time Distance";
    WorkoutState[WorkoutState["Interval Work Time To Rest"] = 8] = "Interval Work Time To Rest";
    WorkoutState[WorkoutState["Interval Work Distance To Rest"] = 9] = "Interval Work Distance To Rest";
    WorkoutState[WorkoutState["Workout End"] = 10] = "Workout End";
    WorkoutState[WorkoutState["Terminate"] = 11] = "Terminate";
    WorkoutState[WorkoutState["Workout Logged"] = 12] = "Workout Logged";
    WorkoutState[WorkoutState["Re-Arm"] = 13] = "Re-Arm";
})(WorkoutState = exports.WorkoutState || (exports.WorkoutState = {}));
var RowingState;
(function (RowingState) {
    RowingState[RowingState["Inactive"] = 0] = "Inactive";
    RowingState[RowingState["Active"] = 1] = "Active";
})(RowingState = exports.RowingState || (exports.RowingState = {}));
var StrokeState;
(function (StrokeState) {
    StrokeState[StrokeState["Waiting for Wheel to Reach Min Speed"] = 0] = "Waiting for Wheel to Reach Min Speed";
    StrokeState[StrokeState["Waiting for Wheel to Accelerate"] = 1] = "Waiting for Wheel to Accelerate";
    StrokeState[StrokeState["Driving"] = 2] = "Driving";
    StrokeState[StrokeState["Dwelling After Drive"] = 3] = "Dwelling After Drive";
    StrokeState[StrokeState["Recovery"] = 4] = "Recovery";
})(StrokeState = exports.StrokeState || (exports.StrokeState = {}));
var WorkoutDurationType;
(function (WorkoutDurationType) {
    WorkoutDurationType[WorkoutDurationType["Time Duration"] = 0] = "Time Duration";
    WorkoutDurationType[WorkoutDurationType["Calories Duration"] = 64] = "Calories Duration";
    WorkoutDurationType[WorkoutDurationType["Distance Duration"] = 128] = "Distance Duration";
    WorkoutDurationType[WorkoutDurationType["Watts Duration"] = 192] = "Watts Duration";
})(WorkoutDurationType = exports.WorkoutDurationType || (exports.WorkoutDurationType = {}));
var DragFactor;
(function (DragFactor) {
})(DragFactor || (DragFactor = {}));
exports.roundDecimal = (num) => {
    //  REFERENCE:  https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places#comment49416157_15762794
    const rounded = Math.round((num * 100));
    return rounded / 100;
    // const remainder = rounded % 100;
    // const base = rounded - remainder;
};
exports.generalStatusFields = {
    elapsedTime: {
        humanName: "Elapsed Time",
        unit: "HH:MM:SS",
        conversion: (value) => exports.roundDecimal(value / 1000) //  TODO:  Is it right to round a time?
    },
    distance: {
        humanName: "Distance",
        unit: "METERS",
        conversion: (meters) => exports.roundDecimal(meters / 10)
    },
    // workoutType,
    // intervalType,
    // workoutState,
    // rowingState,
    // strokeState,
    totalWorkDistance: {
        humanName: "Total Work Distance",
        unit: "METERS",
        conversion: exports.roundDecimal
    },
    workoutDuration: {
        humanName: "Workout Duration",
        unit: "HH:MM:SS",
        conversion: exports.roundDecimal //  TODO:  Is it right to round a time?
    },
    // workoutDurationType,
    dragFactor: {
        humanName: "Drag Factor",
        conversion: exports.roundDecimal
    }
};
//  TODO:  Double check all these metrics and units!
//  TODO:  We're storing values in .01 and .001 multiples of the unit.  THEN taking avg, var, std.dev, etc... is it OK to convert AFTER in all cases?
exports.additional1StatusFields = {
    speed: {
        humanName: "Speed",
        unit: "METERS / SEC.",
        conversion: (value) => exports.roundDecimal(value / 1000)
    },
    strokeRate: {
        humanName: "Stroke Rate",
        unit: "STROKES / MIN.",
        conversion: (strokesPerMin) => exports.roundDecimal(strokesPerMin)
    },
    heartRate: {
        humanName: "Heart Rate",
        unit: "BBS",
        conversion: exports.roundDecimal
    },
    currentPace: {
        humanName: "Current Pace",
        unit: "METERS / SEC.",
        conversion: (paceDateString) => {
            const paceDate = new Date(paceDateString);
            const paceTenths = paceDate.getTime() / 100; //  Pace expressed in 1/10 second.  Normally its 1/1000 second.
            const roundedPaceTenths = Math.round(paceTenths);
            const paceThousandths = new Date(roundedPaceTenths * 100);
            const pace = `${paceThousandths.getUTCMinutes()}:${util_1.render2Digits(paceThousandths.getUTCSeconds())}.${paceThousandths.getUTCMilliseconds() / 100}`;
            return pace;
        }
    },
    averagePace: {
        humanName: "Average Pace",
        unit: "METERS / SEC.",
        conversion: exports.roundDecimal
    },
    restDistance: {
        humanName: "Real Distance",
        unit: "METERS",
        conversion: exports.roundDecimal
    },
    restTime: {
        humanName: "Rest Time",
        unit: "HH:MM:SS",
        conversion: exports.roundDecimal //  TODO:  Is it right to round a time?
    }
};
var StatType;
(function (StatType) {
    StatType["General"] = "general";
    StatType["Additional1"] = "additional1";
    StatType["Additional2"] = "additional2";
    StatType["StrokeData"] = "strokeData";
})(StatType = exports.StatType || (exports.StatType = {}));
exports.additional2StatusFields = {
    // "elapsedTime",
    intervalCount: {
        humanName: "Interval Count",
        conversion: exports.roundDecimal
    },
    averagePower: {
        humanName: "Average Power",
        unit: "WATTS",
        conversion: exports.roundDecimal
    },
    totalCalories: {
        humanName: "Total Calories",
        unit: "CALORIES",
        conversion: exports.roundDecimal
    },
    // splitIntAvgPace,
    // splitIntAvgPower,
    splitIntAvgCalories: {
        humanName: "Split Interval Average Calories",
        unit: "CALORIES",
        conversion: exports.roundDecimal
    },
    lastSplitTime: {
        humanName: "Last Split Time",
        unit: "HH:MM:SS",
        conversion: exports.roundDecimal //  TODO:  Is it right to round a time?
    },
    lastSplitDistance: {
        humanName: "Last Split Distance",
        unit: "METERS",
        conversion: exports.roundDecimal
    }
};
const combine3Bytes = (lo, mid, hi) => (lo + mid * (Math.pow(2, 8)) + hi * (Math.pow(2, 16)));
const combine2Bytes = (lo, hi) => (lo + hi * (Math.pow(2, 8)));
class PM5RowingService {
    constructor(device) {
        this.device = device;
        this.subscriptions = [];
        this.subscribeAdditionalStatus1 = (callback) => {
            const service = PM5Service.Rowing;
            const characteristic = RowingCharacteristic.AdditionalStatus1;
            const serviceUUID = PM5ServiceUUIDs[service];
            const characteristicUUID = RowingCharacteristicUUIds[characteristic];
            const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err, char) => {
                if (char) {
                    //  Create the GeneralStatus
                    //  A string of 16-bit Base64 (10 zero bits, 6 data bits) characters
                    const base64Value = char.value;
                    //  A string of 16-bit bytes (8 bits)
                    const parsedValue = atob(base64Value);
                    //  Generate a list of numbers where each number corresponds to the decimal value of the 8bit value.
                    const byteArray = [];
                    for (let i = 0; i < parsedValue.length; i++) {
                        const charCode = parsedValue.charCodeAt(i);
                        byteArray.push(charCode);
                    }
                    //  Map the byte array to the GeneralStatusByte object
                    const additionalStatus1Bytes = {
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
                    const additionalStatus1 = {
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
        };
        this.subscribeAdditionalStatus2 = (callback) => {
            const service = PM5Service.Rowing;
            const characteristic = RowingCharacteristic.AdditionalStatus2;
            const serviceUUID = PM5ServiceUUIDs[service];
            const characteristicUUID = RowingCharacteristicUUIds[characteristic];
            const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err, char) => {
                if (char) {
                    //  Create the GeneralStatus
                    //  A string of 16-bit Base64 (10 zero bits, 6 data bits) characters
                    const base64Value = char.value;
                    //  A string of 16-bit bytes (8 bits)
                    const parsedValue = atob(base64Value);
                    //  Generate a list of numbers where each number corresponds to the decimal value of the 8bit value.
                    const byteArray = [];
                    for (let i = 0; i < parsedValue.length; i++) {
                        const charCode = parsedValue.charCodeAt(i);
                        byteArray.push(charCode);
                    }
                    //  Map the byte array to the GeneralStatusByte object
                    const additionalStatus2Bytes = {
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
                    const additionalStatus2 = {
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
        };
        this.subscribeRowingStrokeData = (callback) => {
            const service = PM5Service.Rowing;
            const characteristic = RowingCharacteristic;
            const serviceUUID = PM5ServiceUUIDs[service];
            const characteristicUUID = RowingCharacteristicUUIds[characteristic.StrokeData];
            const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err, char) => {
                if (char) {
                    //  Create the RowingStrokeData
                    //  A string of 16-bit Base64 (10 zero bits, 6 data bits) characters
                    const base64Value = char.value;
                    //  A string of 16-bit bytes (8 bits)
                    const parsedValue = atob(base64Value);
                    //  Generate a list of numbers where each number corresponds to the decimal value of the 8bit value.
                    const byteArray = [];
                    for (let i = 0; i < parsedValue.length; i++) {
                        const charCode = parsedValue.charCodeAt(i);
                        byteArray.push(charCode);
                    }
                    //  Map the byte array to the GeneralStatusByte object
                    const rowingStrokeDataBytes = {
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
                    const rowingStrokeData = {
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
        };
        this.subscribeGeneralStatus = (callback) => {
            const service = PM5Service.Rowing;
            const characteristic = RowingCharacteristic.GeneralStatus;
            const serviceUUID = PM5ServiceUUIDs[service];
            const characteristicUUID = RowingCharacteristicUUIds[characteristic];
            const subscription = this.device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (err, char) => {
                if (char) {
                    //  Create the AdditionalStatus1
                    //  A string of 16-bit Base64 (10 zero bits, 6 data bits each) characters
                    const base64Value = char.value;
                    //  A string of 16-bit bytes (8 data bits each)
                    const parsedValue = atob(base64Value);
                    //  A list of results
                    const byteArray = [];
                    for (let i = 0; i < parsedValue.length; i++) {
                        const charCode = parsedValue.charCodeAt(i);
                        byteArray.push(charCode);
                    }
                    //  Map the byte array to the GeneralStatusByte object
                    const generalStatusBytes = {
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
                    const generalStatus = {
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
        };
        this.unsubscribeAll = () => __awaiter(this, void 0, void 0, function* () {
            this.subscriptions.forEach((subscription) => {
                subscription.remove();
            });
            yield this.device.cancelConnection();
        });
    }
}
exports.PM5RowingService = PM5RowingService;
class PM5Device {
    constructor(device) {
        this.device = device;
    }
    setRate() {
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
//# sourceMappingURL=pm5-sdk.js.map