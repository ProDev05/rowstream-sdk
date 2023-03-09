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


import { SessionAdditionalStatus2Stat, SessionAdditionalStatus2StatInternal, SessionSearchMetadata } from "../models";

export class SessionAdditional2StatSDK extends HTTPSDK<SessionAdditionalStatus2Stat, SessionAdditionalStatus2Stat, SessionAdditionalStatus2StatInternal, SessionSearchMetadata> {
  protected endpoint = 'session-additional2-stats';
}