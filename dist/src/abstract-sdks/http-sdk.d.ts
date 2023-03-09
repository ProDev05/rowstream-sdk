/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
import { CRUDSDK } from './crud-sdk';
import { AggParams, AggResult, BucketQueryParamsAPI, BucketQueryReturn, SearchParams, SearchResult } from '../models';
export interface SearchCriteria {
    [name: string]: any;
}
export interface TestParams {
    create?: boolean;
    retrieve?: boolean;
    search?: boolean;
    delete?: boolean;
    update?: boolean;
}
export declare const constructQueryString: (obj: any) => string;
export declare abstract class HTTPSDK<CreatePayload, UpdatePayload, Return, SearchMetadata = any> extends CRUDSDK<CreatePayload, UpdatePayload, Return, SearchMetadata> {
    host: string;
    protected abstract endpoint: string;
    constructor(host: string);
    create(payload: CreatePayload, token?: string): Promise<Return>;
    createBulk(parentId: string, payloadList: CreatePayload[], token?: string): Promise<void>;
    bucketQuery(params: BucketQueryParamsAPI, token?: string): Promise<BucketQueryReturn[]>;
    getStats(params: AggParams, token?: string): Promise<AggResult>;
    retrieve(id: string, token?: string): Promise<Return>;
    search(params?: SearchParams<SearchMetadata>, token?: string): Promise<SearchResult<Return>>;
    delete(id: string, token?: string): Promise<void>;
    update(id: string, payload: UpdatePayload, token?: string): Promise<Return>;
    postUpload(payload: any, token?: string): Promise<Return>;
}
