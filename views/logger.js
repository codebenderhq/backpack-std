const logView = async (request) => {
    const { pathname } = aki.req(request);
    
    if (pathname === "/logs" && request.method === "GET") {
   
        const kv = await Deno.openKv();
        const log = await kv.list({ prefix: ["Log"] });
        
//        for await (const entry of log) {
//            kv.delete(entry.key)
//        }
        const logs = []
         
        for await (const res of log) logs.push(res);
        logs.sort().reverse();
        return Response.json(logs)
    }
}

export default logView;