import "https://deno.land/std/dotenv/load.ts";
import deploy from "./middleware/deploy.js";
import * as extensions from "./middleware/index.js";
import "./lib/index.ts";

let resp;

const service = async (ext, pathname, req) => {
  resp = null;
  if (!resp) {
    for (const element of ext) {
      const _resp = await element(pathname, req);
      if (_resp) {
        resp = _resp;
        break;
      }
    }
  }
};

/**
* Web Framework, this makes all requests go through FRAME
* @param {Request} request
* @return {Response} response
*/
export const web = async (request, info) => {
  const { pathname } = req(request);
  window.extPath = window?._cwd ? window._cwd : Deno.cwd();

  try {
    globalThis.logger(request);
    await service(Object.values(extensions), pathname, request);
    globalThis.logger(resp);
    return resp;
  } catch (err) {
    err.log();
    return Response.json({ msg: "Error:LEVEL1", err: err }, { status: 500 });
  }
};

/**
* Deconstruct the request object into valuble information
*
* @param {Request} request

* @return {pathname: string} 
*/
export const req = (request) => {
  const { pathname, hostname, username, search, searchParams } = new URL(request.url);
  
  return {pathname, hostname,username, search, searchParams}
}

globalThis.aki = {
  req,
  deploy,
  web
}


const launch =  async (entry_point) => {
  console.log('loading',entry_point);
  const exec = (await import(entry_point)).default;

//  Prod Enviroment Load
  if(Deno.env.get("env") !== "dev"){
    const decoder = new TextDecoder("utf-8");

    const port = Deno.env.get("env") === "dev" ? 9091 : 443;
    const cert = decoder.decode(await Deno.readFile(Deno.env.get("CERT")));
    const key =  decoder.decode(await Deno.readFile(Deno.env.get("KEY")));

    const options = {
      port,
      key,
      cert,
    };

    Deno.serve(options, exec);

    //ACME service
    Deno.serve({port:Deno.env.get("env") === "dev" ? 9003 : 80},(req) => {
      const { pathname } = new URL(req.url);

      console.log(req);
      const host = req.headers.get("host");

      if (pathname.includes(".well-known")) {
        return serveFile(req, `/apps${pathname}`);
      } else {
        return new Response(null, {
          status: 301,
          headers: {
            Location: `https://${host.replace("www.", "")}${pathname}`,
          },
        });
      }
    })
  }

  Deno.serve(exec)
}

if (import.meta.main) {

  const [src] = Deno.args;
  const entry_point = new URL(`${Deno.cwd()}/${src}`, import.meta.url).toString()

  launch(entry_point)
}