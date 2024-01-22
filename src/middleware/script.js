const script_middleware = async (req, isProd) => {
  const {pathname: _pathname} = new URL(req.url)
  console.log(_pathname)
  let onServerResult;
  let prop;

  let res = await import(`file:///${window._cwd}${_pathname}`)

  // this is to support deployment to a linux enviroment
  if(!Deno.build.os === "windows"|| !isProd ){
    if(!isProd){
      res = await import(`${window._cwd}${_pathname}`);
    }else{
      res = await import(`app/${window._cwd}${_pathname}`);
    }
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
