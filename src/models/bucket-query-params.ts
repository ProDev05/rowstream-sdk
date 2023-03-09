/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

import { AggData } from "./aggregation-params";

export interface BucketQueryReturn {
  timestamp: string;
  count: number;
  stats: {
    [fieldName: string]: AggData;
  };
}

export interface BucketQueryParamsAPI {
  sessionId: string;
  bucketFields: string[];
  interval: string;
}

export interface BucketQueryParams {
  and: { [fieldName: string]: any };
  timestampField: string;
  interval: string;
  bucketFields: string[];
}
