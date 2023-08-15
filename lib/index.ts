import { DB, get_kv } from "./persistence.ts";
import "./error.ts";
import logger from "./logger.ts";

console.log("observabilty loaded into app");

export { DB, get_kv, logger };
