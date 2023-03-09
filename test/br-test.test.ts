/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

import { assert, expect } from "chai";
import { TeamInternal, WorkoutInternal, APIUser } from "../src";
import {
  messageSDK,
  teamSDK,
  tokenSDK,
  workoutSDK,
  wsHost,
  userSDK,
} from "../src/tools/rowstream-utils";
import { BRJoinMessage, BR_JOIN_MESSAGE, WSMessage, BOATHOUSE_RACE_STATUS_MESSAGE, JoinBoathouseRaceStatusMessage, BoathouseRaceDistanceMessage, BOATHOUSE_RACE_DISTANCE_MESSAGE, BoathouseRaceStandingsMessage, BOATHOUSE_RACE_STANDINGS_MESSAGE, BOATHOUSE_RACE_END_MESSAGE, BoathouseRaceEndMessage } from "../src/models/websocket";
import WebSocket from "ws";

//  Test the SDKs
describe("Boathouse Racing", () => {

  //  WebSocket
  let ws: WebSocket;

  //  Magic Boathouse User
  let merlinToken: string;
  let merlinUser: APIUser;

  //  Irish Boathouse User
  let pippinToken: string;
  let pippinUser: APIUser;

  //  Magic Boathouse
  let magicBoathouse: TeamInternal;

  //  Irish Boathouse
  let irishBoathouse: TeamInternal;

  const startTime = new Date().toISOString();
  let boathouseRace: WorkoutInternal = undefined;

  before(async () => {
    //  Get the Tokens
    merlinToken = (
      await tokenSDK.create({ username: "merlin", password: "rowstream2021" })
    ).token;
    pippinToken = (
      await tokenSDK.create({ username: "pippin", password: "rowstream2021" })
    ).token;

    //  Get User
    pippinUser = await userSDK.retrieve("pippin", pippinToken);
    merlinUser = await userSDK.retrieve("merlin", merlinToken);

    //  Get Boathouses
    irishBoathouse = (await teamSDK.search({}, pippinToken)).results.find(team => team.players.indexOf(pippinUser.username) != -1);
    console.log(JSON.stringify(await teamSDK.search({}, pippinToken)));
    magicBoathouse = (await teamSDK.search({}, merlinToken)).results.find(team => team.players.indexOf(merlinUser.username) != -1);
  });

  //
  //  Create Boathouse Race
  //

  it("should create a boathouse Race with both Irish and Magic boathouses", async () => {
    const createdRace = await workoutSDK.create(
      {
        type: "boathouse-race",
        startTime: startTime,
        leaderboard: false,
        contestants: [irishBoathouse.id, magicBoathouse.id],
        distance: 1000,
        visibility: 'public'
      },
      pippinToken
    );
      assert(createdRace !== undefined);
  });

  it("should find the new boathouse race", async () => {
    const brResults = await workoutSDK.search(
      {
        search: {
          match: {
            type: "boathouse-race"
          }
        }
      },
      pippinToken
    );
    boathouseRace = brResults.results.find(br => br.startTime === startTime);
    assert(boathouseRace != undefined);
  });

  const openWebsocket = async (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsHost);
      ws.onopen = (ev => {
        resolve(ws);
      });
    });
  };

  const joinBoathouseRace = async (ws: WebSocket, user: APIUser, boathouseRaceId: string): Promise<JoinBoathouseRaceStatusMessage> => {
    return new Promise((resolve, reject) => {

      //  BRJoin Message
      const brJoin: BRJoinMessage = {
        type: BR_JOIN_MESSAGE,
        userId: user.username,
        workoutId: boathouseRaceId,
        user
      };

      //  Send the Join Message
      ws.send(JSON.stringify(brJoin));

      //  Wait for the Status Message
      ws.onmessage = (ev) => {
        const message: WSMessage = JSON.parse(ev.data as any);
        if (message.type === BOATHOUSE_RACE_STATUS_MESSAGE) {
          resolve(message as JoinBoathouseRaceStatusMessage);
        }
      };
    });
  };

  const updateDistance = async (ws: WebSocket, user: APIUser, boathouseRaceId: string, distance: number): Promise<BoathouseRaceStandingsMessage> => {
    return new Promise((resolve, reject) => {

      const brDistance: BoathouseRaceDistanceMessage = {
        type: BOATHOUSE_RACE_DISTANCE_MESSAGE,
        userId: user.username,
        workoutId: boathouseRaceId,
        timestamp: new Date().toISOString(),
        distance,
        user
      };

      ws.send(JSON.stringify(brDistance));

      //  Wait for the Standings Message
      ws.onmessage = (ev) => {
        const message: WSMessage = JSON.parse(ev.data as any);
        if (message.type === BOATHOUSE_RACE_STANDINGS_MESSAGE) {
          resolve(message as BoathouseRaceStandingsMessage);
        }
      };
    });
  };

  const endRace = async (ws: WebSocket, user: APIUser, boathouseRaceId: string): Promise<BoathouseRaceEndMessage> => {
    return new Promise((resolve, reject) => {

      const brDistance: BoathouseRaceDistanceMessage = {
        type: BOATHOUSE_RACE_DISTANCE_MESSAGE,
        userId: user.username,
        workoutId: boathouseRaceId,
        timestamp: new Date().toISOString(),
        distance: 1000000,  //  Set a massive distance to end the race.
        user
      };

      ws.send(JSON.stringify(brDistance));

      //  Wait for the End Message
      ws.onmessage = (ev) => {
        const message: WSMessage = JSON.parse(ev.data as any);
        if (message.type === BOATHOUSE_RACE_END_MESSAGE) {
          resolve(message as BoathouseRaceEndMessage);
        }
      };
    });
  };

  it("should open websocket", async () => {
    ws = await openWebsocket();
    assert(ws !== undefined);
  });

  it("should add pippin to the boathouse race", async () => {
    const statusMessage = await joinBoathouseRace(ws, pippinUser, boathouseRace.id);
    assert(statusMessage.standings[irishBoathouse.id].users[pippinUser.username] !== undefined);
  });

  it("should add merlin to the boathouse race", async () => {
    const statusMessage = await joinBoathouseRace(ws, merlinUser, boathouseRace.id);
    assert(statusMessage.standings[magicBoathouse.id].users[merlinUser.username] !== undefined);
  });

  it("should update pippins distance", async () => {
    const standingsMessage = await updateDistance(ws, pippinUser, boathouseRace.id, 100);
    assert(standingsMessage.standings[irishBoathouse.id].users[pippinUser.username] !== undefined);
  });

  it("should update merlins distance", async () => {
    const standingsMessage = await updateDistance(ws, merlinUser, boathouseRace.id, 250);
    assert(standingsMessage.standings[magicBoathouse.id].users[merlinUser.username] !== undefined);
  });

  it("should let pippins team win the race", async () => {
    const endMessage = await endRace(ws, pippinUser, boathouseRace.id);
    assert(endMessage !== undefined);
  });

  it("should see the updated workout", async () => {
    const originalStandings = boathouseRace.standings;
    const workout = await workoutSDK.retrieve(boathouseRace.id, pippinToken);
    const updatedStandings = workout.standings;
    assert(originalStandings === undefined, 'Original Standings should be undefined.');
    assert(updatedStandings !== undefined, 'Updated Standings should be defined.');
    console.log(JSON.parse(updatedStandings));
  });
});
