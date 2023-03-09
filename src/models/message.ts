import { BaseObject } from "./object-model";

export interface Message {
  text: string;
  recipient: string;
  recipientType: 'user' | 'boathouse';
  channel?: string;
}

export interface MessageInternal extends Message, BaseObject {}
