/**
 * A stat transmitted over a Websocket to all clients listening to the given channel (Workout ID).
 */
export interface WorkoutStat {
  rowerId: string;
  timestamp: string;
  distance: number;
  workoutId: string;
}
