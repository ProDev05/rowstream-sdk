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
const rowstream_utils_1 = require("../src/tools/rowstream-utils");
const pm5_sdk_1 = require("../src/tools/pm5-sdk");
const chai_1 = require("chai");
const consumerTokenParams = {
    username: "consumer",
    password: "testpass123",
};
const profile = {
    name: "test_name",
    city: "test_city",
    state: "MA",
    avatar: "https://media.licdn.com/dms/image/C4E03AQGCS-gtkIsWPw/profile-displayphoto-shrink_200_200/0?e=1553126400&v=beta&t=ra5ykvv7k9PASkNlT3zioLC_58aNCQZo31BMfSVIRm0",
};
const sessionParams = {
    start: new Date().toISOString(),
};
const sessionGeneralStatParams = {
    elapsedTime: new Date(),
    distance: 5,
    workoutType: pm5_sdk_1.WorkoutType["Fixed Calorie"],
    intervalType: pm5_sdk_1.IntervalType.Calorie,
    workoutState: pm5_sdk_1.WorkoutState["Countdown Pause"],
    rowingState: pm5_sdk_1.RowingState.Active,
    strokeState: pm5_sdk_1.StrokeState.Driving,
    totalWorkDistance: 5,
    workoutDuration: 5,
    workoutDurationType: pm5_sdk_1.WorkoutDurationType["Calories Duration"],
    dragFactor: 5,
};
exports.sessionGeneralStatParamsStart = {
    elapsedTime: new Date(0),
    distance: 0,
    workoutType: pm5_sdk_1.WorkoutType["Fixed Calorie"],
    intervalType: pm5_sdk_1.IntervalType.Calorie,
    workoutState: pm5_sdk_1.WorkoutState["Workout Row"],
    rowingState: pm5_sdk_1.RowingState.Active,
    strokeState: pm5_sdk_1.StrokeState.Driving,
    totalWorkDistance: 0,
    workoutDuration: 0,
    workoutDurationType: pm5_sdk_1.WorkoutDurationType["Calories Duration"],
    dragFactor: 20,
};
exports.sessionGeneralStatParamsEnd = {
    elapsedTime: new Date(1000 * 60 * 60),
    distance: 10 * 1000,
    workoutType: pm5_sdk_1.WorkoutType["Fixed Calorie"],
    intervalType: pm5_sdk_1.IntervalType.Calorie,
    workoutState: pm5_sdk_1.WorkoutState["Countdown Pause"],
    rowingState: pm5_sdk_1.RowingState.Active,
    strokeState: pm5_sdk_1.StrokeState.Driving,
    totalWorkDistance: 10 * 1000,
    workoutDuration: 10 * 1000,
    workoutDurationType: pm5_sdk_1.WorkoutDurationType["Calories Duration"],
    dragFactor: 7,
};
exports.sessionAdditional1StatParamsStart = {
    elapsedTime: new Date(0),
    speed: 30,
    strokeRate: 30,
    heartRate: 90,
    currentPace: new Date(1000 * 60 * 1),
    averagePace: new Date(1000 * 60 * 1),
    restDistance: 50,
    restTime: 0,
};
exports.sessionAdditional1StatParamsEnd = {
    elapsedTime: new Date(1000 * 60 * 60),
    speed: 100,
    strokeRate: 100,
    heartRate: 180,
    currentPace: new Date(1000 * 60 * 3),
    averagePace: new Date(1000 * 60 * 3),
    restDistance: 100,
    restTime: 10,
};
exports.sessionAdditional2StatParamsStart = {
    elapsedTime: new Date(0),
    intervalCount: 5,
    averagePower: 5,
    totalCalories: 5,
    splitIntAvgPace: 5,
    splitIntAvgPower: 5,
    splitIntAvgCalories: 5,
    lastSplitTime: 5,
    lastSplitDistance: 5,
};
exports.sessionAdditional2StatParamsEnd = {
    elapsedTime: new Date(1000 * 60 * 60),
    intervalCount: 20,
    averagePower: 30,
    totalCalories: 30,
    splitIntAvgPace: 30,
    splitIntAvgPower: 30,
    splitIntAvgCalories: 30,
    lastSplitTime: 30,
    lastSplitDistance: 30,
};
exports.rowingStrokeDataStatParamsStart = {
    elapsedTime: new Date(),
    distance: 1000,
    driveLength: 20,
    driveTime: 30,
    strokeRecoveryTime: 30,
    strokeDistance: 30,
    peakDriveForce: 50,
    averageDriveForce: 40,
    workPerStroke: 40,
    strokeCount: 30,
};
const totalNum = 300;
var TestDataGenerator;
(function (TestDataGenerator) {
    TestDataGenerator[TestDataGenerator["Linear"] = 0] = "Linear";
    TestDataGenerator[TestDataGenerator["RandomBezier"] = 1] = "RandomBezier";
})(TestDataGenerator = exports.TestDataGenerator || (exports.TestDataGenerator = {}));
exports.generateTestData = (initial, final, count, method, multiplier = 1) => {
    if (method === TestDataGenerator.Linear) {
        const testData = [];
        for (let i = 0; i < count; i++) {
            const dataPoint = {};
            for (const key of Object.keys(initial)) {
                const rawInitialValue = initial[key];
                if (typeof rawInitialValue == "string") {
                    dataPoint[key] = rawInitialValue;
                }
                else {
                    const initialValue = initial[key] instanceof Date
                        ? initial[key].getTime()
                        : initial[key];
                    const finalValue = final[key] instanceof Date
                        ? final[key].getTime()
                        : final[key];
                    const interval = (finalValue - initialValue) / (count - 1);
                    const pointValue = (initialValue + interval * i) * multiplier;
                    dataPoint[key] = pointValue;
                }
            }
            testData.push(dataPoint);
        }
        return testData;
    }
    else {
        throw new Error("Unsupported Generator Specified.");
    }
};
const sessionAdditional2StatParams = {
    elapsedTime: new Date(),
    intervalCount: 5,
    averagePower: 5,
    totalCalories: 5,
    splitIntAvgPace: 5,
    splitIntAvgPower: 5,
    splitIntAvgCalories: 5,
    lastSplitTime: 5,
    lastSplitDistance: 5,
};
//  Test the SDKs
describe("SDKs", () => {
    let consumerToken;
    let session;
    let sessionStatGeneral;
    let sessionStatAdditional1;
    let sessionStatAdditional2;
    it("should create the tokens", () => __awaiter(this, void 0, void 0, function* () {
        const consumerTokenRes = yield rowstream_utils_1.tokenSDK.create(consumerTokenParams);
        consumerToken = consumerTokenRes.token;
    }));
    describe("User", () => {
        it("should retrieve a user", () => __awaiter(this, void 0, void 0, function* () {
            yield rowstream_utils_1.userSDK.retrieve(consumerTokenParams.username, consumerToken);
        }));
    });
    describe("Profile", () => {
        it("should create a profile", () => __awaiter(this, void 0, void 0, function* () {
            //  TODO:  Always do this with a NEW user because they're currently limited to ONE per user hmm...
            const profileInternal = yield rowstream_utils_1.profileSDK.create(profile, consumerToken);
            chai_1.expect(profileInternal !== undefined);
        }));
        it("should retrieve a profile", () => __awaiter(this, void 0, void 0, function* () {
            yield rowstream_utils_1.profileSDK.retrieve(consumerTokenParams.username, consumerToken);
        }));
        it("should update a profile", () => __awaiter(this, void 0, void 0, function* () {
            //  NOTE:  ProfileID and UserID are the same.
            yield rowstream_utils_1.profileSDK.update(consumerTokenParams.username, profile, consumerToken);
        }));
    });
    describe("Session", () => {
        it("should create a session", () => __awaiter(this, void 0, void 0, function* () {
            session = yield rowstream_utils_1.sessionSDK.create(sessionParams, consumerToken);
        }));
        it("should create another session", () => __awaiter(this, void 0, void 0, function* () {
            yield rowstream_utils_1.sessionSDK.create(sessionParams, consumerToken);
        }));
        it("should retrieve a session", () => __awaiter(this, void 0, void 0, function* () {
            session = yield rowstream_utils_1.sessionSDK.retrieve(session.id, consumerToken);
            if (session.end !== undefined) {
                throw new Error("SESSION END SHOULD BE UNDEFINED");
            }
        }));
        it("should update a session", () => __awaiter(this, void 0, void 0, function* () {
            const updatedSessionParams = Object.assign({ end: new Date().toISOString() }, sessionParams);
            yield rowstream_utils_1.sessionSDK.update(session.id, updatedSessionParams, consumerToken);
        }));
        it("should retrieve a session", () => __awaiter(this, void 0, void 0, function* () {
            session = yield rowstream_utils_1.sessionSDK.retrieve(session.id, consumerToken);
            if (session.end === undefined) {
                throw new Error("SESSION END SHOULD BE DEFINED");
            }
        }));
        it("should search sessions", () => __awaiter(this, void 0, void 0, function* () {
            const sessions = yield rowstream_utils_1.sessionSDK.search({}, consumerToken);
            if (sessions.total < 2) {
                throw new Error("Unexpected number of sessions!");
            }
        }));
        it("should search sessions with filter", () => __awaiter(this, void 0, void 0, function* () {
            const sessions = yield rowstream_utils_1.sessionSDK.search({ search: { match: { id: session.id } } }, consumerToken);
            if (sessions.total !== 1) {
                throw new Error("Unexpected number of sessions!");
            }
        }));
        it("should search sessions with array (or) filter", () => __awaiter(this, void 0, void 0, function* () {
            const sessions = yield rowstream_utils_1.sessionSDK.search({ search: { any: [{ match: { id: session.id } }] } }, consumerToken);
            if (sessions.total !== 1) {
                throw new Error("Unexpected number of sessions!");
            }
        }));
    });
    describe("General Session Stats", () => {
        it("should create a general session stat", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStatParams = Object.assign({}, sessionGeneralStatParams, { sessionId: session.id });
            sessionStatGeneral = yield rowstream_utils_1.sessionGeneralStatSDK.create(sessionStatParams, consumerToken);
        }));
        it("should retrieve a general  session stat", () => __awaiter(this, void 0, void 0, function* () {
            sessionStatGeneral = yield rowstream_utils_1.sessionGeneralStatSDK.retrieve(sessionStatGeneral.id, consumerToken);
        }));
        it("should search general session stats", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStats = yield rowstream_utils_1.sessionGeneralStatSDK.search({ metadata: { sessionId: session.id } }, consumerToken);
            console.log(sessionStats);
        }));
        it("should create general session stats with the bulk API", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStatParams = Object.assign({}, sessionGeneralStatParams, { sessionId: session.id });
            const sessionStatList = [
                sessionStatParams,
                sessionStatParams,
                sessionStatParams,
                sessionStatParams,
                sessionStatParams,
            ];
            yield rowstream_utils_1.sessionGeneralStatSDK.createBulk(session.id, sessionStatList, consumerToken);
        }));
        it("should give aggregations on general stats", () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                match: { sessionId: session.id },
                fields: ["elapsedTime", "distance"],
            };
            const sessionStats = yield rowstream_utils_1.sessionGeneralStatSDK.getStats(params, consumerToken);
            console.log(sessionStats);
        }));
    });
    describe("General Session Stats", () => {
        it("should create a additional1 session stat", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStatParams = Object.assign({}, exports.sessionAdditional1StatParamsStart, { sessionId: session.id });
            sessionStatAdditional1 = yield rowstream_utils_1.sessionAdditional1StatSDK.create(sessionStatParams, consumerToken);
        }));
        it("should retrieve a additional1  session stat", () => __awaiter(this, void 0, void 0, function* () {
            sessionStatAdditional1 = yield rowstream_utils_1.sessionAdditional1StatSDK.retrieve(sessionStatAdditional1.id, consumerToken);
        }));
        it("should search additional1 session stats", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStats = yield rowstream_utils_1.sessionAdditional1StatSDK.search({ metadata: { sessionId: session.id } }, consumerToken);
        }));
        it("should create additional1 session stats with the bulk API", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStatList = exports.generateTestData(exports.sessionAdditional1StatParamsStart, exports.sessionAdditional1StatParamsEnd, totalNum, TestDataGenerator.Linear);
            const sessionStatListUpdated = sessionStatList.map((testData) => (Object.assign({}, testData, { sessionId: session.id })));
            yield rowstream_utils_1.sessionAdditional1StatSDK.createBulk(session.id, sessionStatListUpdated, consumerToken);
        }));
        it("should give aggregations on additional1 stats", () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                match: { sessionId: session.id },
                fields: ["elapsedTime", "distance"],
            };
            const sessionStats = yield rowstream_utils_1.sessionAdditional1StatSDK.getStats(params, consumerToken);
            console.log(sessionStats);
        }));
        it("should give bucket aggregations with extended stats", () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                sessionId: session.id,
                interval: "5s",
                bucketFields: ["strokeRate", "heartRate"],
            };
            try {
                const sessionStats = yield rowstream_utils_1.sessionAdditional1StatSDK.bucketQuery(params, consumerToken);
                console.log(sessionStats);
            }
            catch (error) {
                throw error;
            }
        }));
    });
    describe("General Session Stats", () => {
        it("should create a additional2 session stat", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStatParams = Object.assign({}, sessionAdditional2StatParams, { sessionId: session.id });
            sessionStatAdditional2 = yield rowstream_utils_1.sessionAdditional2StatSDK.create(sessionStatParams, consumerToken);
        }));
        it("should retrieve a additional2  session stat", () => __awaiter(this, void 0, void 0, function* () {
            sessionStatAdditional2 = yield rowstream_utils_1.sessionAdditional2StatSDK.retrieve(sessionStatAdditional2.id, consumerToken);
        }));
        it("should search additional2 session stats", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStats = yield rowstream_utils_1.sessionAdditional2StatSDK.search({ metadata: { sessionId: session.id } }, consumerToken);
        }));
        it("should create additional2 session stats with the bulk API", () => __awaiter(this, void 0, void 0, function* () {
            const sessionStatParams = Object.assign({}, sessionAdditional2StatParams, { sessionId: session.id });
            const sessionStatList = [
                sessionStatParams,
                sessionStatParams,
                sessionStatParams,
                sessionStatParams,
                sessionStatParams,
            ];
            yield rowstream_utils_1.sessionAdditional2StatSDK.createBulk(session.id, sessionStatList, consumerToken);
        }));
        it("should give aggregations on additional2 stats", () => __awaiter(this, void 0, void 0, function* () {
            const params = {
                match: { sessionId: session.id },
                fields: ["elapsedTime", "distance"],
            };
            const sessionStats = yield rowstream_utils_1.sessionAdditional2StatSDK.getStats(params, consumerToken);
            console.log(sessionStats);
        }));
    });
});
//# sourceMappingURL=sdk.test.js.map