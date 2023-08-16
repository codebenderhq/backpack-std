import { tgz } from "https://raw.githubusercontent.com/rawkakani/compress/master/mod.ts";

self.onmessage = async (evt) => {
  console.log(evt.data);
  const path = evt.data.path;
  const name = evt.data.name;
  const version = evt.data.version;

  // if there is a version, move the old app into it's version folder/rename, delete the current src and unzip
  // /appName/src
  // /appName/0.0.1/src

  if (version) {
    await Deno.mkdir(`/apps/${name}/${version}`);
    await Deno.rename(`/apps/${name}/src`, `/apps/${name}/${version}/src`);
  }

  await tgz.uncompress(path, `/apps/${name}`, { overwrite: true });
  //  for when testing locally will be moved to env variables when stable
  //  await tgz.uncompress(path, "./apps");
};
