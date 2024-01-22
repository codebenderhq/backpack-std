import React from "npm:react";
import { renderToString } from 'npm:react-dom/server';

import { exists } from "https://deno.land/std/fs/mod.ts";


const AppHeader = ({name = "oomph", icon="/favicon.png"}) => {
    return(
        <head>
            <meta charSet="UTF-8"/>
            <title>{name}</title>
            <meta name="description" content="Split your expenses amongst your freinds" />
            <link rel="icon" type="image/png" href={icon}/>
            <link rel="apple-touch-icon" href={icon}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="/output.css"/>
            <link rel="manifest" href="/manifest.json" />

            {/*https://developer.mozilla.org/en-US/docs/Web/Manifest*/}

        </head>
    )
}
export default async ({name, icon}) => {

    let manifest = {name: "oomph", icon:"/favicon.png"}
    const manifest_path = `${window._app}/src/public/manifest.json`
    
    if(exists(manifest_path)){
        const {default: _manifest} = await import(`${window._app}/src/public/manifest.json`,{
            assert: {
                type: "json",
            },
        });
        manifest.name = _manifest.name
        manifest.icon = _manifest.icons[0].src
    }

    return renderToString(<AppHeader name={manifest.name} icon={manifest.icon} />);
}