import { exists } from "https://deno.land/std/fs/mod.ts";
// import Markdoc from "npm:@markdoc/markdoc";

const exts = ["html", "jsx"];
let isError = false;
let errorPath;

const html_middleware = async (req) => {
  const paths = new URL(req.url).pathname.replace(/\/$/,"")
  let src;
  const pathArrays = paths.
    replace("/","")
    .split("/");

  let tempSrc;
  if (pathArrays.length === 1 && pathArrays[0] !== "") {
    tempSrc = `${window._cwd}${paths}.html`;
  } else if (pathArrays.length > 1) {
    pathArrays.splice(1, 0, "pages");
    tempSrc = `${window._cwd}/${pathArrays.join('/')}.html`;
  } else {
    tempSrc = `${window._cwd}/index.html`;
  }

  src = await exists(tempSrc) ? await Deno.readTextFile(tempSrc) : `<h1>Error In Page</h1>`;

  return html_response(src)
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
