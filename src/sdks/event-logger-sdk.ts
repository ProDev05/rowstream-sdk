/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

import { HTTPSDK } from "../abstract-sdks";
import { LoggerEvent, LoggerEventInternal } from "../models";

export class EventLoggerSDK extends HTTPSDK<LoggerEvent, LoggerEvent, LoggerEventInternal> {
  protected endpoint = 'events';
}