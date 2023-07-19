import { tgz } from "https://raw.githubusercontent.com/rawkakani/compress/master/mod.ts";

self.onmessage = async (evt) => {
  console.log(evt.data);
  const path = evt.data.path;
  const name = evt.data.name;
  await tgz.uncompress(path, `/apps/${name}`, { overwrite: true });
  //  for when testing locally will be moved to env variables when stable
  //  await tgz.uncompress(path, "./apps");
};
