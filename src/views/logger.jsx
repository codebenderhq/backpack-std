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
        <div className="w-full flex relative">
          
          <div className="p-2 rounded">

          </div>
          <div className="flex flex-col flex-grow  h-screen overflow-y-scroll">
          {logs.map((log, key) => {
          if (log.value.data) {
            return (
              <>
               <div className="p-2 rounded shadow ">
                <p>{log.value.type}</p>
                {log.value.data.request ? 
                  <p>
                   {log.value.data.request.method} {log.value.data.request.uri}
                  </p> : <></>
                }

                {log.value.data.message ? 
                  <p>
                   {log.value.data.message}
                  </p> : <></>
                }
                <p>
                  {log.value.data.response
                    ? <>
                     <p>{log.value.data.response.status}</p>
                      { log.value.data.response.body ?
                     <div className="flex flex-col">
                      <a href={`#${key}`} className="">view response</a>
                     </div> : " "}
                    </>
                    : ""}
                </p>
              </div>
              
              <div id={key} className="w-1/3 p-4 mr-4 rounded shadow h-screen bg-white hidden target:flex absolute inset-y-0 right-0 overflow-hidden overflow-y-scroll">
                <div className="flex flex-col">
               
                {log.value.data.request ? 
                 <h1 className="text-wrap">
                   {log.value.data.request.method} {log.value.data.request.uri}
                   </h1>: <></>
                }

                {log.value.data.response ?   <div className="w-64 h-96 p-4 relative overflow-hidden overflow-x-scroll text-xs">
                  {JSON.stringify(log.value.data.response.body)}
                </div> : <></>}
                
              
             
                </div>
               
              </div>
              </>
             
            );
          }
        })}

          </div>

          <div className="p-2 rounded">

          </div>
        </div>
       
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

  // logs.forEach(log => {
  //   // console.log(log.value.data.response)
  //   if(log.value.data.response && log.value.data.response.body){
  //     console.log(log.value.data.response.body)
  //   }
  // })
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
