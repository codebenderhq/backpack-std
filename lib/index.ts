import "./persistence.ts";
import "./error.ts";
import logger from "./logger.ts";

console.log("observabilty loaded into app");

globalThis.logger = logger;
