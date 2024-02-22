import { assert, assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import webSocket_middleware from "../../src/middleware/websocket.ts"

Deno.test("Test WebSocket middleware", async () => {
  // Simulate a WebSocket upgrade request to /socket
  const headers = new Headers();
  headers.set("upgrade", "websocket");
  const request = new Request("https://example.com/socket", {
    headers,
  });

  // Call the WebSocket middleware function
  const response = await webSocket_middleware("/socket", request);

  // Check if the response is a Response object
  assertEquals(response instanceof Response, true);

});
