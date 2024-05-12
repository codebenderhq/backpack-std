const script_middleware = async (req) => {
  const app_path = window._app;
  const { pathname: _pathname } = new URL(req.url);
  console.log(_pathname);
  let onServerResult;
  let prop;
  let headers = {};

  try {
    let res = await import(`file:///${app_path}${_pathname}`);

    // this is to support deployment to a linux enviroment
    if (Deno.env.get("env") === "production") {
      res = await import(`app/${app_path}${_pathname}`);
    }

    console.log("in the script");
    if (res.onServer) {
      onServerResult = await res.onServer(_pathname, req);

      //  check response type
      console.log(onServerResult instanceof Response);

      if (onServerResult instanceof Response) {
        return onServerResult;
      }

      if (onServerResult.header) {
        headers = onServerResult.header;
        delete onServerResult.header;
      }
    }

    prop = { onServerResult };

    return new Response(`(${res.default})(${JSON.stringify(prop)})`, {
      headers: {
        "content-type": "text/javascript",
        ...headers,
      },
    });
  } catch {
    return new Response("script file unavailible");
  }
};

export default script_middleware;
