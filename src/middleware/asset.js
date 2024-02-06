import { serveFile } from "https://deno.land/std/http/file_server.ts";
// https://postcss.org/api/
import postcss from "npm:postcss";
import autoprefixer from "npm:autoprefixer";
import tailwindcss from "npm:tailwindcss";
// https://lightningcss.dev/docs.html
//import { transform } from "npm:lightningcss";
import init, { transform } from "https://esm.run/lightningcss-wasm";

const asset_middlware = async (request, type) => {
  const _cwd = window._cwd;
  const { pathname } = new URL(request.url);
  //  const isServiceWorker = pathname.includes("sw.js");
  try {
    const content_type = `text/${type}`;
    const file_path = `${_cwd}/src/public${pathname}`;

    // find out if there is a leak here
    if (type === "style") {
      await init();
      //TODO: when a change is made here testing using the native object protoype for persistence shoudl be tried again

      // find out if there is a leak here
      const css = await Deno.readTextFile(file_path);

      const result = await postcss([tailwindcss, autoprefixer]).process(css, {
        from: undefined,
      });

      let { code, map } = transform({
        code: new TextEncoder().encode(result.css),
        minify: true,
      });

      return new Response(new TextDecoder().decode(code), {
        headers: {
          "content-type": "text/css",
          "access-control-allow-origin": "*",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
        },
      });
    } else {
      return await serveFile(request, file_path);
    }
  } catch (err) {
    err.log();
    //    throw new Error("File Does Not Exist");
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

export default asset_middlware;
