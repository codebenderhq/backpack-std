//https://datatracker.ietf.org/doc/html/rfc8188
// https://datatracker.ietf.org/doc/html/rfc8291#section-2.1
// https://github.com/negrel/http_ece
// https://www.rfc-editor.org/rfc/rfc8188.html#section-2
// https://datatracker.ietf.org/doc/html/rfc8030#section-5
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
// https://github.com/web-push-libs/web-push#encryptuserpublickey-userauth-payload-contentencoding
// https://github.com/web-push-libs/web-push/blob/f748310503e514ac907821360cc2cef0bb9f1073/src/encryption-helper.js#L45C14-L45C14
// https://github.com/web-push-libs/web-push/blob/f748310503e514ac907821360cc2cef0bb9f1073/src/web-push-lib.js#L242
// https://datatracker.ietf.org/doc/html/draft-ietf-webpush-vapid-02#section-4
// https://datatracker.ietf.org/doc/html/rfc8030#section-8
// https://blog.mozilla.org/services/2016/04/04/using-vapid-with-webpush/

import { generateKeys, getHeaders, getRawKey } from "../lib/vapid/index.js";

const push = async (request:Request): Promise<Response | undefined> => {
  const { pathname, searchParams } = oomph.req(request);

  const publicKey:string | undefined = Deno.env.get("PUSH_PUBLIC_KEY");

  if (pathname === "/push/vapidPublicKey" && request.method === "GET") {
    return new Response(await getRawKey());
  }

  if (pathname === "/push/register" && request.method === "POST") {
    console.log("you have registerd");
    return new Response("Registered");
  }

  if (pathname === "/push" && request.method === "POST") {
    const data = await request.json();
    const subscription = data.subscription;
    const payload = null;
    const options = {
      TTL: data.ttl,
    };

    const parsedUrl = new URL(subscription.endpoint);
    const audience = parsedUrl.protocol + "//" +
      parsedUrl.host;

    const claim = {
      aud: audience,
      sub: "https://sauveur.cloud",
    };

    const vapidHeader = await getHeaders(claim);
    console.log("send push notification");

    fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        ttl: 3600,
        "Content-Encoding": "aes128gcm",
        "Authorization": vapidHeader.authorization,
      },
      //       body:encrypted
    });

    return new Response("Pushed Attempted", { status: 201 });
  }
};

export default push;
