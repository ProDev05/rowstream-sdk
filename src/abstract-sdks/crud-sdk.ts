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

//  TODO:  Consider breaking out the types for EACH method.
//  TODO:  Consider some other pattern for breaking down each method... maybe a class for each?
//  NOTE:  Templating here is useful because it enables a class to be constructed with variable types WITHOUT constructing
//         a new class for each.
export abstract class CRUDSDK<
  CreatePayload,
  UpdatePayload,
  Return,
  SearchMetadata = any
> {
  public abstract create(payload: CreatePayload): Promise<Return>;
  public abstract createBulk(
    parentId: string,
    payloadList: CreatePayload[]
  ): Promise<void>;
  public abstract getStats(
    params: AggParams,
    token?: string
  ): Promise<AggResult>;
  public abstract retrieve(id: string): Promise<Return>;
  public abstract search(
    params?: SearchParams<SearchMetadata>,
    token?: string
  ): Promise<SearchResult<Return>>;
  public abstract delete(id: string): Promise<void>;
  public abstract update(id: string, payload: UpdatePayload): Promise<Return>;

  public abstract postUpload(payload: CreatePayload): Promise<Return>;
}
