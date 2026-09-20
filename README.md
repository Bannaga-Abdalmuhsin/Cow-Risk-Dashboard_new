# Predictive Site Energy & Environmental Performance Digital Twin

An ACES/STC operational decision-support tool for modelling COW site energy demand, environmental stress and infrastructure resilience before customer impact occurs.

## Current capabilities

- Portfolio health, energy and estimated CO2 overview
- Per-site engineering digital twin
- 24-hour demand and ambient-temperature projection
- What-if simulation for temperature, telecom traffic and grid availability
- Predicted diesel demand and carbon output
- Power, cooling, rectifier and battery headroom analysis
- Four operational stress scenarios
- Geographic risk view and searchable site portfolio
- Transparent model and planned live-data contract

The current forecast is deterministic and uses validated asset/nameplate inputs. It is intentionally labelled as an engineering model. Supabase telemetry, weather, alarms, fuel transactions and maintenance history can later calibrate the model and enable anomaly detection.

## Web application

The production web client is in `artifacts/hajj-dashboard` (the historical package name is retained to avoid disrupting the workspace build).

```bash
corepack enable
pnpm install
pnpm --filter @workspace/hajj-dashboard typecheck
pnpm --filter @workspace/hajj-dashboard build:github
```

## Main modules

| Module | Purpose |
| --- | --- |
| Portfolio Overview | Network KPIs, modeled energy, CO2 and risk distribution |
| Digital Twin | Site selection, operating forecast and what-if simulation |
| Scenario Lab | S1-S4 stress testing and affected-site drill-down |
| Geo Risk | Map-based risk visualization and site inspection |
| Site Portfolio | Searchable site inventory and engineering detail |
| Model & Data | Methodology, limitations and integration contract |

## Planned Supabase data domains

`site_assets`, `telemetry_readings`, `weather_observations`, `generator_runtime`, `fuel_transactions`, `alarm_events`, `maintenance_actions`, and `model_predictions`.

## Deployment

GitHub Actions builds the Vite application and publishes `artifacts/hajj-dashboard/dist` to GitHub Pages on updates to `main`.

## Model governance

Forecast outputs support engineering prioritization. They should be calibrated against live measurements and must not be used for autonomous switching or other control actions without approved operational safeguards.
