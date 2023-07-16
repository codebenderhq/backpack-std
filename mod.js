import "https://deno.land/std/dotenv/load.ts";
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


if (import.meta.main) {
  const [type] = Deno.args;

  if(type === "--web"){
    console.log("serve web version")
    Deno.serve(web);
  }

}