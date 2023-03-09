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
export declare enum LoggerEventName {
    CreateSession = "create-session",
    UploadStat = "upload-stat",
    CloseSession = "close-session"
}
export declare enum LoggerEventType {
    Info = "info",
    Error = "error",
    Warning = "warning",
    Success = "success"
}
export interface LoggerEvent {
    user: string;
    name: string;
    description?: string;
    meta?: any;
    type: LoggerEventType;
}
export interface LoggerEventInternal extends BaseObject, LoggerEvent {
}
export declare const eventElasticSchema: {
    'user': {
        'type': string;
    };
    'name': {
        'type': string;
    };
    'description': {
        'type': string;
    };
    'meta': {
        'type': string;
    };
    'type': {
        'type': string;
    };
};
