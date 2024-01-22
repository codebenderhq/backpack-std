import React from "npm:react";
import { renderToString } from 'npm:react-dom/server';


const AppHeader = () => {
    return(
        <head>
            <meta charSet="UTF-8"/>
            <title>SikaMe</title>
            <meta name="description" content="Split your expenses amongst your freinds" />
            <link rel="icon" type="image/png" href="/favicon.png"/>
            <link rel="apple-touch-icon" href="/favicon.png"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="/output.css"/>
        </head>
    )
}
export default () => renderToString(<AppHeader />);