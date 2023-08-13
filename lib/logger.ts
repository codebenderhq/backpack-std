const logger = async (type, ...body) => {
  try {
    const kv = await Deno.openKv();
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
    await kv.set(key, value);
  } catch (err) {
    console.error(err.message);
  }
};

export default {
  info: logger,
  request: () => {
  },
};
