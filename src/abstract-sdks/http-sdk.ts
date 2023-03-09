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
import fetch from 'cross-fetch';
import {
  AggParams,
  AggResult,
  BucketQueryParamsAPI,
  BucketQueryReturn,
  SearchParams,
  SearchResult,
} from '../models';

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

export const constructQueryString = (obj: any): string => {
  const queryParams = Object.keys(obj).map((key: string) => {
    const value = obj[key];
    //  TODO:  Consider a less intrusive encoding to increase readability.
    const param = `${key}=${encodeURIComponent(value)}`;
    return param;
  });
  const queryString = queryParams.join('&');
  return queryString;
};

//  TODO:  Implement more useful errors.
export abstract class HTTPSDK<
  CreatePayload,
  UpdatePayload,
  Return,
  SearchMetadata = any
> extends CRUDSDK<CreatePayload, UpdatePayload, Return, SearchMetadata> {
  protected abstract endpoint: string;

  constructor(public host: string) {
    super();
  }

  public async create(payload: CreatePayload, token?: string): Promise<Return> {
    try {
      const res = await fetch(`${this.host}/${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(payload),
      });
      if (res.status !== 201 && res.status !== 200) {
        throw new Error(
          `Failed to create payload at endpoint '/${this.endpoint}'`
        );
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async createBulk(
    parentId: string,
    payloadList: CreatePayload[],
    token?: string
  ): Promise<void> {
    const res = await fetch(
      `${this.host}/${this.endpoint}-bulk?parentId=${parentId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(payloadList),
      }
    );
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(
        `Failed to create payloads at endpoint '/${this.endpoint}-bulk'`
      );
    }
    return;
  }

  public async bucketQuery(
    params: BucketQueryParamsAPI,
    token?: string
  ): Promise<BucketQueryReturn[]> {
    const res = await fetch(`${this.host}/${this.endpoint}-bucket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify(params),
    });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(
        `Failed to create payloads at endpoint '/${this.endpoint}-bucket'`
      );
    }
    const json = await res.json();
    return json;
  }

  public async getStats(params: AggParams, token?: string): Promise<AggResult> {
    const res = await fetch(`${this.host}/${this.endpoint}-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify(params),
    });
    if (res.status !== 200) {
      throw new Error(`Failed to get stats at endpoint ${this.endpoint}-stats`);
    }
    const json = await res.json();
    return json;
  }

  public async retrieve(id: string, token?: string): Promise<Return> {
    const res = await fetch(`${this.host}/${this.endpoint}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
    });
    if (res.status !== 200) {
      throw new Error(`Failed to search at endpoint ${this.endpoint}`);
    }
    const json = await res.json();
    return json;
  }

  //  TODO:  Update search criteria!
  public async search(
    params?: SearchParams<SearchMetadata>,
    token?: string
  ): Promise<SearchResult<Return>> {
    const res = await fetch(`${this.host}/${this.endpoint}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify(params),
    });
    if (res.status !== 200) {
      throw new Error(`Failed to search at endpoint ${this.endpoint}`);
    }
    const json = await res.json();
    return json;
  }

  public async delete(id: string, token?: string): Promise<void> {
    const res = await fetch(`${this.host}/${this.endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
    });
    if (res.status !== 200) {
      throw new Error(`Failed to delete at endpoint ${this.endpoint}.`);
    }
  }

  public async update(
    id: string,
    payload: UpdatePayload,
    token?: string
  ): Promise<Return> {
    const res = await fetch(`${this.host}/${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify(payload),
    });
    if (res.status !== 200) {
      throw new Error(
        `Failed to create payload at endpoint '/${this.endpoint}'`
      );
    }
    const json = await res.json();
    return json;
  }

  public async postUpload(payload: any, token?: string): Promise<Return> {
    try {
      const fd = new FormData();
      fd.append('file', {
        // @ts-ignore
        uri: payload.sourceURL,
        type: payload.mime,
        name: payload.filename,
        path: payload.path,
      });
      const res = await fetch(`${this.host}/${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token,
        },
        body: fd,
      });
      if (res.status !== 201 && res.status !== 200) {
        throw new Error(
          `Failed to create payload at endpoint '/${this.endpoint}'`
        );
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // public test(payload: Input, params?: TestParams, token?: string) {

  //   //  Update Test Params
  //   params = params ? params : { create: true, retrieve: true, search: true, delete: true, update: true };

  //   //  Define Tests
  //   describe(`HTTP SDK '${this.endpoint}'`, () => {
  //     let instanceId: string;

  //     if (params.create) {
  //       it('should create an instance', async () => {
  //         instanceId = await this.create(payload, token);
  //       });
  //     }

  //     if (params.retrieve) {
  //       it('should retrieve an existing instance', async () => {
  //         const inst = await this.retrieve(instanceId, token);
  //       });
  //     }

  //     if (params.search) {
  //       it('should search instances', async () => {
  //         const instList = await this.search({}, token);
  //         //  TODO:  Asset that it's an array.
  //       });
  //     }

  //     if (params.delete) {
  //       it('should delete an instance', async () => {
  //         await this.delete(instanceId, token);
  //       });
  //     }

  //     if (params.update) {
  //       it('should update an instance', async () => {
  //         await this.update(instanceId, payload, token);
  //       });
  //     }
  //   });
  // }
}
