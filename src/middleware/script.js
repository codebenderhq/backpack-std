const script_middleware = async (req, isProd) => {
  const app_path = window._app;
  const { pathname: _pathname } = new URL(req.url);
  console.log(_pathname);
  let onServerResult;
  let prop;

  let res = await import(`file:///${app_path}${_pathname}`);

  // this is to support deployment to a linux enviroment
  if (!Deno.build.os === "windows" && isProd) {
    res = await import(`app/${app_path}${_pathname}`);
  } else if (!Deno.build.os === "windows" && !isProd){
    res = await import(`${app_path}${_pathname}`);
  }

  if (res.onServer) {
    onServerResult = await res.onServer(_pathname, req);
  }

  prop = { onServerResult };

  return new Response(`(${res.default})(${JSON.stringify(prop)})`, {
    headers: {
      "content-type": "text/javascript",
    },
  });
};

export default script_middleware;
