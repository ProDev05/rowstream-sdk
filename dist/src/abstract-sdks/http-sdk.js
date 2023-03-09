"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crud_sdk_1 = require("./crud-sdk");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
exports.constructQueryString = (obj) => {
    const queryParams = Object.keys(obj).map((key) => {
        const value = obj[key];
        //  TODO:  Consider a less intrusive encoding to increase readability.
        const param = `${key}=${encodeURIComponent(value)}`;
        return param;
    });
    const queryString = queryParams.join('&');
    return queryString;
};
//  TODO:  Implement more useful errors.
class HTTPSDK extends crud_sdk_1.CRUDSDK {
    constructor(host) {
        super();
        this.host = host;
    }
    create(payload, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                    },
                    body: JSON.stringify(payload),
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
    createBulk(parentId, payloadList, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}-bulk?parentId=${parentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify(payloadList),
            });
            if (res.status !== 201 && res.status !== 200) {
                throw new Error(`Failed to create payloads at endpoint '/${this.endpoint}-bulk'`);
            }
            return;
        });
    }
    bucketQuery(params, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}-bucket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify(params),
            });
            if (res.status !== 201 && res.status !== 200) {
                throw new Error(`Failed to create payloads at endpoint '/${this.endpoint}-bucket'`);
            }
            const json = yield res.json();
            return json;
        });
    }
    getStats(params, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}-stats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify(params),
            });
            if (res.status !== 200) {
                throw new Error(`Failed to get stats at endpoint ${this.endpoint}-stats`);
            }
            const json = yield res.json();
            return json;
        });
    }
    retrieve(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            });
            if (res.status !== 200) {
                throw new Error(`Failed to search at endpoint ${this.endpoint}`);
            }
            const json = yield res.json();
            return json;
        });
    }
    //  TODO:  Update search criteria!
    search(params, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify(params),
            });
            if (res.status !== 200) {
                throw new Error(`Failed to search at endpoint ${this.endpoint}`);
            }
            const json = yield res.json();
            return json;
        });
    }
    delete(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            });
            if (res.status !== 200) {
                throw new Error(`Failed to delete at endpoint ${this.endpoint}.`);
            }
        });
    }
    update(id, payload, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify(payload),
            });
            if (res.status !== 200) {
                throw new Error(`Failed to create payload at endpoint '/${this.endpoint}'`);
            }
            const json = yield res.json();
            return json;
        });
    }
    postUpload(payload, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fd = new FormData();
                fd.append('file', {
                    // @ts-ignore
                    uri: payload.sourceURL,
                    type: payload.mime,
                    name: payload.filename,
                    path: payload.path,
                });
                const res = yield cross_fetch_1.default(`${this.host}/${this.endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': token,
                    },
                    body: fd,
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
exports.HTTPSDK = HTTPSDK;
//# sourceMappingURL=http-sdk.js.map