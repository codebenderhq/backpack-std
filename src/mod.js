import { serve, serveTls } from "https://deno.land/std@0.198.0/http/server.ts";
import "https://deno.land/std/dotenv/load.ts";
import deploy from "./middleware/deploy.js";
import * as extensions from "./middleware/index.js";
import "./lib/index.ts";
import logView from "./views/logger.js";
import { db, get_kv, logger } from "./lib/index.ts";

let resp;

const service = async (ext, pathname, req) => {
  resp = null;
  if (pathname === "/logs" && req.method === "GET") {
    resp = logView(req);
  }

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

const webLogs = async (req, res, info) => {
  const request = await req;
  const response = await res;

  const referer = request.headers.get("referer");

  logger.info("request/response", {
    info: info,
    request: { method: request.method, uri: request.url, referer },
    response: { status: response.status },
  });
};
/**
 * Web Framework, this makes all requests go through FRAME
 * @param {Request} request
 * @return {Response} response
 */
export const web = async (request, info) => {
  const { pathname, version } = req(request);

  window.extPath = window?._cwd
    ? (version ? `${window._cwd}/${version}` : window._cwd)
    : Deno.cwd();

  try {
    await service(Object.values(extensions), pathname, request);
    resp = resp ? resp : new Response("Not Found", { status: "404" });
    webLogs(request, resp, info);
    return resp;
  } catch (err) {
    err.log();
    return Response.json({ msg: "Error:LEVEL1", err: err.message }, {
      status: 500,
    });
  }
};

/**
* Deconstruct the request object into valuble information
*
* @param {Request} request

* @return {pathname: string}
*/
export const req = (request) => {
  let { pathname, hostname, username, search, searchParams } = new URL(
    request.url,
  );

  //  determine version requested from path
  const versionParser = /\d{1,2}\.\d{1,3}\.\d{1,3}/g;

  const version = pathname.match(versionParser)
    ? pathname.match(versionParser)[0]
    : undefined;
  pathname = pathname.replace(versionParser, "").replaceAll("//", "/");

  return { pathname, version, hostname, username, search, searchParams };
};

globalThis.oomph = {
  req,
  deploy,
  web,
  logger,
  db,
  get_kv,
};

const initHost = (request) => {
  globalThis.oomph.user_request = req(request);
};

const launch = async (entry_point) => {
  console.log("loading", entry_point);
  const exec = (await import(`app/${entry_point}`)).default;

  const options = {
    port: 8001,
  };

  //  Prod Enviroment Configuration
  if (Deno.env.get("env") !== "dev") {
    const decoder = new TextDecoder("utf-8");

    options.port = 443;
    options.cert = decoder.decode(await Deno.readFile(Deno.env.get("CERT")));
    options.key = decoder.decode(await Deno.readFile(Deno.env.get("KEY")));

    //ACME service
    serve((req) => {
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

  serveTls((request, info) => {
    try {
      initHost(request);
      return exec(request, info);
    } catch (err) {
      err.log();
      return new Response("Not Found", { status: 404 });
    }
  }, options);
};

if (import.meta.main) {
  const [src] = Deno.args;

  if (src === "--web") {
    try {
      await serve(web);
    } catch {
      serve(web, { port: 9002 });
    }
  } else {
    launch(src);
  }
  console.log("oomph launched");
}
