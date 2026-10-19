import { spawn } from "node:child_process";
import { createConnection, createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 5173;
const clientDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function waitForIpv4(port) {
  return new Promise((resolve) => {
    const attempt = () => {
      const socket = createConnection({ host: "127.0.0.1", port }, () => {
        socket.end();
        resolve();
      });
      socket.on("error", () => setTimeout(attempt, 50));
    };
    attempt();
  });
}

function startIpv6LoopbackProxy() {
  const server = createServer((client) => {
    const upstream = createConnection({ host: "127.0.0.1", port: PORT });
    const hangup = () => {
      client.destroy();
      upstream.destroy();
    };
    client.on("error", hangup);
    upstream.on("error", hangup);
    client.pipe(upstream);
    upstream.pipe(client);
  });

  server.on("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      console.error("[dev] IPv6 proxy failed:", error.message);
    }
  });
  server.listen({ port: PORT, host: "::1", ipv6Only: true }, () => {
    console.log(`[dev] IPv6 localhost [::1]:${PORT} → 127.0.0.1:${PORT}`);
  });
  return server;
}

const vite = spawn(
  process.execPath,
  [
    path.join(clientDir, "node_modules/vite/bin/vite.js"),
    "--host",
    "0.0.0.0",
    "--port",
    String(PORT),
    "--strictPort",
  ],
  { cwd: clientDir, stdio: "inherit", env: process.env },
);

let ipv6Proxy;

waitForIpv4(PORT).then(() => {
  ipv6Proxy = startIpv6LoopbackProxy();
});

const stop = () => {
  ipv6Proxy?.close();
  if (!vite.killed) vite.kill("SIGTERM");
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
vite.on("exit", (code) => {
  ipv6Proxy?.close();
  process.exit(code ?? 0);
});
