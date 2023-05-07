const script_middleware = async (pathname, req) => {
  const isScriptRequest = pathname.includes(".js");
  const _pathname = pathname.split(".").shift();

  if (isScriptRequest) {
    let onBuildResult;
    let onServerResult;
    let prop;

  
    // console.log(Deno.cwd())
    const res =  await import(`${window.extPath}/src/_app${_pathname}.js`)

    if (res.onBuild) {
      onBuildResult = await res.onBuild();
    }

    if (res.onServer) {
      onServerResult = await res.onServer(_pathname, req);
    }

    prop = { onBuildResult, onServerResult };

    return new Response(`(${res.default})(${JSON.stringify(prop)})`, {
      headers: {
        "content-type": "text/javascript",
      },
    });
  }
};

export default script_middleware;
