import { serveFile } from "https://deno.land/std/http/file_server.ts";
// https://postcss.org/api/
import postcss from "npm:postcss";
import autoprefixer from "npm:autoprefixer";
import tailwindcss from "npm:tailwindcss";
// https://lightningcss.dev/docs.html
import { transform } from "npm:lightningcss";

const asset_middlware = async (pathname, request) => {
  const isFileRequest = pathname.includes(".");
  // figure out the issue
  const isJsFIle = pathname.includes(".js");
  if (isFileRequest && !isJsFIle) {
    try {
      const type = pathname.split(".").pop();
      const content_type = `text/${type}`;
      const file_path = `${window.extPath}/src/public${pathname}`;

      // find out if there is a leak here
      // const file = await Deno.open(file_path, { read: true });
      // const content = await file.readable;
      if (type === "css") {
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
            "content-type": content_type,
            "access-control-allow-origin": "*",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
          },
        });
      } else {
        // return new Response(content,{
        //   headers:{
        //     "content-type": request.headers.get('accept').split(',')[0],
        //     "access-control-allow-origin": "*",
        //     "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        //   }
        // });

        return await serveFile(request, file_path);
      }
    } catch (err) {
      console.info(err.message);
    }
  }
};

export default asset_middlware;
