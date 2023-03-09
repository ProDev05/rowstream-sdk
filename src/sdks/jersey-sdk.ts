/**
 * Copyright (C) William R. Sullivan.
 * This source is licensed under the MIT license.
 */

import { HTTPSDK } from "../abstract-sdks";
import { JerseyInternal, CreateJerseyPayload } from "../models";

export class JerseySDK extends HTTPSDK<
  CreateJerseyPayload,
  CreateJerseyPayload,
  JerseyInternal
> {
  protected endpoint = "jersey";

  public async config<T>(token?: string): Promise<T> {
    try {
      const res = await fetch(`${this.host}/${this.endpoint}/config`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (res.status !== 201 && res.status !== 200) {
        throw new Error(
          `Failed to create payload at endpoint '/${this.endpoint}'`
        );
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getJerseys<T>(id: string, token?: string): Promise<T> {
    try {
      const res = await fetch(`${this.host}/${this.endpoint}/boathouse?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      if (res.status !== 201 && res.status !== 200) {
        throw new Error(
          `Failed to create payload at endpoint '/${this.endpoint}'`
        );
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
