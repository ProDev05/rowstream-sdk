import { BaseObject } from "./object-model";
import { APIUser } from "./user-model";
import { Profile } from "./profile-model";
import { TeamInternal } from "./team";
export interface UserInfo {
    profile: Profile;
    user: APIUser;
    distance: number;
}
export interface BRStandings {
    [boathouseId: string]: {
        distance: number;
        users: {
            [username: string]: UserInfo;
        };
        boathouse: TeamInternal;
        color: string;
        elapsedTime: number;
    };
}
export interface Workout {
    name?: string;
    description?: string;
    startTime: string;
    endTime?: string;
    visibility?: "public" | "private";
    type: 'broadcast' | 'group' | 'video' | 'race' | 'boathouse-race';
    distance?: number;
    leaderboard: boolean;
    contestants?: string[];
    standings?: string;
}
export interface WorkoutInternal extends Workout, BaseObject {
}
