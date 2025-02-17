import { getCookies } from "jsr:@std/http@0.216/cookie";

const getAuthToken = (req) => {
  const { id } = getCookies(req.headers);

  return id ? id : req.headers.get("authorization");
};

const isAuthenticated = (req) => {
  const id = getAuthToken(req);
  return id ? true : false;
};

const authenticate = async (pathname, request) => {
  if (!isAuthenticated(request)) {
    const { pathname } = new URL(request.url);

    globalThis.space = {
      getAuthToken,
    };

    const { default: app } = await import(
      `app.sauveur.${Deno.env.get("env") ? "dev" : "xyz"}/index.js`
    );

    const appReq = new Request(
      `https://app.sauver.xyz/account?redirect=${request.headers.get("host")}`,
      {
        headers: {
          host: "app.sauver.xyz",
        },
      },
    );

    globalThis._cwd = `${
      Deno.env.get("MAIN_PATH")
        ? `${Deno.env.get("MAIN_PATH")}app.sauveur.dev`
        : "/apps/home/app.sauveur.xyz"
    }`;
    if (pathname !== "/") {
      return app(request);
    }

    return app(appReq);
    // return new Response(null,{
    //     status: 401,
    //     headers: {
    //         'WWW-Authenticate': 'Basic realm="Access to staging site"'
    //     }
    // })
  }
};

export default authenticate;
