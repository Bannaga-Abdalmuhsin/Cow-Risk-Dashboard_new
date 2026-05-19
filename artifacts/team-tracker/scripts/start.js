#!/usr/bin/env node
/**
 * start.js — unified dev launcher for ACES Field Team Tracker
 *
 * Spawns dev-proxy.js and expo start as tracked child processes.
 * Because neither child is detached, they share the same process group
 * as this script. When Replit stops the workflow it sends SIGTERM to the
 * group, killing all three at once — no orphan processes, no EADDRINUSE
 * on the next restart.
 *
 * Usage: node scripts/start.js  (invoked by pnpm dev)
 */

const { spawn, execSync } = require("child_process");
const fs   = require("fs");
const path = require("path");

const ROOT        = path.resolve(__dirname, "..");
const PORT        = parseInt(process.env.PORT       || "22337", 10);
const METRO_PORT  = PORT + 1;
const API_BASE    = `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`;

// ── Write .env.local ──────────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(ROOT, ".env.local"),
  [
    `EXPO_PUBLIC_API_URL=${API_BASE}`,
    `EXPO_PUBLIC_DOMAIN=${process.env.REPLIT_DEV_DOMAIN  || ""}`,
    `EXPO_PUBLIC_REPL_ID=${process.env.REPL_ID           || ""}`,
  ].join("\n") + "\n",
);

// ── Port cleanup ──────────────────────────────────────────────────────────────
// Kill any lingering processes holding the ports we need.
// Uses `ss` (iproute2 — always on Linux) to locate PIDs, then signals them.
function killPort(p) {
  // ss -Hlntp 'sport = :PORT' — lists listeners with PID info
  let out = "";
  try {
    out = execSync(`ss -Hlntp 'sport = :${p}' 2>/dev/null`, {
      encoding: "utf8",
      stdio:    ["pipe", "pipe", "ignore"],
    });
  } catch { /* ss may not be present */ }

  const pids = [...out.matchAll(/pid=(\d+)/g)].map(m => parseInt(m[1]));

  // Fallback: /proc/net/tcp hex lookup (always present on Linux)
  if (pids.length === 0) {
    try {
      const hex   = p.toString(16).toUpperCase().padStart(4, "0");
      const tcp   = fs.readFileSync("/proc/net/tcp",  "utf8");
      const tcp6  = fs.readFileSync("/proc/net/tcp6", "utf8");
      const inodes = new Set();
      for (const line of (tcp + tcp6).split("\n")) {
        const parts = line.trim().split(/\s+/);
        if (parts[1] && parts[1].endsWith(`:${hex}`) && parts[3] === "0A") {
          inodes.add(parts[9]);
        }
      }
      if (inodes.size > 0) {
        for (const entry of fs.readdirSync("/proc")) {
          if (!/^\d+$/.test(entry)) continue;
          try {
            const fdDir = `/proc/${entry}/fd`;
            for (const fd of fs.readdirSync(fdDir)) {
              const link = fs.readlinkSync(`${fdDir}/${fd}`);
              if (link.startsWith("socket:[") && inodes.has(link.match(/\d+/)[0])) {
                pids.push(parseInt(entry));
              }
            }
          } catch { /* no permission */ }
        }
      }
    } catch { /* /proc not available */ }
  }

  const unique = [...new Set(pids)];
  if (unique.length === 0) return;

  unique.forEach(pid => {
    try { process.kill(pid, "SIGKILL"); } catch { /* already gone */ }
  });
  console.log(`[start] killed pids ${unique.join(", ")} holding :${p}`);
}

console.log(`[start] freeing ports ${PORT} and ${METRO_PORT}…`);
killPort(PORT);
killPort(METRO_PORT);

// ── Launch children ───────────────────────────────────────────────────────────
const children = [];

function killAll(signal = "SIGTERM") {
  children.forEach(child => { try { child.kill(signal); } catch {} });
}

process.on("SIGTERM", () => { killAll("SIGTERM"); setTimeout(() => process.exit(0), 3000); });
process.on("SIGINT",  () => { killAll("SIGTERM"); setTimeout(() => process.exit(0), 3000); });

// Give the OS 400 ms to recycle ports after the kills above
setTimeout(launch, 400);

function launch() {
  // 1. dev-proxy (HTTP reverse-proxy on PORT → Metro or API)
  const proxy = spawn("node", ["scripts/dev-proxy.js"], {
    cwd:   ROOT,
    env:   { ...process.env, PORT: String(PORT), METRO_PORT: String(METRO_PORT) },
    stdio: "inherit",
    // Do NOT set detached:true — keep in the same process group
  });
  children.push(proxy);
  proxy.on("exit", code => {
    console.log(`[start] dev-proxy exited (code ${code})`);
    children.splice(children.indexOf(proxy), 1);
  });

  // 2. Expo / Metro (after 600 ms so dev-proxy finishes binding first)
  setTimeout(() => {
    const expo = spawn(
      "pnpm",
      ["exec", "expo", "start",
       "--localhost",
       "--port", String(METRO_PORT),
       "--clear",
      ],
      {
        cwd:  ROOT,
        env:  {
          ...process.env,
          // Run Metro anonymously — the "Proceed anonymously" prompt appears
          // in the console but Metro still serves bundles behind it.
          // Do NOT set CI=1 (causes hard crash when no token is present).
          // Do NOT pass the real EXPO_TOKEN if it may be expired.
          EXPO_TOKEN:                     "",
          EXPO_NO_DOCTOR:                 "1",
          EXPO_PUBLIC_API_URL:            API_BASE,
          EXPO_PUBLIC_DOMAIN:             process.env.REPLIT_DEV_DOMAIN  || "",
          EXPO_PUBLIC_REPL_ID:            process.env.REPL_ID            || "",
          EXPO_PACKAGER_PROXY_URL:        API_BASE,
          REACT_NATIVE_PACKAGER_HOSTNAME: process.env.REPLIT_EXPO_DEV_DOMAIN || "",
        },
        stdio: "inherit",
      }
    );
    children.push(expo);
    expo.on("exit", code => {
      console.log(`[start] expo exited (code ${code}) — shutting down`);
      killAll("SIGTERM");
      setTimeout(() => process.exit(code || 0), 3000);
    });
  }, 600);
}
