import { db, get_kv } from "./persistence.ts";
import "./error.ts";
import logger from "./logger.ts";

console.log("observabilty loaded into app");

export { db, get_kv, logger };
