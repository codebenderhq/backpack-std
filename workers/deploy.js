import { tgz } from "https://deno.land/x/compress@v0.4.4/mod.ts";

self.onmessage = async (evt) => {
    console.log(evt.data);
    const path = evt.data.path;
    await tgz.uncompress(path, "/apps");
    //  for when testing locally will be moved to env variables when stable
    //  await tgz.uncompress(path, "./apps");
};
