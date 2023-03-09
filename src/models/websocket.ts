
//  TODO:  Can be shared between server and client

import { APIUser } from "./user-model";
import { BRStandings } from "./workout";

export interface WSMessage {
  type: string;
  user: APIUser;
}

export const BR_JOIN_MESSAGE = 'br-join';
export interface BRJoinMessage extends WSMessage {
  type: typeof BR_JOIN_MESSAGE;
  userId: string;
  workoutId: string;
}


export const BOATHOUSE_RACE_STATUS_MESSAGE = 'br-status';
export interface JoinBoathouseRaceStatusMessage extends WSMessage {
  type: typeof BOATHOUSE_RACE_STATUS_MESSAGE;
  workoutId: string; //  Boathouse Race ID
  standings: BRStandings;
}


export const BOATHOUSE_RACE_DISTANCE_MESSAGE = 'br-distance';
export interface BoathouseRaceDistanceMessage extends WSMessage {
  type: typeof BOATHOUSE_RACE_DISTANCE_MESSAGE;
  userId: string;
  distance: number;
  workoutId: string;
  timestamp: string;
}

export const BOATHOUSE_RACE_STANDINGS_MESSAGE = 'br-standings';
export interface BoathouseRaceStandingsMessage extends WSMessage {
  type: typeof BOATHOUSE_RACE_STANDINGS_MESSAGE;
  standings: BRStandings;
}

export const BOATHOUSE_RACE_END_MESSAGE = 'br-end';
export interface BoathouseRaceEndMessage extends WSMessage {
  type: typeof BOATHOUSE_RACE_END_MESSAGE;
}
