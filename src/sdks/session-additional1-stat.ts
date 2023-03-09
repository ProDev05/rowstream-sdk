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


import { SessionAdditionalStatus1Stat, SessionAdditionalStatus1StatInternal, SessionSearchMetadata } from "../models";

export class SessionAdditional1StatSDK extends HTTPSDK<SessionAdditionalStatus1Stat, SessionAdditionalStatus1Stat, SessionAdditionalStatus1StatInternal, SessionSearchMetadata> {
  protected endpoint = 'session-additional1-stats';
}

