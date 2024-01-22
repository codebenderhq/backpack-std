import React from "npm:react";
import { renderToString } from 'npm:react-dom/server';


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
        </head>
    )
}
export default ({name, icon}) => renderToString(<AppHeader name={name} icon={icon} />);