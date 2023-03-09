"use strict";
/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_sdks_1 = require("../abstract-sdks");
class WorkoutSDK extends abstract_sdks_1.HTTPSDK {
    constructor() {
        super(...arguments);
        this.endpoint = 'workouts';
    }
}
exports.WorkoutSDK = WorkoutSDK;
//# sourceMappingURL=workout-sdk.js.map