import { exists } from "https://deno.land/std/fs/mod.ts";
// import Markdoc from "npm:@markdoc/markdoc";

const exts = ["html", "jsx"];
let isError = false;
let errorPath;

const html_middleware = async (pathname, req) => {
  let path = `${window.extPath}/src/_app/`;
  errorPath = `${path}error/pages/index.html`;

  if (!pathname.includes(".")) {
    let paramPage = "";
    let jsxPage = false;
    let page;
    for (const ext of exts) {
      let _pageSrc = `${path}/index.${ext}`;
      paramPage = `${path}@.${ext}`;

      const pathArrays = pathname.split("/");
      pathArrays.shift();

      if (
        pathArrays.length === 1 && pathArrays[0] !== "" &&
          !pathname.includes("@") ||
        pathname.includes("@") && pathArrays.length !== 1
      ) {
        _pageSrc = `${path}${pathname}/pages/index.${ext}`;
        paramPage = `${path}${pathArrays[0]}/pages/@.${ext}`;
      } else if (pathname !== "/" && pathArrays.length !== 1) {
        _pageSrc = `${path}${pathArrays[0]}/pages/${pathArrays[1]}.${ext}`;
        paramPage = `${path}${pathArrays[0]}/pages/@.${ext}`;
      }
      const isParamAvailible = await exists(paramPage);
      const pageExist = await exists(_pageSrc);

      if (!page && (pageExist || isParamAvailible) && ext !== "jsx") {
        page = await Deno.readTextFile(
          pageExist ? _pageSrc : isParamAvailible ? paramPage : set_error(),
        );
        if (pageExist || isParamAvailible) {
          break;
        }
      } else if (!pageExist || !isParamAvailible) {
        page = await Deno.readTextFile(errorPath);
      }

      if (ext === "jsx" && pageExist || isParamAvailible) {
        jsxPage = await import(
          pageExist ? _pageSrc : isParamAvailible ? paramPage : set_error()
        );
      }
    }
    if (jsxPage) {
      return new Response(await jsxPage.default(req), {
        headers: { "content-type": "text/html" },
      });
    }
    return html_response(page);
  }
};

const set_error = () => {
  isError = true;
  return errorPath;
};

export const error_response = () => {
  return html_response(Deno.readFile(errorPath));
};

const hmrScript = `
<script>
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:9090/hmr');

// Connection opened
socket.addEventListener('open', (event) => {
    socket.send('Start HMR!');
});

 // Listen for error
 socket.addEventListener('close', (event) => {
    console.log('connection close reload')
    setTimeout(() => {
        location.reload()
    },1000)
 
});
</script>
`;

// redirect to 303 error page
const html_response = (res) => {
  // Will check what is up with this HMR
  // ${Deno.env.get('env') ? hmrScript : ''}
  return new Response(`${res}`, {
    headers: {
      "content-type": "text/html",
    },
  });
};

export default html_middleware;
