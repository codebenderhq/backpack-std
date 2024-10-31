import { get_kv } from "./persistence.js";

const logger = async (type, ...body) => {
  try {
    const expireIn = 24 * 60 * 60 * 1000;
    const kv = await get_kv();
    const id = Date.now();
    const key = ["Log", id];
    let value;

 
    if (typeof body[0] === "object") {
      value = {
        type: type ? type : "info",
        data: { ...body[0] },
      };
    } else {
      value = {
        type: type ? type : "info",
        ...body,
      };
    }

    // Persist an object at the users/alice key.
    await kv.set(key, value, { expireIn });
  } catch (err) {
    console.error(err.message);
  }
};

const file_logger = async (msg) => {
  const kv = await Deno.openKv(`${import.meta.dirname}/observability/logs`);

  const logs = await kv.get(["logs"]);

  const log = {
    ...logs.value,
    [Date.now()]: msg,
  };

  const result = await kv.set(["logs"], log);
};

const readLogs = async () => {
  const kv = await Deno.openKv(`${import.meta.dirname}/observability/logs`);
  //
  //  const result = await kv.get(["logs"]);
  const stream = kv.watch([["logs"]]).getReader();

  while (true) {
    const value = await stream.read();

    if (value.done) {
      break;
    }
    console.log(value);
  }
  //  for await (const entries of stream) {
  //    console.log(entries[0].value); // "bar"
  //    console.log('why you not updating')
  //  }
};

export default {
  info: logger,
  file_logger: file_logger,
  readLogs: readLogs,
};
