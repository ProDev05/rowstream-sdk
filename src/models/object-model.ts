/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

export interface BaseObject {
  created: Date;
  updated: Date;
  id: string;
  owner: string;  //  UserID of the Owner
  // read: string[];  //  List of permissioned UserIDs
  // write: string[];  //  List of permissioned UserIDs
}
