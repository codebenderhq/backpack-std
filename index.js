import { serve } from "https://deno.land/std/http/server.ts";
import "https://deno.land/std/dotenv/load.ts";
import * as extensions from "./middleware/index.js";

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

const middleware = async (request,cwd, info) => {
  const { pathname } = new URL(request.url);
  window._cwd = cwd
  window.extPath =  window?._cwd  ?  window._cwd  : Deno.cwd();

  try {
    // const extensions = Deno.env.get("env")
    //   ? await import(`${window.extPath}/extensions.js`)
    //   : await import(`${window.extPath}/ext.js`);

    await service(Object.values(extensions), pathname, request);
    return resp;
  } catch (err) {
    console.log(Deno.cwd());
    console.log(err);

    // window.dispactLog
    //  ? window.dispatchLog({ msg: err.message, err })
    //  : console.log(err);
    return Response.json({ msg: "Error:LEVEL1", err: err }, { status: 500 });
  }
};

if (import.meta.main) {
  const port = 9090;
  serve(middleware, { port });
}

export default middleware;
