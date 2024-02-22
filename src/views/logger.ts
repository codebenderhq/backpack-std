const logView = async (request:Request) :Promise<Response | undefined> => {
  const { pathname } = oomph.req(request);

  if (pathname === "/logs" && request.method === "GET") {
    const kv: Deno.Kv = await Deno.openKv();
    const log: Deno.KvListIterator<any> = await kv.list({ prefix: ["Log"] });

    //        for await (const entry of log) {
    //            kv.delete(entry.key)
    //        }
    const logs: Array<Deno.KvEntry<any>> = [];

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
