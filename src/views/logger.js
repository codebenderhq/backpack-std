const logView = async (request) => {
  const { pathname } = oomph.req(request);

  if (pathname === "/logs" && request.method === "GET") {
    const kv = await Deno.openKv();
    const log = await kv.list({ prefix: ["logs"] });

    //        for await (const entry of log) {
    //            kv.delete(entry.key)
    //        }
    const logs = [];

    for await (const res of log) logs.push(res);
    logs.sort().reverse();

    let logView = "";
    logs.forEach((log) => {
      try {
        logView += `${log.value.type} \n ${JSON.stringify(log.value.data)} \n`;
      } catch (e) {
        console.log(e, log.value.data);
      }
    });

    return new Response(logView);
  }
};

export default logView;
