import {
  api_middleware,
  asset_middlware,
  html_middleware,
  script_middleware,
} from "../middleware/index.js";

import {req} from "./services.js"
import oomph from "./deps.js";
export const serve = async (isProd, appName) => {
  console.log(isProd ? "Production Server Running" : "Dev Server Running");

  if(isProd){

    //  acme service
    Deno.serve((req) => {
      const { pathname } = new URL(req.url);

      const host = req.headers.get("host");

      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://${host.replace("www.", "")}${pathname}`,
        },
      });
      }, { port: 80 });

    //  acme service
    Deno.serve((req) => {
      const { pathname } = new URL(req.url);

      const host = req.headers.get("host");

      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://${host.replace("www.", "")}${pathname}`,
        },
      });
      }, { port: 80 });
  }

  globalThis.oomph = oomph;
  oomph.req = req;

  Deno.serve(async (req) => {
    const type = req.headers.get("sec-fetch-dest");
    const cors = req.headers.get("sec-fetch-site");
    const content_type = req.headers.get("content-type");
    const agent = req.headers.get("user-agent");
    //        set app path
    const app_path = !isProd ? "/src/_app" : getAppName(req);
    window._app = !isProd ? Deno.cwd() : "/apps";
    //        enable deployment
    //   await oomph.deploy(req);

    window._cwd = `${window._app}${app_path}`;

    switch (type || content_type) {
      case "document":
        return html_middleware(req, isProd);
      case "script":
        return script_middleware(req);
      case "style":
      case "image":
        return asset_middlware(req, type);
      case "application/x-www-form-urlencoded":
      case "application/json":
        return api_middleware(req);
    }

    return new Response("Internal Server Error", {
      status: 500,
    });
  });
};



async function main(inputArgs){
  console.log(inputArgs)
  serve()
}


main(Deno.args);

