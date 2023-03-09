/**
 * Copyright (c) 2019 Jonathan Andersen
 *
 * This software is proprietary and owned by Jonathan Andersen.
 */

import { BaseObject } from "./object-model";
import { GeneralStatus, AdditionalStatus1, RowingStrokeData, AdditionalStatus2 } from "../tools/pm5-sdk";

export interface SessionStat {
  sessionId: string;
}

export interface SessionSearchMetadata {
  sessionId: string;
}

export interface SessionGeneralStatusStat extends SessionStat, GeneralStatus {}

export interface SessionAdditionalStatus1Stat extends SessionStat, AdditionalStatus1 {}

export interface SessionAdditionalStatus2Stat extends SessionStat, AdditionalStatus2 {}
export interface SessionStrokeDataStat extends SessionStat, RowingStrokeData {}



export interface SessionGeneralStatusStatInternal extends BaseObject, SessionStat, GeneralStatus {}

export interface SessionAdditionalStatus1StatInternal extends BaseObject, SessionStat, AdditionalStatus1 {}

export interface SessionAdditionalStatus2StatInternal extends BaseObject, SessionStat, AdditionalStatus2 {}

export interface SessionStrokeDataStatInternal extends BaseObject, SessionStat, RowingStrokeData {}