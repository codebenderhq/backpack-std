export { create, insert, remove, search } from "npm:@orama/orama";
export { persist, restore } from "npm:@orama/plugin-data-persistence";

import "./error.js";
import { db, get_kv } from "./persistence.js";
import deploy from "../middleware/deploy.js";
//import push from "./middleware/push.js";
import logger from "./logger.js";

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
