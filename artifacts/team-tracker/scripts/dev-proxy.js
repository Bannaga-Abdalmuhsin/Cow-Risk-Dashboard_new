#!/usr/bin/env node
/**
 * dev-proxy.js
 *
 * Listens on PORT (the public expo.picard.replit.dev port).
 * Routes:
 *   /api/*  → localhost:API_PORT  (API server — returns JSON)
 *   *       → localhost:METRO_PORT (Metro bundler — returns JS bundles / HTML)
 *
 * Also proxies WebSocket upgrade requests to Metro (needed for hot reload).
 *
 * Port cleanup is handled by start.js before this process is spawned.
 */

const http = require("http");
const net  = require("net");

const PORT       = parseInt(process.env.PORT       || "22337", 10);
const METRO_PORT = parseInt(process.env.METRO_PORT || String(PORT + 1), 10);
const API_PORT   = 8080;

function pipe(req, res, targetPort) {
  const opts = {
    hostname: "localhost",
    port:     targetPort,
    path:     req.url,
    method:   req.method,
    headers:  { ...req.headers, host: `localhost:${targetPort}` },
  };
  const upstream = http.request(opts, (upRes) => {
    res.writeHead(upRes.statusCode, upRes.headers);
    upRes.pipe(res, { end: true });
  });
  upstream.on("error", (err) => {
    if (!res.headersSent) res.writeHead(502);
    res.end(`[dev-proxy] upstream error: ${err.message}`);
  });
  req.pipe(upstream, { end: true });
}

const server = http.createServer((req, res) => {
  const target = (req.url || "").startsWith("/api") ? API_PORT : METRO_PORT;
  pipe(req, res, target);
});

server.on("upgrade", (req, socket, head) => {
  const upstream = net.createConnection(METRO_PORT, "localhost", () => {
    const reqLine = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
    const headers = [];
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      headers.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
    }
    upstream.write(reqLine + headers.join("\r\n") + "\r\n\r\n");
    if (head && head.length) upstream.write(head);
    upstream.pipe(socket, { end: true });
    socket.pipe(upstream, { end: true });
  });
  upstream.on("error", () => socket.destroy());
  socket.on("error",   () => upstream.destroy());
});

server.on("error", (err) => {
  console.error(`[dev-proxy] bind :${PORT} failed — ${err.message}`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(
    `[dev-proxy] :${PORT}  →  /api/* :${API_PORT}  |  rest → Metro :${METRO_PORT}`,
  );
});
