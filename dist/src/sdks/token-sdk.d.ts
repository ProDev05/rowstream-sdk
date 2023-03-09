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
import { TokenParams, TokenResult } from "../models/token-model";
export declare class TokenSDK extends HTTPSDK<TokenParams, TokenParams, TokenResult> {
    protected endpoint: string;
}
