/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */

import { BaseObject } from "./object-model";

export enum LoggerEventName {
  CreateSession = 'create-session',
  UploadStat = 'upload-stat',
  CloseSession = 'close-session'
}

export enum LoggerEventType {
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Success = 'success'
}

export interface LoggerEvent {
  user: string;
  name: string;
  description?: string;
  meta?: any;
  type: LoggerEventType;
}

export interface LoggerEventInternal extends BaseObject, LoggerEvent {}

export const eventElasticSchema = {
  'user': { 'type': 'keyword' },
  'name': { 'type': 'keyword' },
  'description': { 'type': 'text' },
  'meta': { 'type': 'object' },
  'type': { 'type': 'keyword' },
};
