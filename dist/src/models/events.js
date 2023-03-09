"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/NodeStarter,
 * licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var LoggerEventName;
(function (LoggerEventName) {
    LoggerEventName["CreateSession"] = "create-session";
    LoggerEventName["UploadStat"] = "upload-stat";
    LoggerEventName["CloseSession"] = "close-session";
})(LoggerEventName = exports.LoggerEventName || (exports.LoggerEventName = {}));
var LoggerEventType;
(function (LoggerEventType) {
    LoggerEventType["Info"] = "info";
    LoggerEventType["Error"] = "error";
    LoggerEventType["Warning"] = "warning";
    LoggerEventType["Success"] = "success";
})(LoggerEventType = exports.LoggerEventType || (exports.LoggerEventType = {}));
exports.eventElasticSchema = {
    'user': { 'type': 'keyword' },
    'name': { 'type': 'keyword' },
    'description': { 'type': 'text' },
    'meta': { 'type': 'object' },
    'type': { 'type': 'keyword' },
};
//# sourceMappingURL=events.js.map