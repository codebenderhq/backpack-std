// Copyright 2022-2023 codebenderhq. All rights reserved. MIT license.
import { oomph_db } from "./db.ts";

/** The oomph SDK. */
export declare namespace oomph {
  export interface database {}
  export interface web {}
  
  export interface logging {}
  
  /**
   * Returns a decontructured request
   *
   *
   * @category web
   * @return {object} req
   */
  export function req(): object;
  
  /**
   * Logs to the logger db
   *
   *
   * @category web
   * @return {void}
   */
  export function logger(): void;

  /**
   * Returns the implementation of oomph db
   *
   * ```js
   * // initalize db
   * const db = oomph.db('user')
   *
   * db.data = {
   * name: "Rawk Akani"
   * }
   * ```
   *
   * Requires `--unstable` permission.
   *
   * @param {string} name
   * @tags unstable
   * @category database
   * @return {oomph_db} oomph_db
   */
  export function db(name: string): oomph_db;
}
