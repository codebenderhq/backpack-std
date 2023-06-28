import logger from "./logger.ts";

Error.prototype.log = async function () {
  //    console.log(this)
  logger(
    {
      cause: this.cause,
      msg: this.message,
      trace: this.stack,
      type: "error",
    },
  );
  return false;
};
