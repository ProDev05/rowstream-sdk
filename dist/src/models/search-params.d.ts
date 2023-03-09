/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
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
export declare type SearchTerm = AnySearchTerm | AllSearchTerm | MatchSearchTerm;
export interface SearchParams<SearchMetadata = any> {
    search?: SearchTerm;
    size?: number;
    from?: number;
    metadata?: SearchMetadata;
}
export interface SearchResult<T> {
    total: number;
    results: T[];
}
