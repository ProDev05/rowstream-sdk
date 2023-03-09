/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */
import { HTTPSDK } from "../abstract-sdks";
import { JerseyInternal, CreateJerseyPayload } from "../models";
export declare class JerseySDK extends HTTPSDK<CreateJerseyPayload, CreateJerseyPayload, JerseyInternal> {
    protected endpoint: string;
    config<T>(token?: string): Promise<T>;
    getJerseys<T>(id: string, token?: string): Promise<T>;
}
