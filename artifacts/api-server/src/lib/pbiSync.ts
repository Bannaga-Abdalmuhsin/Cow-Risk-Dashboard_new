import { eq, isNull } from "drizzle-orm";
import { db, faultsTable } from "@workspace/db";
import { logger } from "./logger.js";

// ── Fallback GPS lookup — CWN site coords from the Hajj 1447 roster ───────────
const SITE_COORDS: Record<string, { lat: number; lng: number }> = {
  CWN960: { lat: 21.347135,  lng: 39.992573  }, CWN072: { lat: 21.34196,   lng: 39.97602   },
  CWN922: { lat: 21.404058,  lng: 39.916064  }, CWN970: { lat: 21.409075,  lng: 39.905872  },
  CWN992: { lat: 21.389249,  lng: 39.906895  }, CWN021: { lat: 21.3934192, lng: 39.9166466 },
  CWN997: { lat: 21.38314,   lng: 39.904478  }, CWN008: { lat: 21.3513851, lng: 39.9812917 },
  CWN906: { lat: 21.37625,   lng: 39.98233   }, CWN213: { lat: 21.3645,    lng: 39.9082    },
  CWN074: { lat: 21.388397,  lng: 39.90236   }, CWN068: { lat: 21.39217,   lng: 39.91244   },
  CWN212: { lat: 21.366124,  lng: 39.984126  }, CWN300: { lat: 21.386604,  lng: 39.897081  },
  CWN214: { lat: 21.39194,   lng: 39.903738  }, CWN073: { lat: 21.3738433, lng: 39.9865483 },
  CWN996: { lat: 21.374231,  lng: 39.980616  }, CWN923: { lat: 21.361257,  lng: 39.973944  },
  CWN002: { lat: 21.42045,   lng: 39.87142   }, CWN998: { lat: 21.647214,  lng: 40.389186  },
  CWN203: { lat: 21.354658,  lng: 39.986218  }, CWN961: { lat: 21.398381,  lng: 39.89731   },
  CWN066: { lat: 21.3905912, lng: 39.9199632 }, CWN777: { lat: 21.395908,  lng: 39.899677  },
  CWN105: { lat: 21.356535,  lng: 39.984813  }, CWN984: { lat: 21.348754,  lng: 39.995701  },
  CWN967: { lat: 21.631015,  lng: 40.427249  }, CWN020: { lat: 21.35047,   lng: 39.96813   },
  CWN004: { lat: 21.387678,  lng: 39.896187  }, CWN211: { lat: 21.386633,  lng: 39.911309  },
  CWN050: { lat: 21.38536,   lng: 40.00519   }, CWN084: { lat: 21.342528,  lng: 39.962167  },
  CWN301: { lat: 21.386942,  lng: 39.89955   }, CWN201: { lat: 21.4206848, lng: 39.8809927 },
  CWN208: { lat: 21.402445,  lng: 39.916322  }, CWN001: { lat: 21.33728,   lng: 39.957769  },
  CWN080: { lat: 21.378152,  lng: 39.990098  }, CWN078: { lat: 21.34051,   lng: 39.99548   },
  CWN075: { lat: 21.346996,  lng: 39.957369  }, CWN087: { lat: 21.35694,   lng: 39.97782   },
  CWN085: { lat: 21.36681,   lng: 39.96439   }, CWN089: { lat: 21.384184,  lng: 39.910808  },
  CWN076: { lat: 21.3692,    lng: 39.977127  }, CWN955: { lat: 21.389818,  lng: 39.897434  },
  CWN081: { lat: 20.99354,   lng: 39.58815   }, CWN083: { lat: 21.331372,  lng: 39.965547  },
  CWN108: { lat: 21.34916,   lng: 39.98367   }, CWN036: { lat: 21.37989,   lng: 39.944133  },
  CWN994: { lat: 21.42346,   lng: 39.89534   }, CWN951: { lat: 21.36258,   lng: 39.96906   },
  CWN956: { lat: 21.3704107, lng: 39.9854222 }, CWN202: { lat: 21.397049,  lng: 39.903512  },
  CWN901: { lat: 21.372652,  lng: 39.989533  }, CWN914: { lat: 21.365421,  lng: 39.971661  },
  CWN953: { lat: 21.418835,  lng: 39.892713  }, CWN976: { lat: 21.40275,   lng: 39.89751   },
  CWN980: { lat: 21.371837,  lng: 39.985979  }, CWN978: { lat: 21.421776,  lng: 39.891894  },
  CWN015: { lat: 21.377645,  lng: 39.986816  }, CWN959: { lat: 21.417782,  lng: 39.910356  },
  CWN991: { lat: 21.37224,   lng: 39.93826   }, CWN915: { lat: 21.383061,  lng: 39.925555  },
  CWN101: { lat: 21.388356,  lng: 39.927744  }, CWN093: { lat: 21.3568,    lng: 39.93535   },
  CWN104: { lat: 21.376644,  lng: 39.918992  }, CWN972: { lat: 21.360682,  lng: 39.916155  },
  CWN032: { lat: 21.3599709, lng: 39.9122733 }, CWN079: { lat: 21.3615,    lng: 39.9179    },
  CWN903: { lat: 21.359944,  lng: 39.947977  }, CWN102: { lat: 21.364592,  lng: 39.905877  },
  CWN022: { lat: 21.335685,  lng: 39.989205  }, CWN205: { lat: 21.396241,  lng: 39.914628  },
  CWN062: { lat: 21.3818,    lng: 39.89885   }, CWN038: { lat: 21.328514,  lng: 39.961343  },
  CWN907: { lat: 21.4011089, lng: 39.9086724 }, CWN099: { lat: 21.369688,  lng: 39.901264  },
  CWN092: { lat: 21.333244,  lng: 39.971526  }, CWN206: { lat: 21.390274,  lng: 39.928265  },
};

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PbiTicket {
  ttId:        string;
  cowId:       string;
  alarmName:   string;
  severity:    string;
  siteLat:     number;
  siteLng:     number;
  location:    string | null;
  powerSource: string | null;
  source:      "power" | "sir";
}

export interface SyncResult {
  syncedAt:   string;
  pbiCount:   number;
  powerCount: number;
  sirCount:   number;
  upserted:   number;
  closed:     number;
  errors:     string[];
  ok:         boolean;
}

let lastSyncResult: SyncResult | null = null;
let syncInProgress   = false;

export function getLastSyncResult(): SyncResult | null {
  return lastSyncResult;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// PBI executeQueries returns column keys like "'Table Name'[Column Name]"
// Strip the table prefix and normalise to bare lowercase alphanum for matching.

function bareKey(k: string): string {
  return k.replace(/^[^[]*\[(.+)\]$/, "$1").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function col(row: Record<string, unknown>, ...names: string[]): unknown {
  const needles = names.map(n => n.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [k, v] of Object.entries(row)) {
    if (needles.includes(bareKey(k))) return v;
  }
  return undefined;
}

function str(v: unknown): string { return v == null ? "" : String(v).trim(); }

// ── Row mapper — shared columns: TT Number, Site ID, Status, Alarm Description,
//                                Created Date, foStaff, Owner
//   Input Record extra: Subcontractor
//   SIR extra: Area

// Input Record columns (exact): TT Number, SITE ID, Problem Description,
//   TT Severity, Power Source, Region, District, Status, FO Staff, SubCon, Owner (Responsible)
// SIR columns (exact): TT Number, Site, Alarms Description,
//   TT Severity, Power source, Area, Status, FO Staff, Subcon, Owner, Fault Type

function mapRow(row: Record<string, unknown>, source: "power" | "sir"): PbiTicket | null {
  // ── TT Number ──
  const ttId = str(col(row, "TT Number", "TTNumber", "TT ID", "TTID"));
  if (!ttId) return null;

  // ── Site ID — Input Record uses "SITE ID", SIR uses "Site" ──
  const rawSiteId = source === "power"
    ? str(col(row, "SITE ID", "SiteID", "Site ID", "Site"))
    : str(col(row, "Site", "SITE ID", "Site ID"));

  // Extract CWN### from values like "CWN960" or "WR-HAJJ-CWN960"
  const cwnMatch = rawSiteId.match(/CWN\d{3}/i);
  const cowId    = (cwnMatch ? cwnMatch[0] : rawSiteId).toUpperCase();
  if (!cowId) return null;

  // ── Alarm / problem description ──
  const alarmName = source === "power"
    ? str(col(row, "Problem Description", "Issue", "SUMMARY", "Alarm Description")) || "Power Fault"
    : str(col(row, "Alarms Description", "Fault Type", "SUMMARY", "Problem Description")) || "Telecom Fault";

  // ── Severity — "TT Severity" on both tables: High/Medium/Low/Critical ──
  const rawSev  = str(col(row, "TT Severity", "Severity", "Priority")).toLowerCase();
  const severity = rawSev === "high" || rawSev === "critical" ? "critical"
                 : rawSev === "medium"                        ? "major"
                 : rawSev === "low"                           ? "minor"
                 : "major";

  // ── Location ──
  // Input Record: District or Region; SIR: Area
  const location = source === "power"
    ? str(col(row, "District", "Region", "Area")) || null
    : str(col(row, "Area", "Region", "District")) || null;

  // ── Power source ──
  const powerSource = str(col(row, "Power Source", "Power source", "PowerSource")) || null;

  // ── GPS — look up from the site coordinate table ──
  const tryKeys = [
    ...rawSiteId.toUpperCase().match(/CWN\d{3}/gi) ?? [],
    cowId.replace(/[^A-Z0-9]/g, ""),
  ];
  let coords: { lat: number; lng: number } | undefined;
  for (const k of tryKeys) {
    coords = SITE_COORDS[k];
    if (coords) break;
  }
  if (!coords) return null;

  return {
    ttId,
    cowId,
    alarmName,
    severity,
    siteLat:     coords.lat,
    siteLng:     coords.lng,
    location,
    powerSource,
    source,
  };
}

// ── Azure AD OAuth (client credentials, token cached until near expiry) ────────

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAzureToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const tenantId     = process.env.PBI_TENANT_ID;
  const clientId     = process.env.PBI_CLIENT_ID;
  const clientSecret = process.env.PBI_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("PBI_TENANT_ID, PBI_CLIENT_ID, PBI_CLIENT_SECRET must be set");
  }

  const resp = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    new URLSearchParams({
        grant_type:    "client_credentials",
        client_id:     clientId,
        client_secret: clientSecret,
        scope:         "https://analysis.windows.net/powerbi/api/.default",
      }).toString(),
    },
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Azure AD token failed (${resp.status}): ${txt}`);
  }

  const data = await resp.json() as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return tokenCache.token;
}

// ── Single PBI table query ────────────────────────────────────────────────────

async function queryTable(
  token: string,
  workspaceId: string,
  datasetId: string,
  dax: string,
): Promise<Record<string, unknown>[]> {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/executeQueries`;

  const resp = await fetch(url, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify({
      queries:            [{ query: dax }],
      serializerSettings: { includeNulls: true },
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`PBI executeQueries failed (${resp.status}): ${txt}`);
  }

  type PbiResp = { results?: Array<{ tables?: Array<{ rows?: Record<string, unknown>[] }> }> };
  const data = await resp.json() as PbiResp;
  return data.results?.[0]?.tables?.[0]?.rows ?? [];
}

// ── Fetch both tables in parallel ─────────────────────────────────────────────
// "Input Record" = open power trouble tickets (source of truth for COW dashboard)
// "SIR"          = open Telecom / NSA trouble tickets
// Both filtered to non-Closed status.

async function fetchPbiTickets(): Promise<{ tickets: PbiTicket[]; powerCount: number; sirCount: number }> {
  const token       = await getAzureToken();
  const workspaceId = process.env.PBI_WORKSPACE_ID!;
  const datasetId   = process.env.PBI_DATASET_ID!;

  // Filter to Hajj region (WR-HAJJ) + non-Closed status only.
  // "Input Record"[Region] = "WR-HAJJ"; SIR[Region] = "WR-HAJJ"
  const [powerRows, sirRows] = await Promise.all([
    queryTable(
      token, workspaceId, datasetId,
      "EVALUATE FILTER('Input Record', 'Input Record'[Status] <> \"Closed\" && 'Input Record'[Region] = \"WR-HAJJ\")",
    ),
    queryTable(
      token, workspaceId, datasetId,
      "EVALUATE FILTER('SIR', 'SIR'[Status] <> \"Closed\" && 'SIR'[Region] = \"WR-HAJJ\")",
    ),
  ]);

  const tickets: PbiTicket[] = [];

  for (const row of powerRows) {
    const t = mapRow(row, "power");
    if (t) tickets.push(t);
  }
  for (const row of sirRows) {
    const t = mapRow(row, "sir");
    if (t) tickets.push(t);
  }

  return { tickets, powerCount: powerRows.length, sirCount: sirRows.length };
}

// ── Probe: return raw column names + first row from both tables (debug only) ──

export async function probeColumns(): Promise<{
  inputRecord: { columns: string[]; openRows: Record<string, unknown>[] };
  sir:         { columns: string[]; openRows: Record<string, unknown>[] };
}> {
  const token       = await getAzureToken();
  const workspaceId = process.env.PBI_WORKSPACE_ID!;
  const datasetId   = process.env.PBI_DATASET_ID!;

  // Fetch all open rows from both tables (no TOPN limit)
  const [powerRows, sirRows] = await Promise.all([
    queryTable(token, workspaceId, datasetId,
      "EVALUATE SELECTCOLUMNS(FILTER('Input Record', 'Input Record'[Status] <> \"Closed\"), \"TT\", 'Input Record'[TT Number], \"SITEID\", 'Input Record'[SITE ID], \"Status\", 'Input Record'[Status], \"Sev\", 'Input Record'[TT Severity], \"Region\", 'Input Record'[Region])"),
    queryTable(token, workspaceId, datasetId,
      "EVALUATE SELECTCOLUMNS(FILTER('SIR', 'SIR'[Status] <> \"Closed\"), \"TT\", 'SIR'[TT Number], \"Site\", 'SIR'[Site], \"Status\", 'SIR'[Status], \"Sev\", 'SIR'[TT Severity], \"Region\", 'SIR'[Region])"),
  ]);

  return {
    inputRecord: { columns: powerRows[0] ? Object.keys(powerRows[0]) : [], openRows: powerRows },
    sir:         { columns: sirRows[0]   ? Object.keys(sirRows[0])   : [], openRows: sirRows.slice(0, 10) },
  };
}

// ── Main sync ─────────────────────────────────────────────────────────────────

export async function syncPbiToDb(): Promise<SyncResult> {
  // Prevent two concurrent syncs — if one is already running, return its last result.
  if (syncInProgress) {
    return lastSyncResult ?? {
      syncedAt: new Date().toISOString(), pbiCount: 0, powerCount: 0,
      sirCount: 0, upserted: 0, closed: 0, errors: ["Sync already in progress"], ok: false,
    };
  }
  syncInProgress = true;

  const errors: string[] = [];
  let upserted    = 0;
  let closed      = 0;
  let pbiCount    = 0;
  let powerCount  = 0;
  let sirCount    = 0;

  try {
    const result = await fetchPbiTickets();
    pbiCount   = result.tickets.length;
    powerCount = result.powerCount;
    sirCount   = result.sirCount;

    const pbiTtIds = new Set(result.tickets.map(t => t.ttId));

    // Open faults currently in DB (only those that came from PBI — apiKey = "pbi-sync")
    const openFaults = await db
      .select({ id: faultsTable.id, ttId: faultsTable.ttId })
      .from(faultsTable)
      .where(isNull(faultsTable.resolvedAt));

    const dbOpenTtIds = new Set(openFaults.map(f => f.ttId));

    // 1. Insert PBI tickets not yet in DB
    for (const ticket of result.tickets) {
      if (dbOpenTtIds.has(ticket.ttId)) continue;
      try {
        await db.insert(faultsTable).values({
          ttId:           ticket.ttId,
          cowId:          ticket.cowId,
          alarmName:      ticket.alarmName,
          severity:       ticket.severity,
          siteLat:        ticket.siteLat,
          siteLng:        ticket.siteLng,
          location:       ticket.location,
          powerSource:    ticket.powerSource,
          dispatchStatus: "new",
          apiKey:         `pbi-sync:${ticket.source}`,
        });
        upserted++;
        logger.info({ ttId: ticket.ttId, cowId: ticket.cowId, source: ticket.source }, "PBI: new ticket inserted");
      } catch (err) {
        // Unique-constraint violation means another concurrent sync already inserted it — silently skip.
        const msg = String(err);
        if (msg.includes("unique") || msg.includes("duplicate") || msg.includes("23505")) {
          logger.info({ ttId: ticket.ttId }, "PBI: skipping duplicate insert (already exists)");
        } else {
          errors.push(`insert ${ticket.ttId}: ${msg}`);
        }
      }
    }

    // 2. Auto-close DB faults whose ttId is no longer in PBI
    for (const fault of openFaults) {
      if (pbiTtIds.has(fault.ttId)) continue;
      try {
        await db
          .update(faultsTable)
          .set({ dispatchStatus: "closed", resolvedAt: new Date() })
          .where(eq(faultsTable.id, fault.id));
        closed++;
        logger.info({ ttId: fault.ttId }, "PBI: ticket auto-closed (absent from PBI)");
      } catch (err) {
        errors.push(`close ${fault.ttId}: ${String(err)}`);
      }
    }

  } catch (err) {
    errors.push(String(err));
    logger.warn({ err }, "PBI sync error");
  } finally {
    syncInProgress = false;
  }

  const syncResult: SyncResult = {
    syncedAt:   new Date().toISOString(),
    pbiCount,
    powerCount,
    sirCount,
    upserted,
    closed,
    errors,
    ok:         errors.length === 0,
  };

  lastSyncResult = syncResult;

  if (errors.length > 0) {
    logger.warn({ errors }, "PBI sync finished with errors");
  } else {
    logger.info({ pbiCount, powerCount, sirCount, upserted, closed }, "PBI sync OK");
  }

  return syncResult;
}
