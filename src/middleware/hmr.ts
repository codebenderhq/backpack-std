const hmr = (pathname:string, request:Request): Response | void => {
  if (request.headers.get("upgrade") === "websocket" && pathname === "/hmr") {
    const { socket: ws, response } = Deno.upgradeWebSocket(request);

    const handleConnected = ()=> console.log("Connection established");
    ws.onopen = () => handleConnected();

    const handleDisconnected = () => console.log("Connection closed");
    ws.onclose = () => handleDisconnected();

    const handleMessage = (ws:WebSocket, msg:any) => {
      console.log(msg);
    };

    ws.onmessage = (e) => handleMessage(ws, e.data);

    console.log("hmr server loaded");
    return response;
  }
};

export default hmr;
