import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts"
import push from "../../src/middleware/push.ts"; 

Deno.test("Test /push endpoint for POST request", async () => {
  const request = new Request("/push", {
    method: "POST",
    body: JSON.stringify({
      subscription: {
        endpoint: "https://example.com/endpoint",
      },
      ttl: 3600,
    }),
  });

  const response = await push(request);

  assertEquals(response, new Response("Pushed Attempted", { status: 201 }));
});


Deno.test("Test /push/vapidPublicKey endpoint for GET request", async () => {
    const request = new Request("/push/vapidPublicKey", {
      method: "GET",
      body: JSON.stringify({
        subscription: {
          endpoint: "https://example.com/endpoint",
        },
        ttl: 3600,
      }),
    });
  
    const response = await push(request);
  
    assertEquals(response?.status, 200);
  });
  

  Deno.test("Test /push/register endpoint for POST request", async () => {
    const request = new Request("/push/register", {
      method: "POST",
      body: JSON.stringify({
        subscription: {
          endpoint: "https://example.com/endpoint",
        },
        ttl: 3600,
      }),
    });
  
    const response = await push(request);
  
    assertEquals(response, new Response("Registered", { status: 201 }));
  });

    