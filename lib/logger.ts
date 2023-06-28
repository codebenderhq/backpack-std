export default async (...body) => {
  const kv = await Deno.openKv();
  const id = Date.now();
  const key = ["Log", id];
  let value;

  if (typeof body[0] === "object") {
    value = {
      type: "info",
      ...body[0],
    };
  } else {
    value = {
      type: "info",
      ...body,
    };
  }

  // Persist an object at the users/alice key.
  await kv.set(key, value);
  console.log(id, ...body);
};
