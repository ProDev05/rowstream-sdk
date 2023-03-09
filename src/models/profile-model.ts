/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

export interface Profile {
  name?: string;
  city?: string;
  state?: string;
  avatar?: string;
}

export interface ProfileResult extends Profile {
  username: string;
}
