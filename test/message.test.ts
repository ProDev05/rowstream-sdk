/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

import { assert, expect } from 'chai';
import { CreateUserParams, Profile, Session, TeamInternal } from '../src';
import { TokenParams } from '../src/models/token-model';
import { messageSDK, tokenSDK, teamSDK } from '../src/tools/rowstream-utils';

const consumerTokenParams: TokenParams = {
  username: "consumer",
  password: "testpass123"
};

const coach: CreateUserParams = {

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

const coachProfile: Profile = {
  name: 'Pete Rodgers',
  city: 'Avon',
  state: 'CT',
  avatar: 'https://dmcvsharks.com/wp-content/uploads/2018/09/Duarte-Andrde.jpg'
};


const tm1Profile: Profile = {
  name: 'Joe Kettering',
  city: 'Acton',
  state: 'MA',
  avatar: 'https://images.pexels.com/photos/555790/pexels-photo-555790.png?auto=compress&cs=tinysrgb&dpr=1&w=500'
};

const tm2Profile: Profile = {
  name: 'Joshua Valin',
  city: 'Canton',
  state: 'MA',
  avatar: 'https://therideshareguy.com/wp-content/uploads/2014/05/About-Page2.jpg'
};

const tm3Profile: Profile = {
  name: 'George Redford',
  city: 'Los Angeles',
  state: 'CA',
  avatar: 'https://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg'
};

const sessionParams: Session = {
  start: new Date().toISOString()
};

const tokenParams: TokenParams = {
  username: coach.username,
  password: coach.password
};


//  Test the SDKs
describe('Messages', () => {

  //  Magic Boathouse User
  let merlinToken: string;

  //  Irish Boathouse User
  let pippinToken: string;
  let liamToken: string;

  //  Magic Boathouse
  let magicBoathouse: TeamInternal;

  //  Irish Boathouse
  let irishBoathouse: TeamInternal;

  //  Create Messages
  const pippinsBoathouseMessage = `Hello Friends, the UTC time is '${ (new Date()).toUTCString() }''`;
  const pippinsPrivateMessage = `Hello Liam, the UTC time is '${ (new Date()).toUTCString() }''`;

  before(async () => {

    //  Get the Tokens
    merlinToken = (await tokenSDK.create({ username: 'merlin', password: 'rowstream2021' })).token;
    pippinToken = (await tokenSDK.create({ username: 'pippin', password: 'rowstream2021' })).token;
    liamToken = (await tokenSDK.create({ username: 'liam', password: 'rowstream2021' })).token;

    //  Get Boathouses
    //  TODO:  Instead of (or in additional to) using the same generic search functions for the SDKs, build context specific functionality.
    irishBoathouse = (await teamSDK.search({}, pippinToken)).results[0];
    console.log(JSON.stringify(await teamSDK.search({}, pippinToken)));
    magicBoathouse = (await teamSDK.search({}, merlinToken)).results[0];

  });


  //
  //  Pippins Boathouse Message (with Channels)
  //

  it('should create a message from Pippin to the "Irish Boathouse"', async () => {
    await messageSDK.create({ text: pippinsBoathouseMessage, recipient: irishBoathouse.id, recipientType: 'boathouse', channel: 'general' }, pippinToken);
  });

  it('should see Pippins Boathouse message when searching as Liam', async () => {
    const messages = await messageSDK.search({}, liamToken);
    console.log(messages.results.find(message => message.text === pippinsBoathouseMessage));
    assert(messages.results.find(message => message.text === pippinsBoathouseMessage) !== undefined);
  });


  it('should not see Pippins Boathouse message when searching as Liam when scoping by a different channel', async () => {
    const messages = await messageSDK.search({ search: { match: { channel: 'support' } } }, liamToken);
    assert(messages.results.find(message => message.text === pippinsBoathouseMessage) == undefined);
  });

  it('should not see Pippins Boathouse message when searching as Merlin', async () => {
    const messages = await messageSDK.search({}, merlinToken);
    assert(messages.results.find(message => message.text === pippinsBoathouseMessage) == undefined);
  });


  //
  //  Pippin's Private Message
  //

  it('should create a private message from Pippin to the Liam', async () => {
    await messageSDK.create({ text: pippinsPrivateMessage, recipient: "liam", recipientType: 'user' }, pippinToken);
  });

  it('should see Pippins private message when searching as Liam', async () => {
    const messages = await messageSDK.search({}, liamToken);
    assert(messages.results.find(message => message.text === pippinsPrivateMessage) != undefined);
  });

  it('should not see Pippins private message when searching as Merlin', async () => {
    const messages = await messageSDK.search({}, merlinToken);
    assert(messages.results.find(message => message.text === pippinsPrivateMessage) == undefined);
  });
});
