import { AggParams, AggResult, SearchResult, SearchParams } from '../models';
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
export declare abstract class CRUDSDK<CreatePayload, UpdatePayload, Return, SearchMetadata = any> {
    abstract create(payload: CreatePayload): Promise<Return>;
    abstract createBulk(parentId: string, payloadList: CreatePayload[]): Promise<void>;
    abstract getStats(params: AggParams, token?: string): Promise<AggResult>;
    abstract retrieve(id: string): Promise<Return>;
    abstract search(params?: SearchParams<SearchMetadata>, token?: string): Promise<SearchResult<Return>>;
    abstract delete(id: string): Promise<void>;
    abstract update(id: string, payload: UpdatePayload): Promise<Return>;
    abstract postUpload(payload: CreatePayload): Promise<Return>;
}
