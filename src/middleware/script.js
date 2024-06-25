const script_middleware = async (req) => {
  const app_path = window._app;
  const { pathname: _pathname, searchParams } = new URL(req.url);
  console.log(_pathname);
  let onServerResult;
  let prop;
  let headers = {};

  try {
    // console.log("in script",app_path);
    let res = await import(`file:///${app_path}${_pathname}`);

    // this is to support deployment to a linux enviroment
    if (Deno.env.get("env") === "production") {
      res = await import(`app/${app_path}${_pathname}`);
    }

    if (res.onServer) {
      onServerResult = await res.onServer(_pathname, req);

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
  } catch (err) {
    console.log(err);
    return new Response("script file unavailible");
  }
};

export default script_middleware;
