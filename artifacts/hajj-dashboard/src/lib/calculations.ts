// ─── Constants ────────────────────────────────────────────────────────────────
const POWER_FACTOR            = 0.8;
const ALTERNATOR_EFFICIENCY   = 0.87;
const GENERATOR_RISK_FACTOR   = 0.9;
const ANNUAL_GEN_DEGRADATION  = 0.03;   // 3% per year
const COOLING_ADJUSTMENT      = 0.83;   // T3 climate derating
const COP                     = 3.5;    // AC coefficient of performance
const BTU_PER_KW              = 3412;   // Btu/h per KW
const ANNUAL_AC_DEGRADATION   = 0.015;  // 1.5% per year
const BATTERY_CAPACITY_V      = 50;     // V — used for Wh/KWh capacity
const BATTERY_OPERATING_V     = 48;     // V — used for current → power KW
const LEAD_ACID_DOD           = 0.5;    // 50% depth of discharge
const LITHIUM_DOD             = 0.85;
const LEAD_ACID_DISCHARGE_C   = 0.5;    // C-rate for max useful-time calc
const LITHIUM_DISCHARGE_C     = 0.8;
const LEAD_ACID_ANNUAL_DEG    = 0.20;   // 20% capacity loss per year
const LITHIUM_ANNUAL_DEG      = 0.10;
const BATT_CHARGE_RATE        = 0.05;   // effective charging C-rate (0.5/10)

// ─── Site Configuration ───────────────────────────────────────────────────────
export interface SiteConfig {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  siteType: "shelter" | "outdoor_cabinet";

  // SB = SEC + Backup Generator (S1-S4: prime SEC; S5-S8: backup gen)
  // SG = Single Generator only   (S1-S8: prime gen; backup = 0)
  // All types run S1–S9
  powerConfig: "single_generator" | "commercial_with_backup";
  placeholderSafe?: boolean;

  // Prime power source
  generatorKva: number;    // KVA  (SB: SEC_Amps × 0.5, age=0; SG: gen KVA)
  generatorAge: number;    // years
  secCapacityAmp?: number; // SEC meter capacity in Amps (SB sites only — for display)

  // Backup power (SB sites only)
  backupGeneratorKva?: number;
  backupGeneratorAge?: number;

  // Telecom loads
  telecomPowerKw: number;     // Total telecom KW — used for ALL power margin formulas
  telecomHeatKBtuH: number;   // Heat dissipation inside cooled space — directly from spreadsheet
                              //   column "Telecom load heat dissipation KBtu/h", stored as-is
                              //   Engine converts: KBtu/h × 1000 → Btu/h for cooling margin formula

  // Cooling
  ac1CapacityBtu: number;
  ac1Age: number;
  ac2CapacityBtu?: number;
  ac2Age?: number;

  // Batteries
  batteryCapacityAh: number;    // total = Ah_per_string × strings
  batteryType: "lead_acid" | "lithium";
  batteryAge: number;           // years

  // Rectifier
  rectifierCapacityKw: number;
}

// ─── Result Types ─────────────────────────────────────────────────────────────
export interface ScenarioResult {
  scenarioId: number;
  scenarioName: string;
  powerSource: "prime_sec" | "prime_gen" | "backup" | "outage";
  coolingConfig: "ac1_only" | "ac1_ac2" | "none";
  batteryState: "normal" | "charging" | "discharging";

  primePowerKw: number;
  backupPowerKw: number;
  rectifierNetKw: number;
  telecomPowerKw: number;
  telecomHeatBtu: number;
  ac1NetBtu: number;
  ac1NetPowerKw: number;
  ac2NetBtu: number;
  ac2NetPowerKw: number;
  batteryChargingKw: number;
  batteryUsefulHours: number;

  powerMarginKw: number;
  rectifierMarginKw: number;
  coolingMarginBtu: number;

  powerRisk: "safe" | "risk";
  rectifierRisk: "safe" | "risk";
  batteryRisk: "safe" | "risk";
  coolingRisk: "safe" | "risk";

  riskScore: number;
}

export interface SiteAnalysis {
  site: SiteConfig;
  scenarios: ScenarioResult[];
  overallRisk: "safe" | "risk";
  worstRiskScore: number;
  technicianNeeded: boolean;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────
function calcGeneratorNetPower(kva: number, age: number): number {
  return kva * POWER_FACTOR * ALTERNATOR_EFFICIENCY * GENERATOR_RISK_FACTOR
    * (1 - ANNUAL_GEN_DEGRADATION * age);
}

function calcAcNetBtu(capacityBtu: number, age: number): number {
  return capacityBtu * COOLING_ADJUSTMENT * (1 - ANNUAL_AC_DEGRADATION * age);
}

function calcAcPowerKw(netBtu: number): number {
  return netBtu / BTU_PER_KW / COP;
}

function calcBatteryChargingKw(totalAh: number): number {
  // Effective charge rate: LEAD_ACID_CHARGE_RATE (0.5) / 10 = 0.05
  return BATT_CHARGE_RATE * totalAh * BATTERY_OPERATING_V / 1000;
}

function calcBatteryUsefulHours(
  totalAh: number,
  type: "lead_acid" | "lithium",
  age: number
): number {
  const dod      = type === "lead_acid" ? LEAD_ACID_DOD      : LITHIUM_DOD;
  const cRate    = type === "lead_acid" ? LEAD_ACID_DISCHARGE_C : LITHIUM_DISCHARGE_C;
  const annDeg   = type === "lead_acid" ? LEAD_ACID_ANNUAL_DEG  : LITHIUM_ANNUAL_DEG;
  const ageFactor = Math.max(0, 1 - annDeg * age);
  // base hours = DOD / discharge_cRate (= 1.0 for lead-acid, 1.0625 for lithium)
  const baseHours = dod / cRate;
  return baseHours * ageFactor;
}

function riskFromMargin(
  margin: number,
  riskBelow: number,
  _unusedWarningBelow: number
): "safe" | "risk" {
  if (margin < riskBelow) return "risk";
  return "safe";
}

// ─── Scenario Engine ──────────────────────────────────────────────────────────
export function analyzeScenarios(site: SiteConfig): ScenarioResult[] {
  if (site.placeholderSafe) return [];

  // Pre-computed per-site values
  const primePowerKw  = calcGeneratorNetPower(site.generatorKva, site.generatorAge);
  const backupPowerKw = site.backupGeneratorKva
    ? calcGeneratorNetPower(site.backupGeneratorKva, site.backupGeneratorAge ?? 0)
    : 0;
  const rectNetKw     = site.rectifierCapacityKw;

  const ac1NetBtu    = calcAcNetBtu(site.ac1CapacityBtu, site.ac1Age);
  const ac1NetPwKw   = calcAcPowerKw(ac1NetBtu);
  const ac2NetBtu    = site.ac2CapacityBtu
    ? calcAcNetBtu(site.ac2CapacityBtu, site.ac2Age ?? 0) : 0;
  const ac2NetPwKw   = site.ac2CapacityBtu ? calcAcPowerKw(ac2NetBtu) : 0;

  const battChgKw    = calcBatteryChargingKw(site.batteryCapacityAh);
  const battHours    = calcBatteryUsefulHours(
    site.batteryCapacityAh, site.batteryType, site.batteryAge
  );

  const telecomPwKw  = site.telecomPowerKw;
  const telecomHeatBtu = site.telecomHeatKBtuH * 1000;   // KBtu/h → Btu/h

  const isSB = site.powerConfig === "commercial_with_backup";

  // ── Scenario definitions ────────────────────────────────────────────────────
  // SB/DG: S1-S4 use prime SEC; S5-S8 use backup gen
  // SG:    S1-S4 use prime gen (single gen IS the prime source, backup=0)
  //        S5-S8 also use prime gen (same source)
  // All sites run S1–S9
  type ScenarioDef = {
    id: number;
    name: string;
    pwSrc: "prime_sec" | "prime_gen" | "backup" | "outage";
    cooling: "ac1_only" | "ac1_ac2" | "none";
    battery: "normal" | "charging" | "discharging";
  };

  const allDefs: ScenarioDef[] = [
    { id: 1, name: "S1 — Prime Power / AC1 / Full Traffic Telecom Load",        pwSrc: isSB ? "prime_sec" : "prime_gen", cooling: "ac1_only", battery: "normal" },
    { id: 2, name: "S2 — Prime Power / AC1+AC2 / Full Traffic Telecom Load",    pwSrc: isSB ? "prime_sec" : "prime_gen", cooling: "ac1_ac2",  battery: "normal" },
    { id: 3, name: "S3 — Prime Power / AC1 / Charging",      pwSrc: isSB ? "prime_sec" : "prime_gen", cooling: "ac1_ac2",  battery: "charging" },
    { id: 4, name: "S4 — Prime Power / AC1+AC2 / Charging",  pwSrc: isSB ? "prime_sec" : "prime_gen", cooling: "ac1_ac2",  battery: "charging" },
    { id: 5, name: "S5 — Generator / AC1 / Full Traffic Telecom Load",          pwSrc: isSB ? "backup" : "prime_gen",    cooling: "ac1_only", battery: "normal" },
    { id: 6, name: "S6 — Generator / AC1+AC2 / Full Traffic Telecom Load",      pwSrc: isSB ? "backup" : "prime_gen",    cooling: "ac1_ac2",  battery: "normal" },
    { id: 7, name: "S7 — Generator / AC1 / Charging",        pwSrc: isSB ? "backup" : "prime_gen",    cooling: "ac1_ac2",  battery: "charging" },
    { id: 8, name: "S8 — Generator / AC1+AC2 / Charging",    pwSrc: isSB ? "backup" : "prime_gen",    cooling: "ac1_ac2",  battery: "charging" },
    { id: 9, name: "S9 — Power Outage / Battery Discharge",  pwSrc: "outage",                         cooling: "none",     battery: "discharging" },
  ];

  const activeDefs = allDefs; // all sites run S1–S9

  return activeDefs.map((s): ScenarioResult => {
    // SG sites have no backup source → S5-S8 use 0 kW available power
    const isSgBackupScenario = !isSB && s.id >= 5 && s.id <= 8;

    // Determine available generator power for this scenario
    const genKw =
      isSgBackupScenario      ? 0 :          // SG: no backup → 0
      s.pwSrc === "prime_sec" ? primePowerKw :
      s.pwSrc === "prime_gen" ? primePowerKw :
      s.pwSrc === "backup"    ? backupPowerKw :
      0; // outage

    const isCharging = s.battery === "charging";
    const isOutage   = s.pwSrc === "outage";

    // ── a) Power Supply Margin ──────────────────────────────────────────────
    // Formula: genKw − AC_power_loads − telecomPwKw [− battChgKw if charging]
    let powerMargin: number;
    if (isOutage) {
      powerMargin = 0 - telecomPwKw;
    } else if (s.id === 1) {
      // S1: Prime − AC1 − Telecom
      powerMargin = genKw - ac1NetPwKw - telecomPwKw;
    } else if (s.id === 2) {
      // S2: Prime − AC1 − AC2 − Telecom
      powerMargin = genKw - ac1NetPwKw - ac2NetPwKw - telecomPwKw;
    } else if (s.id === 3 || s.id === 7) {
      // S3/S7: Gen − AC1 − Telecom − BattCharging  (AC2 not in power formula)
      powerMargin = genKw - ac1NetPwKw - telecomPwKw - battChgKw;
    } else {
      // S4/S6/S8: Gen − AC1 − AC2 − Telecom [− BattCharging]
      powerMargin = genKw - ac1NetPwKw - ac2NetPwKw - telecomPwKw;
      if (isCharging) powerMargin -= battChgKw;
    }

    // S5 (AC1 only, no charging) — override for cleanliness
    if (s.id === 5) {
      powerMargin = genKw - ac1NetPwKw - telecomPwKw;
    }

    // ── b) Rectifier Supply Margin ──────────────────────────────────────────
    // Formula: RectNet − Telecom [− BattCharging if charging] (outage = 0 − Telecom)
    const rectifierMargin = isOutage
      ? 0 - telecomPwKw
      : rectNetKw - telecomPwKw - (isCharging ? battChgKw : 0);

    // ── c) Battery Risk ─────────────────────────────────────────────────────
    // S1–S8: SAFE (rectifier supplying)
    // S9: batteryUsefulHours < 1 → RISK, ≥ 1 → SAFE
    const batteryRisk: "safe" | "risk" =
      isOutage ? (battHours < 1 ? "risk" : "safe") : "safe";

    // ── d) Cooling Margin ───────────────────────────────────────────────────
    // Outage: no cooling → 0 − shelterHeat
    // AC1 only (S1/S5): AC1Btu − shelterHeat
    // AC1+AC2 (all others): (AC1 + AC2)Btu − shelterHeat
    let coolingMargin: number;
    if (isOutage) {
      coolingMargin = 0 - telecomHeatBtu;
    } else if (s.cooling === "ac1_only") {
      coolingMargin = ac1NetBtu - telecomHeatBtu;
    } else {
      coolingMargin = (ac1NetBtu + ac2NetBtu) - telecomHeatBtu;
    }

    // ── Risk Classification ─────────────────────────────────────────────────
    const powerRisk: "safe" | "risk" =
      isOutage ? "risk" : riskFromMargin(powerMargin, 0, 3);
    const rectifierRisk: "safe" | "risk" =
      isOutage ? "risk" : riskFromMargin(rectifierMargin, 0, 2);
    // Outdoor cabinet: S9 (outage) = Risk, S1–S8 = always Safe
    const coolingRisk: "safe" | "risk" =
      isOutage ? "risk"
      : site.siteType === "outdoor_cabinet" ? "safe"
      : riskFromMargin(coolingMargin, 0, 5000);

    const riskMap = { safe: 0, risk: 1 };
    const riskScore =
      riskMap[powerRisk] + riskMap[rectifierRisk] +
      riskMap[batteryRisk] + riskMap[coolingRisk];

    return {
      scenarioId:       s.id,
      scenarioName:     s.name,
      powerSource:      s.pwSrc,
      coolingConfig:    s.cooling,
      batteryState:     s.battery,
      primePowerKw,
      backupPowerKw,
      rectifierNetKw:   rectNetKw,
      telecomPowerKw:   telecomPwKw,
      telecomHeatBtu,
      ac1NetBtu,
      ac1NetPowerKw:    ac1NetPwKw,
      ac2NetBtu,
      ac2NetPowerKw:    ac2NetPwKw,
      batteryChargingKw: battChgKw,
      batteryUsefulHours: battHours,
      powerMarginKw:    powerMargin,
      rectifierMarginKw: rectifierMargin,
      coolingMarginBtu: coolingMargin,
      powerRisk,
      rectifierRisk,
      batteryRisk,
      coolingRisk,
      riskScore,
    };
  });
}

// ─── Site-level Analysis ──────────────────────────────────────────────────────
export function analyzeSite(site: SiteConfig): SiteAnalysis {
  if (site.placeholderSafe) {
    return {
      site,
      scenarios: [],
      overallRisk: "safe",
      worstRiskScore: 0,
      technicianNeeded: false,
    };
  }

  const scenarios = analyzeScenarios(site);

  // Overall risk: any non-outage scenario with a risk dimension flagged → "risk"
  const operationalScenarios = scenarios.filter(s => s.powerSource !== "outage");
  const hasRisk = operationalScenarios.some(
    s => s.powerRisk === "risk" || s.rectifierRisk === "risk" ||
         s.batteryRisk === "risk" || s.coolingRisk === "risk"
  );

  const s9 = scenarios.find(s => s.scenarioId === 9);
  const batteryInsufficient = s9 ? s9.batteryRisk === "risk" : false;

  const overallRisk: "safe" | "risk" =
    hasRisk || batteryInsufficient ? "risk" : "safe";

  const worstRiskScore = Math.max(...scenarios.map(s => s.riskScore));

  return {
    site,
    scenarios,
    overallRisk,
    worstRiskScore,
    technicianNeeded: overallRisk !== "safe",
  };
}
