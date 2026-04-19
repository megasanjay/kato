// Development middleware that logs each incoming request URL.
export default defineEventHandler((event) => {
  console.log("New request: " + event.node.req.url);
});
