/**
 * Copyright (c) 2019 Jonathan Andersen
 *
 * This software is proprietary and owned by Jonathan Andersen.
 */

import { BaseObject } from "./object-model";

export interface Session {
  start: string;
  end?: string;
  workoutId?: string;
}

export interface SessionInternal extends Session, BaseObject {}