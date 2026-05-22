/**
 * ACES WebSocket client — foreground location streaming
 *
 * Architecture:
 *  - Singleton that holds one authenticated WS connection to /api/team/ws
 *  - connect(token) → auth handshake → connected
 *  - sendLocation(payload) → { type: "location", ...payload } — 25m accuracy filter applied client-side
 *  - Auto-reconnects with exponential back-off (1s → 30s max) unless disconnect() called
 *  - Ping every 20s to keep connection alive through mobile NAT
 *  - Background tasks use HTTP PUT (can't use WS from TaskManager) — wsClient is foreground-only
 */

const API_BASE =
  (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/$/, "") ||
  "https://4a3b2adb-54bb-4c8a-a7b7-fee922024ba6-00-25arfy9uinng9.picard.replit.dev";

function toWsUrl(base: string): string {
  return base.replace(/^https?/, s => (s === "https" ? "wss" : "ws")) + "/api/team/ws";
}

export interface WsLocationPayload {
  lat:      number;
  lng:      number;
  accuracy?: number | null;
  speed?:    number | null;
  heading?:  number | null;
  area?:     string | null;
  isOnDuty?: boolean;
}

type State = "disconnected" | "connecting" | "authenticating" | "connected" | "reconnecting";

class WsClient {
  private ws:               WebSocket | null = null;
  private token:            string | null    = null;
  private state:            State            = "disconnected";
  private dead              = false;
  private reconnectDelay    = 1_000;
  private reconnectTimer:   ReturnType<typeof setTimeout>  | null = null;
  private pingTimer:        ReturnType<typeof setInterval> | null = null;

  /* ── Public API ──────────────────────────────────────────────────────────── */

  /**
   * Connect (or reconnect) with the given auth token.
   * Safe to call multiple times — no-op if already connected with the same token.
   */
  connect(token: string): void {
    if (!this.dead && this.state === "connected" && this.token === token) return;
    this.token = token;
    this.dead  = false;
    this._open();
  }

  /** Clean shutdown — stops reconnect loop. */
  disconnect(): void {
    this.dead  = true;
    this.token = null;
    this.state = "disconnected";
    this._clearTimers();
    if (this.ws) { try { this.ws.close(); } catch {} this.ws = null; }
  }

  /**
   * Send a location event via WS.
   * Returns `true` if the message was queued on an open, authenticated socket.
   * Returns `false` if not connected (caller should fall back to HTTP PUT).
   * Applies the 25m accuracy filter client-side — noisy readings return `false`.
   */
  sendLocation(payload: WsLocationPayload): boolean {
    if (this.state !== "connected" || !this.ws) return false;
    if (payload.accuracy != null && payload.accuracy > 25) return false;
    try {
      this.ws.send(JSON.stringify({ type: "location", ...payload }));
      return true;
    } catch {
      return false;
    }
  }

  /** True when the socket is authenticated and ready. */
  isConnected(): boolean {
    return this.state === "connected";
  }

  /* ── Private helpers ─────────────────────────────────────────────────────── */

  private _open(): void {
    if (this.dead || !this.token) return;
    this._clearTimers();
    this.state = "connecting";

    let ws: WebSocket;
    try {
      ws = new WebSocket(toWsUrl(API_BASE));
    } catch {
      this._scheduleReconnect();
      return;
    }
    this.ws = ws;

    ws.onopen = () => {
      this.state = "authenticating";
      ws.send(JSON.stringify({ type: "auth", token: this.token! }));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(typeof e.data === "string" ? e.data : "{}") as { type: string };
        if (msg.type === "auth_ok") {
          this.state         = "connected";
          this.reconnectDelay = 1_000; // reset back-off on successful auth
          this._startPing();
          console.log("[WsClient] connected and authenticated");
        } else if (msg.type === "auth_error") {
          console.warn("[WsClient] auth rejected — stopping reconnect");
          this.dead  = true;
          this.state = "disconnected";
          ws.close();
        }
      } catch {}
    };

    ws.onclose = () => {
      this.ws = null;
      this._clearTimers();
      if (!this.dead) {
        this.state = "reconnecting";
        this._scheduleReconnect();
      } else {
        this.state = "disconnected";
      }
    };

    ws.onerror = () => { try { ws.close(); } catch {} };
  }

  private _scheduleReconnect(): void {
    if (this.dead) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
      this._open();
    }, this.reconnectDelay);
  }

  private _startPing(): void {
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify({ type: "ping" })); } catch {}
      }
    }, 20_000);
  }

  private _clearTimers(): void {
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer);  this.reconnectTimer = null; }
    if (this.pingTimer)      { clearInterval(this.pingTimer);      this.pingTimer      = null; }
  }
}

/** Singleton instance — import and use directly. */
export const wsClient = new WsClient();
