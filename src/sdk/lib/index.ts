import "./error.ts";
import logger from "./logger.ts";
export { db, get_kv } from "./persistence.ts";

console.log("observabilty loaded into app");

export { logger };
