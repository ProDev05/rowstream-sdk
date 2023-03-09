/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

import { HTTPSDK } from '../abstract-sdks';
import { UploadFile } from '../models';

export class UploadSDK extends HTTPSDK<UploadFile, UploadFile, UploadFile> {
  protected endpoint = 'upload';
}
