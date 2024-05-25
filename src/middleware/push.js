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
// https://github.com/mdn/serviceworker-cookbook/blob/master/push-get-payload/service-worker.js

import { generateKeys, getHeaders, getRawKey } from "../lib/vapid/index.js";

const push = async (pathname, request) => {
  if (pathname === "generateKey") {
    const keys = generateKeys();
    return Response.json({});
  }

  if (pathname === "vapidPublicKey" && request.method === "GET") {
    return new Response(await getRawKey());
  }

  if (pathname === "register" && request.method === "POST") {
    const data = await request.json();
    const public_id = crypto.randomUUID();
    const kv = await Deno.openKv("opn");

    await kv.set(["opn", data.subscription.keys.auth], data.subscription);
    await kv.set(["opn", "public", public_id], data.subscription.keys.auth);

    return new Response(public_id);
  }

  if (pathname === "push" && request.method === "POST") {
    const { public_id, ttl } = await request.json();

    const kv = await Deno.openKv("opn");

    const opn_auth_key = (await kv.get(["opn", "public", public_id])).value;

    const subscription = (await kv.get(["opn", opn_auth_key])).value;

    if (!subscription) return new Response("Failed To Push", { status: 400 });

    // const payload = null;
    // const options = {
    //   TTL: data.ttl,
    // };

    const parsedUrl = new URL(subscription.endpoint);
    const audience = parsedUrl.protocol + "//" +
      parsedUrl.host;

    const claim = {
      aud: audience,
      sub: "https://sauveur.cloud",
    };

    const vapidHeader = await getHeaders(claim);

    fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        ttl: ttl || 0,
        "Content-Encoding": "aes128gcm",
        "Authorization": vapidHeader.authorization,
      },
      //       body:encrypted
    });

    return new Response("Pushed Attempted", { status: 201 });
  }
};

export default push;
