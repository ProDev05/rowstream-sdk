/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
import { HTTPSDK } from "../abstract-sdks";
import { Workout, WorkoutInternal } from "../models";
export declare class WorkoutSDK extends HTTPSDK<Workout, Workout, WorkoutInternal> {
    protected endpoint: string;
}
