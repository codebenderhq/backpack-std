import { DERLite } from "./der.js";
import { VapidToken02 } from "./vapid.js";

const vapidToken = new VapidToken02();
const importer = new DERLite();

try {
  //set keys based on env variable
  importer.lang = vapidToken.lang;
  vapidToken._private_key = await importer.import_private_der(
    Deno.env.get("PUSH_PRIVATE_KEY"),
  );
  vapidToken._public_key = await importer.import_public_der(
    Deno.env.get("PUSH_PUBLIC_KEY"),
  );
} catch (e) {
  console.log(e);
  console.log("PUSH Notification Not Initialized");
}

export const generateKeys = () => {
  vapidToken.generate_keys().then((x) => {
    const exporter = new DERLite();
    exporter.export_private_der(x.privateKey)
      .then((k) =>
        console.log("Private:", importer.import_private_der(k), "Raw:", k)
      )
      .catch((er) => console.log(er));
    exporter.export_public_der(x.publicKey)
      .then((k) =>
        console.log("Public:", importer.import_public_der(k), "Raw:", k)
      )
      .catch((er) => console.log(er));
  });
};

export const getHeaders = async (claim) => {
  const claims = {
    sub: claim.sub,
    aud: claim.aud,
  };

  try {
    const signature = await vapidToken.sign(claims);
    return signature;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create signature");
  }
};

export const getRawKey = () => {
  return vapidToken.export_public_raw();
};
