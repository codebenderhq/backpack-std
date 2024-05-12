import React from "npm:react";
import { renderToString } from "npm:react-dom/server";
import { get_kv } from "../lib/index.js";

const Logger = ({ logs }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Logs</title>
        <meta
          name="description"
          content="For the people who shape culture, Glimpse into the future of trade"
        />
        <link rel="icon" type="image/png" href={"/favicon.png"} />
        <link rel="apple-touch-icon" href={"/favicon.png"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/output.css" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:title" content="Sauveur Dev" />
        <meta
          property="og:description"
          content={"For the people who shape culture, Glimpse into the future of trade"}
        />
        <meta property="og:image" content="/background.jpg" />
        <meta property="og:url" content="https://sauveur.dev" />

        <meta name="twitter:title" content="Sauveur Dev" />
        <meta
          name="twitter:description"
          content={"For the people who shape culture, Glimpse into the future of trade"}
        />
        <meta name="twitter:image" content="/background.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="description"
          content={"For the people who shape culture, Glimpse into the future of trade"}
        />

        {/*https://developer.mozilla.org/en-US/docs/Web/Manifest*/}
      </head>
      <body>
        {logs.map((log) => {
          return (
            <>
              <p>{log.value.type}</p>
              <p>
                {log.value.data.request.method} {log.value.data.request.uri}
              </p>
              <p>
                {log.value.data.response ? log.value.data.response.status : ""}
              </p>
            </>
          );
        })}
      </body>
    </html>
  );
};

export default async ({ req, attributes }) => {
  const kv = await get_kv();
  const log = await kv.list({ prefix: ["Log"] });

  //        for await (const entry of log) {
  //            kv.delete(entry.key)
  //        }
  const logs = [];

  for await (const res of log) logs.push(res);
  logs.sort().reverse();

  // console.log(logs)
  // return new Response(logView);

  return new Response(
    renderToString(
      <Logger logs={logs} />,
    ),
    {
      headers: {
        "content-type": "text/html",
      },
    },
  );
};
