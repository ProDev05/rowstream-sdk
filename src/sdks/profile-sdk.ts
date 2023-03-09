/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

import { HTTPSDK } from "../abstract-sdks";
import { Profile, ProfileResult } from "../models";

export class ProfileSDK extends HTTPSDK<Profile, Profile, ProfileResult> {
  protected endpoint = 'profiles';
}