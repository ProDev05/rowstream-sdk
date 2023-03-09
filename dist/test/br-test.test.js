"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rowstream_utils_1 = require("../src/tools/rowstream-utils");
const websocket_1 = require("../src/models/websocket");
const ws_1 = __importDefault(require("ws"));
//  Test the SDKs
describe("Boathouse Racing", () => {
    //  WebSocket
    let ws;
    //  Magic Boathouse User
    let merlinToken;
    let merlinUser;
    //  Irish Boathouse User
    let pippinToken;
    let pippinUser;
    //  Magic Boathouse
    let magicBoathouse;
    //  Irish Boathouse
    let irishBoathouse;
    const startTime = new Date().toISOString();
    let boathouseRace = undefined;
    before(() => __awaiter(this, void 0, void 0, function* () {
        //  Get the Tokens
        merlinToken = (yield rowstream_utils_1.tokenSDK.create({ username: "merlin", password: "rowstream2021" })).token;
        pippinToken = (yield rowstream_utils_1.tokenSDK.create({ username: "pippin", password: "rowstream2021" })).token;
        //  Get User
        pippinUser = yield rowstream_utils_1.userSDK.retrieve("pippin", pippinToken);
        merlinUser = yield rowstream_utils_1.userSDK.retrieve("merlin", merlinToken);
        //  Get Boathouses
        irishBoathouse = (yield rowstream_utils_1.teamSDK.search({}, pippinToken)).results.find(team => team.players.indexOf(pippinUser.username) != -1);
        console.log(JSON.stringify(yield rowstream_utils_1.teamSDK.search({}, pippinToken)));
        magicBoathouse = (yield rowstream_utils_1.teamSDK.search({}, merlinToken)).results.find(team => team.players.indexOf(merlinUser.username) != -1);
    }));
    //
    //  Create Boathouse Race
    //
    it("should create a boathouse Race with both Irish and Magic boathouses", () => __awaiter(this, void 0, void 0, function* () {
        const createdRace = yield rowstream_utils_1.workoutSDK.create({
            type: "boathouse-race",
            startTime: startTime,
            leaderboard: false,
            contestants: [irishBoathouse.id, magicBoathouse.id],
            distance: 1000,
            visibility: 'public'
        }, pippinToken);
        chai_1.assert(createdRace !== undefined);
    }));
    it("should find the new boathouse race", () => __awaiter(this, void 0, void 0, function* () {
        const brResults = yield rowstream_utils_1.workoutSDK.search({
            search: {
                match: {
                    type: "boathouse-race"
                }
            }
        }, pippinToken);
        boathouseRace = brResults.results.find(br => br.startTime === startTime);
        chai_1.assert(boathouseRace != undefined);
    }));
    const openWebsocket = () => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const ws = new ws_1.default(rowstream_utils_1.wsHost);
            ws.onopen = (ev => {
                resolve(ws);
            });
        });
    });
    const joinBoathouseRace = (ws, user, boathouseRaceId) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            //  BRJoin Message
            const brJoin = {
                type: websocket_1.BR_JOIN_MESSAGE,
                userId: user.username,
                workoutId: boathouseRaceId,
                user
            };
            //  Send the Join Message
            ws.send(JSON.stringify(brJoin));
            //  Wait for the Status Message
            ws.onmessage = (ev) => {
                const message = JSON.parse(ev.data);
                if (message.type === websocket_1.BOATHOUSE_RACE_STATUS_MESSAGE) {
                    resolve(message);
                }
            };
        });
    });
    const updateDistance = (ws, user, boathouseRaceId, distance) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const brDistance = {
                type: websocket_1.BOATHOUSE_RACE_DISTANCE_MESSAGE,
                userId: user.username,
                workoutId: boathouseRaceId,
                timestamp: new Date().toISOString(),
                distance,
                user
            };
            ws.send(JSON.stringify(brDistance));
            //  Wait for the Standings Message
            ws.onmessage = (ev) => {
                const message = JSON.parse(ev.data);
                if (message.type === websocket_1.BOATHOUSE_RACE_STANDINGS_MESSAGE) {
                    resolve(message);
                }
            };
        });
    });
    const endRace = (ws, user, boathouseRaceId) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const brDistance = {
                type: websocket_1.BOATHOUSE_RACE_DISTANCE_MESSAGE,
                userId: user.username,
                workoutId: boathouseRaceId,
                timestamp: new Date().toISOString(),
                distance: 1000000,
                user
            };
            ws.send(JSON.stringify(brDistance));
            //  Wait for the End Message
            ws.onmessage = (ev) => {
                const message = JSON.parse(ev.data);
                if (message.type === websocket_1.BOATHOUSE_RACE_END_MESSAGE) {
                    resolve(message);
                }
            };
        });
    });
    it("should open websocket", () => __awaiter(this, void 0, void 0, function* () {
        ws = yield openWebsocket();
        chai_1.assert(ws !== undefined);
    }));
    it("should add pippin to the boathouse race", () => __awaiter(this, void 0, void 0, function* () {
        const statusMessage = yield joinBoathouseRace(ws, pippinUser, boathouseRace.id);
        chai_1.assert(statusMessage.standings[irishBoathouse.id].users[pippinUser.username] !== undefined);
    }));
    it("should add merlin to the boathouse race", () => __awaiter(this, void 0, void 0, function* () {
        const statusMessage = yield joinBoathouseRace(ws, merlinUser, boathouseRace.id);
        chai_1.assert(statusMessage.standings[magicBoathouse.id].users[merlinUser.username] !== undefined);
    }));
    it("should update pippins distance", () => __awaiter(this, void 0, void 0, function* () {
        const standingsMessage = yield updateDistance(ws, pippinUser, boathouseRace.id, 100);
        chai_1.assert(standingsMessage.standings[irishBoathouse.id].users[pippinUser.username] !== undefined);
    }));
    it("should update merlins distance", () => __awaiter(this, void 0, void 0, function* () {
        const standingsMessage = yield updateDistance(ws, merlinUser, boathouseRace.id, 250);
        chai_1.assert(standingsMessage.standings[magicBoathouse.id].users[merlinUser.username] !== undefined);
    }));
    it("should let pippins team win the race", () => __awaiter(this, void 0, void 0, function* () {
        const endMessage = yield endRace(ws, pippinUser, boathouseRace.id);
        chai_1.assert(endMessage !== undefined);
    }));
    it("should see the updated workout", () => __awaiter(this, void 0, void 0, function* () {
        const originalStandings = boathouseRace.standings;
        const workout = yield rowstream_utils_1.workoutSDK.retrieve(boathouseRace.id, pippinToken);
        const updatedStandings = workout.standings;
        chai_1.assert(originalStandings === undefined, 'Original Standings should be undefined.');
        chai_1.assert(updatedStandings !== undefined, 'Updated Standings should be defined.');
        console.log(JSON.parse(updatedStandings));
    }));
});
//# sourceMappingURL=br-test.test.js.map