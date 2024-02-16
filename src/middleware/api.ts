import html from "./html.js";


const valid_domain = (referer: string): boolean => {
  // need to handle valid domain better as a person could just read the code and figure out what refer to use
  return ["sauveur.xyz", "http://localhost:8080/", "mmereko.co.za"].includes(
    referer,
  );
};

const is_authenticated = (auth:string): boolean => {
  return [Deno.env.get("SERVER_KEY")].includes(auth);
};
type get_data_response = {
  result: {},
  type:string
}
const get_data = async (request:Request) :  Promise<get_data_response>=> {
  let _data = {};
  let type = "json";
  const referer: string | null = request.headers.get("referer");
  const isFormReq : boolean = request.headers.get("content-type") ===
    "application/x-www-form-urlencoded";
  const isBlob : boolean =
    request.headers.get("content-type") === "application/octet-stream";

  if (isFormReq && referer) {
    let referer = new URL(request.headers.get("referer"));
    let data: URLSearchParams = new URLSearchParams(await request.text());

    for (const key of data.keys()) {
      const value = data.get(key);
      if (value !== "") {
        _data[key] = value;
      }
    }

    // for (var key of referer.searchParams.keys()) {
    //   data.set(key, referer.searchParams.get(key));
    // }

    type = "form";
  } else if (isFormReq && !referer) {
    throw new Error("Form request require referer");
  } else if (isBlob) {
    _data = await request.blob();
    type = "blob";
  } else {
    _data = await request.json();
  }

  return { result: _data, type };
};

const api_middleware = async (request: Request) : Promise<Response> => {
  const app_path = window._app;
  const { pathname } = new URL(request.url);

  let response;
  try {
    let data = {};
    const auth: string | null = request.headers.get("authorization");
    const host : string | null = request.headers.get("host");
    const { protocol } = new URL(request.url);
    const referer = request.headers.get("referer");
    const paths : string[] = pathname.split("/");
    let subPath = "";
    if (paths.length > 3) {
      paths.pop();
    }

    const apiPath = `${paths.reverse().join("/")}${subPath}`;

    // added server cors
    // if (!is_authenticated(auth) && !isFormType) {
    //   throw new Error("Unotharized");
    // }

    if (request.method !== "GET") {
      data = await get_data(request);
      oomph.logger.info({ ...data });
    }

    const api_src = `${app_path}/${apiPath}${request.method.toLowerCase()}.js`;

    let api_path = `file:///${api_src}`;

    // this is to be able to handle the production enviroment
    if (Deno.env.get("env") === "production") {
      api_path = `app/${api_src}`;
    }

    const { default: apiMethod } = await import(api_path);
    const json = await apiMethod(request, data.result);

    const status = json.status;
    delete json.status;

    if (request.method === "POST") {
      const returnPath = json.uri;
      const redirectHost = json.redirect;
      delete json.redirect;
      delete json.uri;
      delete json.body;
      delete json.status;
      const searchParam = new URLSearchParams(json);

      console.log(json);
      const Location = `${redirectHost ? `https://${redirectHost}` : ""}${
        returnPath ? returnPath : "/status"
      }?${searchParam.toString()}`;

      console.log("redirect to", Location);
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
      // https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#session_fixation
      const headers = {
        Location,
        "set-cookie": json?.setCookie
          ? `id=${json.auth};Secure;HttpOnly;SameSite=Lax;Path=/`
          : null,
      };

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    response = Response.json(json, {
      status,
    });
  } catch (err) {
    console.log(err);
    oomph.logger.info({
      title: `SERVER:API:ERROR:${request.url}`,
      msg: err.message,
      err,
    });
    throw new Error(`SERVER:API:ERROR:${request.url}`);
  }

  return response;
};

export default api_middleware;
