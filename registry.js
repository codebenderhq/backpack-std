import { serveFile } from "https://deno.land/std/http/file_server.ts";

Deno.serve({ port: 8002 }, (req) => {
  const { pathname } = new URL(req.url);

  console.log(`./${pathname}`);
  return serveFile(req, `./${pathname}`);
});
