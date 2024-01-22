import { serveFile } from "https://deno.land/std/http/file_server.ts";
// https://postcss.org/api/
import postcss from "npm:postcss";
import autoprefixer from "npm:autoprefixer";
import tailwindcss from "npm:tailwindcss";
// https://lightningcss.dev/docs.html
import { transform } from "npm:lightningcss";
//import init, { transform } from 'https://esm.run/lightningcss-wasm';

const asset_middlware = async (request, type) => {
  const {pathname} = new URL(request.url)
//  const isFileRequest = pathname.includes(".");
//  const isServiceWorker = pathname.includes("sw.js");
  try {
    const content_type = `text/${type}`;
    const file_path = `${window._app}/src/public${pathname}`;

    // find out if there is a leak here
    // const file = await Deno.open(file_path, { read: true });
    // const content = await file.readable;
    if (type === "style") {
      //TODO: when a change is made here testing using the native object protoype for persistence shoudl be tried again

      // find out if there is a leak here
      const css = await Deno.readTextFile(file_path);

      console.log(file_path,content_type)
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
    console.log(err)
    err.log();
    throw new Error("File Does Not Exist");
  }
};

export default asset_middlware;
