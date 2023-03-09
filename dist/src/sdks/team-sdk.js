"use strict";
/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_sdks_1 = require("../abstract-sdks");
class TeamSDK extends abstract_sdks_1.HTTPSDK {
    constructor() {
        super(...arguments);
        this.endpoint = 'teams';
    }
}
exports.TeamSDK = TeamSDK;
//# sourceMappingURL=team-sdk.js.map