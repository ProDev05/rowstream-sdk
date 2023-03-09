import { BaseObject } from './object-model';

//  TS Interfaces
export interface Team {
  players: string[]; //  UserIDs of players on the Team
  invites: string[]; //  Emails of Invited players... The email is sent, and when the player with that email goes to the "Team" page, there will be a Team Request on the page which they can Accept / Reject.
  // requests: string[]  //  Players requesting to join a team by searching teams on the Team page... Lets hold off on this for now.
  name?: string;
  avatar_url?: string;
  jerseyKey?: string;
}

export interface TeamInternal extends Team, BaseObject {}
