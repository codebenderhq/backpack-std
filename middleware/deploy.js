import { readerFromStreamReader } from "https://deno.land/std/streams/mod.ts";
const deploy = async(request) => {
    const {pathname,searchParams} = aki.req(request);
    
    if(pathname === '/deploy' && request.method === "POST"){
        console.time("saving file");
        const reader = request?.body?.getReader();
        const name = searchParams.get('name')
        console.timeEnd("saving file");
        
        const appPath =  `/deploy/${name}.tar.gz`
        //  to be able to test locally will move this to env variables when stable
        //  const appPath = `./deploy/${name}.tar.gz`
        const f = await Deno.open(appPath, {
            create: true,
            write: true,
        });
        await Deno.copy(readerFromStreamReader(reader), f);
        await f.close();

        const deployWorker = new Worker(
            new URL("../workers/deploy.js", import.meta.url).href,
            { type: "module" },
            );
        
        deployWorker.postMessage({ path: appPath });

        return new Response("deployed");
    }
}

export default deploy