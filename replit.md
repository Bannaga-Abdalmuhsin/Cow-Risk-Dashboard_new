# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## EAS Mobile Builds (ACES Field Team Tracker)

### One-command release

Use the release script to build Android APK + iOS IPA and submit to the stores in a single step:

```bash
export EXPO_TOKEN="<your-robot-token>"
bash artifacts/team-tracker/scripts/release.sh
```

- Runs both builds sequentially and streams all EAS output to the terminal.
- Saves the full log (including build URLs) to `artifacts/team-tracker/build-logs/release-<timestamp>.log`.
- Fails fast if `EXPO_TOKEN` is not set.

### Manual commands (individual platforms)

```bash
cd ~/workspace/artifacts/team-tracker
export EXPO_TOKEN="<your-robot-token>"
eas build --platform android --profile preview --non-interactive   # APK
eas build --platform ios --profile production --non-interactive --auto-submit  # IPA
```

### Why these non-obvious settings exist

| File | Setting | Reason |
|------|---------|--------|
| `.easignore` (root) | excludes `.local`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` | EAS reads `.easignore` from the **git root** (not `artifacts/team-tracker/`). Without this, EAS copies the 805 MB pnpm content store into `/tmp` and hits disk quota (error -122). It also strips the pnpm workspace config so the EAS build server installs only `team-tracker` deps, not the whole monorepo. |
| `artifacts/team-tracker/eas.json` | no `"node"`/`"pnpm"` version fields | Specifying `"pnpm"` forced the build server to run `pnpm install`, which found the monorepo `pnpm-lock.yaml` and tried to install all workspace packages — failing because other packages were absent. Auto-detection uses npm + `package-lock.json` instead. |
| `artifacts/team-tracker/package-lock.json` | standalone npm lockfile | Required so EAS build server has a deterministic install. Must be regenerated from a **clean directory** (no `node_modules` present) — regenerating inside the workspace produces 47 `"link": true` pnpm-store entries that break cloud installs. |
| `artifacts/team-tracker/.npmrc` | `legacy-peer-deps=true` | React Native 0.81 + Expo SDK 54 have peer-dep conflicts that cause `npm install` to fail without this flag. |

## Artifacts

### Hajj Telecom COW Risk Dashboard (`artifacts/hajj-dashboard`)

- **Preview Path**: `/`
- **Type**: React + Vite (frontend-only, no backend)
- **Description**: Interactive risk monitoring dashboard for 94 Nokia telecom COW sites deployed during Hajj 1447
- **Key files**:
  - `src/lib/calculations.ts` — Engineering calculation engine (9 scenario simulation, power/cooling/battery/rectifier risk)
  - `src/lib/siteData.ts` — Generates 94 realistic site configurations across 7 locations
  - `src/pages/Dashboard.tsx` — Main dashboard with 4 tabs: Overview, Geographic Map, Site List, Field Ops
  - `src/components/SiteMap.tsx` — SVG-based geographic site map
  - `src/components/SiteDetailPanel.tsx` — Per-site scenario analysis panel
  - `src/components/RiskCharts.tsx` — Recharts pie/bar charts for risk distribution
  - `src/components/SiteTable.tsx` — Filterable site table
  - `src/components/TechnicianRecommendation.tsx` — Field technician deployment plan

### Engineering Model
- Operating conditions: 46°C extreme heat, 100% traffic load
- Generator: PF=0.8, Alt Eff=87%, Risk=90%, 3%/yr degradation
- Cooling: T3=46°C derating factor 0.833, COP=3.5, 1.5%/yr degradation
- Battery: 50V DC, Lead-acid DoD=50%/0.85C, Lithium DoD=85%/1C
- 9 scenarios: Prime/Backup/Outage × AC1/AC1+AC2/None × Charged/Charging/Discharging
- Risk categories: Power, Cooling, Battery, Rectifier — each classified Safe/Warning/Critical
