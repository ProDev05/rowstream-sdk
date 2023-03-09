import { APIUser } from "./user-model";
import { BRStandings } from "./workout";
export interface WSMessage {
    type: string;
    user: APIUser;
}
export declare const BR_JOIN_MESSAGE = "br-join";
export interface BRJoinMessage extends WSMessage {
    type: typeof BR_JOIN_MESSAGE;
    userId: string;
    workoutId: string;
}
export declare const BOATHOUSE_RACE_STATUS_MESSAGE = "br-status";
export interface JoinBoathouseRaceStatusMessage extends WSMessage {
    type: typeof BOATHOUSE_RACE_STATUS_MESSAGE;
    workoutId: string;
    standings: BRStandings;
}
export declare const BOATHOUSE_RACE_DISTANCE_MESSAGE = "br-distance";
export interface BoathouseRaceDistanceMessage extends WSMessage {
    type: typeof BOATHOUSE_RACE_DISTANCE_MESSAGE;
    userId: string;
    distance: number;
    workoutId: string;
    timestamp: string;
}
export declare const BOATHOUSE_RACE_STANDINGS_MESSAGE = "br-standings";
export interface BoathouseRaceStandingsMessage extends WSMessage {
    type: typeof BOATHOUSE_RACE_STANDINGS_MESSAGE;
    standings: BRStandings;
}
export declare const BOATHOUSE_RACE_END_MESSAGE = "br-end";
export interface BoathouseRaceEndMessage extends WSMessage {
    type: typeof BOATHOUSE_RACE_END_MESSAGE;
}
