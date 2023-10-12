const script_middleware = async (pathname, req) => {
  const isScriptRequest = pathname.includes(".js");
  const _pathname = pathname.split(".").shift();

  if (isScriptRequest) {
    let onServerResult;
    let prop;


    let res = await import(`file:///${window.extPath}/src/_app${_pathname}.js`)
    
    // this is to support deployment to a linux enviroment
    if(!Deno.build.os === "windows"|| !Deno.env.get('env') ){
      res = await import(`app/${window.extPath}/src/_app${_pathname}.js`);
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
  }
};

export default script_middleware;
