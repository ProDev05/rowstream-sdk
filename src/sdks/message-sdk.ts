/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

import { Message, MessageInternal } from "..";
import { HTTPSDK } from "../abstract-sdks";

export class MessageSDK extends HTTPSDK<Message, Message, MessageInternal> {
  protected endpoint = "messages";
}
