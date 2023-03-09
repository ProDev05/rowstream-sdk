/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

export interface AggData {
  count: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
  min_as_string: string;
  max_as_string: string;
  avg_as_string: string;
  sum_as_string: string;
  sum_of_squares: number;
  variance: number;
  std_deviation: number;
  std_deviation_bounds: {
      upper: number;
      lower: number;
  };
  sum_of_squares_as_string: string;
  variance_as_string: string;
  std_deviation_as_string: string;
  std_deviation_bounds_as_string: {
      upper: string;
      lower: string;
  };
}

export interface AggParams {
  match?: {
      [fieldName: string]: string;
  };
  fields: string[];
}
export interface AggResult {
  [fieldName: string]: AggData;
}
