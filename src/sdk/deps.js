import { db, get_kv, logger } from "./lib/index.ts";
import deploy from "./middleware/deploy.js";

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
