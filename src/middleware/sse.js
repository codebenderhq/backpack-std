// https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
export default () => {
  return new Response("retry: 10000\nevent: ping\ndata: some text\n\n", {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/event-stream",
    },
  });
};
