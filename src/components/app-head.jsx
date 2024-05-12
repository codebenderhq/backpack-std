import React from "npm:react";
import { renderToString } from "npm:react-dom/server";

import { exists } from "https://deno.land/std/fs/mod.ts";

const AppHeader = (
  {
    name = "oomph",
    icon = "/favicon.png",
    desc = "For the people who shape culture, Glimpse into the future of trade",
  },
) => {
  return (
    <head>
      <meta charSet="UTF-8" />
      <title>{name}</title>
      <meta
        name="description"
        content="For the people who shape culture, Glimpse into the future of trade"
      />
      <link rel="icon" type="image/png" href={icon} />
      <link rel="apple-touch-icon" href={icon} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/output.css" />
      <link rel="manifest" href="/manifest.json" />
      <meta property="og:title" content="Sauveur Dev" />
      <meta
        property="og:description"
        content={desc}
      />
      <meta property="og:image" content="/background.jpg" />
      <meta property="og:url" content="https://sauveur.dev" />

      <meta name="twitter:title" content="Sauveur Dev" />
      <meta
        name="twitter:description"
        content={desc}
      />
      <meta name="twitter:image" content="/background.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="description"
        content={desc}
      />

      {/*https://developer.mozilla.org/en-US/docs/Web/Manifest*/}
    </head>
  );
};
export default async ({ req, attributes }) => {
  let manifest = {
    name: "oomph",
    icon: "/favicon.png",
    description: "For the people who shape culture",
  };
  const manifest_path = `${window._cwd}/src/public/manifest.json`;
  // console.log(manifest_path, "manifest path");
  // console.log(await exists(manifest_path), "manifest exists");

  try {
    if (await exists(manifest_path)) {
      const { default: _manifest } = await import(`file:///${manifest_path}`, {
        assert: { type: "json" },
      });
      manifest.name = _manifest.name;
      manifest.icon = _manifest.icons[0].src;
      manifest.description = _manifest.description;
    }
  } catch (err) {
    console.log("failed to load manifest");
  }

  return renderToString(
    <AppHeader
      name={manifest.name}
      icon={manifest.icon}
      desc={manifest.description}
    />,
  );
};
