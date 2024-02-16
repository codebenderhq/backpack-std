export { create, insert, remove, search } from "jsr:@orama/orama@2";
export { persist, restore } from "npm:@orama/plugin-data-persistence@latest";

import "./error.ts";
import { db, get_kv } from "./persistence.ts";
//import push from "./middleware/push.js";
import logger from "./logger.ts";

/**
 * @class Oomph
 * @name Oomph
 * Oomph sdk
 */
export default {
  logger,
  db,
  get_kv,
};
