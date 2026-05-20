import { eq, isNull } from "drizzle-orm";
import { db, faultsTable } from "@workspace/db";
import { logger } from "./logger.js";

// ── Fallback GPS lookup (used when PBI rows have no lat/lng columns) ──────────
// Coordinates sourced from the real Hajj 1447 deployment roster TSV
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
}

export interface SyncResult {
  syncedAt:  string;   // ISO string (JSON-safe)
  pbiCount:  number;
  upserted:  number;
  closed:    number;
  errors:    string[];
  ok:        boolean;
}

let lastSyncResult: SyncResult | null = null;

export function getLastSyncResult(): SyncResult | null {
  return lastSyncResult;
}

// ── Column-name resolver ───────────────────────────────────────────────────────
// PBI returns keys like "'TableName'[ColumnName]" — normalise to bare alphanumeric
// then match case-insensitively against candidate names.

function col(row: Record<string, unknown>, ...names: string[]): unknown {
  const needles = names.map(n => n.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [k, v] of Object.entries(row)) {
    const bare = k.replace(/^[^[]*\[(.+)\]$/, "$1").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (needles.includes(bare)) return v;
  }
  return undefined;
}

function str(v: unknown): string {
  return v == null ? "" : String(v).trim();
}

function num(v: unknown): number | null {
  if (v == null) return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : n;
}

function mapRow(row: Record<string, unknown>): PbiTicket | null {
  const ttId = str(col(row,
    "TT ID", "TTID", "tt_id", "Ticket Number", "TicketNumber", "TicketId", "Ticket ID",
    "FaultId", "Fault ID", "ID", "Number",
  ));

  const cowId = str(col(row,
    "COW ID", "COWID", "cow_id", "NE Name", "NEName", "Node Name", "NodeName",
    "NodeId", "Node ID", "Site ID", "SiteId", "Site Name", "SiteName", "NE", "Element",
  ));

  const alarmName = str(col(row,
    "Alarm Name", "AlarmName", "alarm_name", "Fault Type", "FaultType",
    "Alarm Type", "AlarmType", "Description", "Problem", "Alarm",
  )) || "Unknown Alarm";

  const severity = str(col(row,
    "Severity", "severity", "Priority", "priority", "Impact", "Level",
  )).toLowerCase() || "major";

  const location    = str(col(row, "Location", "location", "Area", "Zone", "Region", "District")) || null;
  const powerSource = str(col(row, "Power Source", "PowerSource", "Power Type", "PowerType", "power_source")) || null;

  if (!ttId || !cowId) return null;

  // Try lat/lng from PBI first, fall back to the site coordinate table
  let siteLat = num(col(row, "Latitude", "latitude", "Lat", "lat", "Site Lat", "SiteLat", "Y"));
  let siteLng = num(col(row, "Longitude", "longitude", "Long", "Lng", "lng", "Site Lng", "SiteLng", "X"));

  if (!siteLat || !siteLng || siteLat === 0 || siteLng === 0) {
    const key = cowId.replace(/[-_ ]/g, "").toUpperCase();
    const fb  = SITE_COORDS[key];
    if (fb) { siteLat = fb.lat; siteLng = fb.lng; }
  }

  if (!siteLat || !siteLng) return null;

  return { ttId, cowId, alarmName, severity, siteLat, siteLng, location, powerSource };
}

// ── Azure AD OAuth (client credentials, cached) ───────────────────────────────

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAzureToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const tenantId     = process.env.PBI_TENANT_ID;
  const clientId     = process.env.PBI_CLIENT_ID;
  const clientSecret = process.env.PBI_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("PBI_TENANT_ID, PBI_CLIENT_ID and PBI_CLIENT_SECRET must be set");
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

// ── PBI Dataset query ─────────────────────────────────────────────────────────
// Default DAX returns every row of the "Open TTs" table.
// Override with PBI_DAX_QUERY env var if your table has a different name,
// e.g.  EVALUATE FILTER('Tickets', 'Tickets'[Status] = "Open")

async function fetchPbiTickets(): Promise<PbiTicket[]> {
  const token       = await getAzureToken();
  const workspaceId = process.env.PBI_WORKSPACE_ID;
  const datasetId   = process.env.PBI_DATASET_ID;
  const daxQuery    = process.env.PBI_DAX_QUERY ?? "EVALUATE 'Open TTs'";

  if (!workspaceId || !datasetId) {
    throw new Error("PBI_WORKSPACE_ID and PBI_DATASET_ID must be set");
  }

  const url = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/executeQueries`;

  const resp = await fetch(url, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body:    JSON.stringify({
      queries:            [{ query: daxQuery }],
      serializerSettings: { includeNulls: true },
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`PBI executeQueries failed (${resp.status}): ${txt}`);
  }

  type PbiResp = { results?: Array<{ tables?: Array<{ rows?: Record<string, unknown>[] }> }> };
  const data = await resp.json() as PbiResp;
  const rows = data.results?.[0]?.tables?.[0]?.rows ?? [];

  const tickets: PbiTicket[] = [];
  for (const row of rows) {
    const t = mapRow(row);
    if (t) tickets.push(t);
  }
  return tickets;
}

// ── Main sync ─────────────────────────────────────────────────────────────────

export async function syncPbiToDb(): Promise<SyncResult> {
  const errors: string[] = [];
  let upserted = 0;
  let closed   = 0;
  let pbiCount = 0;

  try {
    const pbiTickets = await fetchPbiTickets();
    pbiCount = pbiTickets.length;

    const pbiTtIds = new Set(pbiTickets.map(t => t.ttId));

    // Open faults currently in DB
    const openFaults = await db
      .select({ id: faultsTable.id, ttId: faultsTable.ttId })
      .from(faultsTable)
      .where(isNull(faultsTable.resolvedAt));

    const dbOpenTtIds = new Set(openFaults.map(f => f.ttId));

    // 1. Insert tickets from PBI that are not yet in DB
    for (const ticket of pbiTickets) {
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
          apiKey:         "pbi-sync",
        });
        upserted++;
        logger.info({ ttId: ticket.ttId, cowId: ticket.cowId }, "PBI: new ticket inserted");
      } catch (err) {
        errors.push(`insert ${ticket.ttId}: ${String(err)}`);
      }
    }

    // 2. Close DB faults whose ttId no longer appears in PBI
    for (const fault of openFaults) {
      if (pbiTtIds.has(fault.ttId)) continue;
      try {
        await db
          .update(faultsTable)
          .set({ dispatchStatus: "closed", resolvedAt: new Date() })
          .where(eq(faultsTable.id, fault.id));
        closed++;
        logger.info({ ttId: fault.ttId }, "PBI: ticket auto-closed (not in PBI)");
      } catch (err) {
        errors.push(`close ${fault.ttId}: ${String(err)}`);
      }
    }

  } catch (err) {
    errors.push(String(err));
    logger.warn({ err }, "PBI sync error");
  }

  const result: SyncResult = {
    syncedAt: new Date().toISOString(),
    pbiCount,
    upserted,
    closed,
    errors,
    ok: errors.length === 0,
  };

  lastSyncResult = result;

  if (errors.length > 0) {
    logger.warn({ errors }, "PBI sync finished with errors");
  } else {
    logger.info({ pbiCount, upserted, closed }, "PBI sync OK");
  }

  return result;
}
