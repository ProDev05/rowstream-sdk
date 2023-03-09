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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rowstream_utils_1 = require("../src/tools/rowstream-utils");
const consumerTokenParams = {
    username: "consumer",
    password: "testpass123"
};
const coach = {
    username: 'coach',
    email: 'coach@rowstream.com',
    password: 'testpass123',
};
const tm1TokenParams = {
    username: 'team_member_1',
    password: 'testpass123'
};
const tm2TokenParams = {
    username: 'team_member_2',
    password: 'testpass123'
};
const tm3TokenParams = {
    username: 'team_member_3',
    password: 'testpass123'
};
const coachProfile = {
    name: 'Pete Rodgers',
    city: 'Avon',
    state: 'CT',
    avatar: 'https://dmcvsharks.com/wp-content/uploads/2018/09/Duarte-Andrde.jpg'
};
const tm1Profile = {
    name: 'Joe Kettering',
    city: 'Acton',
    state: 'MA',
    avatar: 'https://images.pexels.com/photos/555790/pexels-photo-555790.png?auto=compress&cs=tinysrgb&dpr=1&w=500'
};
const tm2Profile = {
    name: 'Joshua Valin',
    city: 'Canton',
    state: 'MA',
    avatar: 'https://therideshareguy.com/wp-content/uploads/2014/05/About-Page2.jpg'
};
const tm3Profile = {
    name: 'George Redford',
    city: 'Los Angeles',
    state: 'CA',
    avatar: 'https://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg'
};
const sessionParams = {
    start: new Date().toISOString()
};
const tokenParams = {
    username: coach.username,
    password: coach.password
};
//  Test the SDKs
describe('Messages', () => {
    //  Magic Boathouse User
    let merlinToken;
    //  Irish Boathouse User
    let pippinToken;
    let liamToken;
    //  Magic Boathouse
    let magicBoathouse;
    //  Irish Boathouse
    let irishBoathouse;
    //  Create Messages
    const pippinsBoathouseMessage = `Hello Friends, the UTC time is '${(new Date()).toUTCString()}''`;
    const pippinsPrivateMessage = `Hello Liam, the UTC time is '${(new Date()).toUTCString()}''`;
    before(() => __awaiter(this, void 0, void 0, function* () {
        //  Get the Tokens
        merlinToken = (yield rowstream_utils_1.tokenSDK.create({ username: 'merlin', password: 'rowstream2021' })).token;
        pippinToken = (yield rowstream_utils_1.tokenSDK.create({ username: 'pippin', password: 'rowstream2021' })).token;
        liamToken = (yield rowstream_utils_1.tokenSDK.create({ username: 'liam', password: 'rowstream2021' })).token;
        //  Get Boathouses
        //  TODO:  Instead of (or in additional to) using the same generic search functions for the SDKs, build context specific functionality.
        irishBoathouse = (yield rowstream_utils_1.teamSDK.search({}, pippinToken)).results[0];
        console.log(JSON.stringify(yield rowstream_utils_1.teamSDK.search({}, pippinToken)));
        magicBoathouse = (yield rowstream_utils_1.teamSDK.search({}, merlinToken)).results[0];
    }));
    //
    //  Pippins Boathouse Message (with Channels)
    //
    it('should create a message from Pippin to the "Irish Boathouse"', () => __awaiter(this, void 0, void 0, function* () {
        yield rowstream_utils_1.messageSDK.create({ text: pippinsBoathouseMessage, recipient: irishBoathouse.id, recipientType: 'boathouse', channel: 'general' }, pippinToken);
    }));
    it('should see Pippins Boathouse message when searching as Liam', () => __awaiter(this, void 0, void 0, function* () {
        const messages = yield rowstream_utils_1.messageSDK.search({}, liamToken);
        console.log(messages.results.find(message => message.text === pippinsBoathouseMessage));
        chai_1.assert(messages.results.find(message => message.text === pippinsBoathouseMessage) !== undefined);
    }));
    it('should not see Pippins Boathouse message when searching as Liam when scoping by a different channel', () => __awaiter(this, void 0, void 0, function* () {
        const messages = yield rowstream_utils_1.messageSDK.search({ search: { match: { channel: 'support' } } }, liamToken);
        chai_1.assert(messages.results.find(message => message.text === pippinsBoathouseMessage) == undefined);
    }));
    it('should not see Pippins Boathouse message when searching as Merlin', () => __awaiter(this, void 0, void 0, function* () {
        const messages = yield rowstream_utils_1.messageSDK.search({}, merlinToken);
        chai_1.assert(messages.results.find(message => message.text === pippinsBoathouseMessage) == undefined);
    }));
    //
    //  Pippin's Private Message
    //
    it('should create a private message from Pippin to the Liam', () => __awaiter(this, void 0, void 0, function* () {
        yield rowstream_utils_1.messageSDK.create({ text: pippinsPrivateMessage, recipient: "liam", recipientType: 'user' }, pippinToken);
    }));
    it('should see Pippins private message when searching as Liam', () => __awaiter(this, void 0, void 0, function* () {
        const messages = yield rowstream_utils_1.messageSDK.search({}, liamToken);
        chai_1.assert(messages.results.find(message => message.text === pippinsPrivateMessage) != undefined);
    }));
    it('should not see Pippins private message when searching as Merlin', () => __awaiter(this, void 0, void 0, function* () {
        const messages = yield rowstream_utils_1.messageSDK.search({}, merlinToken);
        chai_1.assert(messages.results.find(message => message.text === pippinsPrivateMessage) == undefined);
    }));
});
//# sourceMappingURL=message.test.js.map