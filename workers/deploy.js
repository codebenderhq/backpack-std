import { tgz } from "https://deno.land/x/compress@v0.4.4/mod.ts";

self.onmessage = async (evt) => {
    console.log(evt.data);
    const path = evt.data.path;
    const name = evt.data.name;
    await tgz.uncompress(path, `/apps/${name}`);
    //  for when testing locally will be moved to env variables when stable
    //  await tgz.uncompress(path, "./apps");
};
