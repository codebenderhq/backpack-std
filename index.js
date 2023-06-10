import { serve } from "https://deno.land/std/http/server.ts";
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

const middleware = async (request, info) => {
  const { pathname } = new URL(request.url);
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

if (import.meta.main) {
  const port = 9090;
  serve(middleware, { port });
}

export default middleware;
