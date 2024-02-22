import {assertEquals} from "https://deno.land/std@0.216.0/assert/mod.ts"
import logView from "../../src/views/logger.ts"

Deno.test(async function test_logView(){
    const request : Request = new Request("/logs",{
        method: "GET",
    })

    const response:Response  | undefined= await logView(request)

    assertEquals(response != undefined, true)

    assertEquals(response?.status,200)
    
})