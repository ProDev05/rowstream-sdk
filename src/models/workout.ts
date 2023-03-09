import { BaseObject } from "./object-model";
import { APIUser } from "./user-model";
import { Profile } from "./profile-model";
import { TeamInternal } from "./team";

//  NOTE:  We support several options for a "Race Workout".  When we have a TOTAllY different experience, we can make a new Workout type?
//  IDEA:  We CAN show different "Workout Types" in the frontend, but PERHAPS all the options are stored here?  This WILL almost certainly get more complex.  We can adjust as we need to.

export interface UserInfo {
  profile: Profile;
  user: APIUser;
  distance: number;
  //  CONSIDER:  We COULD also track "last-updated" and even store ALL of the records.
}

export interface BRStandings {
  [boathouseId: string]: {
    distance: number;
    users: { [username: string]: UserInfo };
    boathouse: TeamInternal;
    color: string;
    elapsedTime: number;  //  Time in MS since the beginning of the race to reach the current distance.
  };
}


export interface Workout {

  //  Type
  // type: 'peer-race' | 'peer-workout' | 'boathouse-race';

  //  Identity
  name?: string;
  description?: string;

  //  Schedule
  startTime: string;
  endTime?: string;

  //  Visibility (Dependent upon sub-type)
  //  TODO:  Fix these typings for the dependent sub-types
  visibility?: "public" | "private";
  // peerVisibility?: 'private' | 'boathouse' | 'invite';
  // boathouseVisibility?: 'public' | 'invite';

  //  Content
  type: 'broadcast' | 'group' | 'video' | 'race' | 'boathouse-race';

  //  Termination
  distance?: number;  //  Total Distance in Meters

  //  Addons
  leaderboard: boolean;

  //  Boathouse Racing
  contestants?: string[];
  standings?: string;  //  BRStandings
}

export interface WorkoutInternal extends Workout, BaseObject {}
