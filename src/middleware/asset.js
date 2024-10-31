import { serveFile } from "../lib/std/file_server.ts";
// https://postcss.org/api/
import postcss from "npm:postcss@latest";
import autoprefixer from "npm:autoprefixer@latest";
import tailwindcss from "npm:tailwindcss@latest";
// https://lightningcss.dev/docs.html
import { transform } from "npm:lightningcss@latest";

// https://esbuild.github.io/api/#bundle
import * as esbuild from "npm:esbuild";

const asset_middlware = async (request, type) => {
  const _cwd = window._cwd;
  const { pathname } = new URL(request.url);
  //  const isServiceWorker = pathname.includes("sw.js");
  try {
    const content_type = `text/${type}`;
    let file_path = `${_cwd}/src/public${pathname}`;

    if (type === "jsx") {
      const esbuild_result = await esbuild.build({
        entryPoints: [`${_cwd}/src/components/${pathname}`],
        bundle: true,
        jsxDev: Deno.env.get("env") === "production",
        target: ["esnext"],
        jsx: "automatic",
        loader: { ".js": "jsx" },
        minify: Deno.env.get("env") === "production",
        write: false,
        define: {
          "process.env.DEV": "true",
        },
        // outfile: `${_cwd}/src/public/script/${pathname}`,
        ignoreAnnotations: true,
      });

      const code = esbuild_result.outputFiles[0].text;
      return new Response(code, {
        headers: {
          "content-type": "text/javascript",
          "access-control-allow-origin": "*",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
        },
      });

      // console.log(esbuild_result.outputFiles[0].text,"result")

      // file_path = `${_cwd}/src/public/script/${pathname}`;
    }

    // temporary until push is solved

    // if( type === "googleMessaging"){
    //   const esbuild_result = await esbuild.build({
    //     entryPoints: [`${_cwd}/src/public/firebase-messaging-sw.js`],
    //     bundle: true,
    //     jsxDev: Deno.env.get("env") === "production",
    //     target: ["esnext"],
    //     // jsx: "automatic",
    //     // loader: { ".js": "jsx" },
    //     minify: Deno.env.get("env") === "production",
    //     write: false,
    //     // outfile: `${_cwd}/src/public/script/${pathname}`,
    //     ignoreAnnotations: true,
    //   });

    //   const code = esbuild_result.outputFiles[0].text;
    //   return new Response(code, {
    //     headers: {
    //       "content-type": "text/javascript",
    //       "access-control-allow-origin": "*",
    //       "Access-Control-Allow-Headers":
    //         "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    //     },
    //   });
    // }

    // find out if there is a leak here
    if (type === "style") {
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
    console.log(err);
    err.log();
    //    throw new Error("File Does Not Exist");
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

export default asset_middlware;
