/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

import { HTTPSDK } from "../abstract-sdks";
import { SessionStrokeDataStatInternal, SessionSearchMetadata, SessionStrokeDataStat } from "../models";


export class SessionStrokeDataStatSDK extends HTTPSDK<SessionStrokeDataStat, SessionStrokeDataStat, SessionStrokeDataStatInternal, SessionSearchMetadata> {
  protected endpoint = 'session-stroke-data-stats';
}
