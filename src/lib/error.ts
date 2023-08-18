import logger from "./logger.ts";

Error.prototype.log = async function () {
  //    console.log(this)
  logger.info("error", {
    cause: this.cause,
    msg: this.message,
    trace: this.stack,
    type: "error",
  });
  return false;
};
