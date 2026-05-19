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
