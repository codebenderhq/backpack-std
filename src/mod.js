import {serve} from "./lib/server.js"



async function main(inputArgs){
    console.log(inputArgs)
    serve()
}

main(Deno.args);