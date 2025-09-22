Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const path = getFilePath(url);

    try {
      return new Response(Bun.file(`.${path}`));
    } catch (error) {
      console.error("Failed to serve file:", `./public${path}`, error);
      return new Response("Not found", { status: 404 });
    }
  },
});

function getFilePath(url: URL) {
  const { pathname } = url;

  if (pathname === "/") return "/public/index.html";

  if (pathname === "/favicon.png") return "/public/favicon.png";

  return url.pathname;
}

console.log("Server running at http://localhost:3000");
