import "./lib/error.ts";
import { db, get_kv } from "./lib/persistence.ts";
import deploy from "./middleware/deploy.js";
//import push from "./middleware/push.js";
import logger from "./lib/logger.ts";

/**
 * @class Oomph
 * @name Oomph
 * Oomph sdk
 */
export default {
  deploy,
  logger,
  db,
  get_kv,
};
