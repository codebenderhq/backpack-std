import logger from "./logger.js";

Error.prototype.log = async function (title) {
  //    console.log(this)
  logger.info("error", {
    cause: this.cause,
    msg: this.message,
    trace: this.stack,
    title,
  });
  return false;
};
