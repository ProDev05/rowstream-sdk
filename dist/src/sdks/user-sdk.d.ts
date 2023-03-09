/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
import { HTTPSDK } from "../abstract-sdks";
import { CreateUserParams, APIUser, UpdateUserParams } from "../models";
export declare class UserSDK extends HTTPSDK<CreateUserParams, UpdateUserParams, APIUser> {
    protected endpoint: string;
}
