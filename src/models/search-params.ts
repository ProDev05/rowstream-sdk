/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

//  TODO:  Combine search and aggregations.

export interface SearchTermBase {
}

export interface MatchSearchTerm extends SearchTermBase {
  match: {
    [path: string]: any;
  };
}

export interface AllSearchTerm extends SearchTermBase {
  all: SearchTerm[];
}

export interface AnySearchTerm extends SearchTermBase {
  any: SearchTerm[];
}

export type SearchTerm = AnySearchTerm | AllSearchTerm | MatchSearchTerm;



export interface SearchParams<SearchMetadata = any> {

  //  TODO:  This is flat for now... consider expanding.
  //  NOTE:  If an Array type value is specified, then ANY of the given values must match, NOT ALL.
  search?: SearchTerm;
  size?: number;
  from?: number;
  metadata?: SearchMetadata;
}

export interface SearchResult<T> {
  total: number;
  results: T[];
}