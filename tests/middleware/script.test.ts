import { assertEquals} from "https://deno.land/std@0.216.0/assert/mod.ts";
import script_middleware from "../../src/middleware/script.ts";

Deno.test("Test script middleware", async () => {
  // Simulate a request object
  const request = new Request("https://example.com/some/path");

  // Call the middleware function
  const response = await script_middleware(request);

  assertEquals(response instanceof Response, true);
  assertEquals(response.status,200)

});
