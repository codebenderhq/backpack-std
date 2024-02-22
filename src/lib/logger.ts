const logger = async (type, ...body) : Promise<void>=> {
  try {
    const kv: Deno.Kv = await Deno.openKv();
    const id:number = Date.now();
    const key: (string | number)[] = ["Log", id];
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
    await kv.set(key, value);
  } catch (err) {
    console.error(err.message);
  }
};

const file_logger = async (msg:string) => {
  const kv:Deno.Kv = await Deno.openKv(`${import.meta.dirname}/observability/logs`);

  const logs:Deno.KvEntryMaybe<unknown> = await kv.get(["logs"]);

  const log = {
    ...logs.value,
    [Date.now()]: msg,
  };

  const result:Deno.KvCommitResult = await kv.set(["logs"], log);
};

const readLogs = async () => {
  const kv:Deno.Kv = await Deno.openKv(`${import.meta.dirname}/observability/logs`);
  //
  //  const result = await kv.get(["logs"]);
  const stream: ReadableStreamDefaultReader<[Deno.KvEntryMaybe<unknown>]> = kv.watch([["logs"]]).getReader();

  while (true) {
    const value: ReadableStreamDefaultReadResult<[Deno.KvEntryMaybe<unknown>]> = await stream.read();

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
