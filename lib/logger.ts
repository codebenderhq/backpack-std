export default async (...body) => {
  try {
    const kv = await Deno.openKv();
    const id = Date.now();
    const key = ["Log", id];
    let value;

    if (typeof body[0] === "object") {
      value = {
        type: "info",
        data: {...body[0]},
      };
    } else {
      value = {
        type: "info",
        ...body,
      };
    }

    
    // Persist an object at the users/alice key.
    await kv.set(key, value);
  } catch (err) {
    console.error(err.message);
  }
};
