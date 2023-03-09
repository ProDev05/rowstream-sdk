"use strict";
/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_sdks_1 = require("../abstract-sdks");
class JerseySDK extends abstract_sdks_1.HTTPSDK {
    constructor() {
        super(...arguments);
        this.endpoint = "jersey";
    }
    config(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`${this.host}/${this.endpoint}/config`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (res.status !== 201 && res.status !== 200) {
                    throw new Error(`Failed to create payload at endpoint '/${this.endpoint}'`);
                }
                const json = yield res.json();
                return json;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    getJerseys(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`${this.host}/${this.endpoint}/boathouse?id=${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                });
                if (res.status !== 201 && res.status !== 200) {
                    throw new Error(`Failed to create payload at endpoint '/${this.endpoint}'`);
                }
                const json = yield res.json();
                return json;
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
exports.JerseySDK = JerseySDK;
//# sourceMappingURL=jersey-sdk.js.map