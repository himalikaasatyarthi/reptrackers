export type UnitSystem = "metric" | "imperial";

export type BmiBand = {
  id: "under" | "healthy" | "over" | "high";
  label: string;
  badgeClass: string;
  note: string;
};

export type BmiResult = {
  bmi: number;
  band: BmiBand;
  healthyMinKg: number;
  healthyMaxKg: number;
  marker: number;
  deltaKg: number;
  status: "below" | "healthy" | "above";
};

const BANDS: BmiBand[] = [
  {
    id: "under",
    label: "Below healthy range",
    badgeClass: "badge-under",
    note: "A clinician can help you read this alongside energy, cycle health, labs, and how you feel. Eating enough nutrient-dense food matters here.",
  },
  {
    id: "healthy",
    label: "Healthy range",
    badgeClass: "badge-healthy",
    note: "This range is associated with lower average metabolic risk for most adults. It still says nothing precise about muscular strength, cardiovascular endurance, or how you feel.",
  },
  {
    id: "over",
    label: "Above healthy range",
    badgeClass: "badge-over",
    note: "Use this as a prompt to look at sleep, daily walking, and whole-food meals — not as a grade. Waist circumference, strength, and lab work tell a much fuller story.",
  },
  {
    id: "high",
    label: "High range",
    badgeClass: "badge-high",
    note: "This range is worth discussing with a qualified clinician, especially if you have other metabolic or joint health concerns. Daily small habits still count while you arrange that.",
  },
];

export function bandFor(bmi: number): BmiBand {
  if (bmi < 18.5) return BANDS[0];
  if (bmi < 25) return BANDS[1];
  if (bmi < 30) return BANDS[2];
  return BANDS[3];
}

export function parseMeasurement(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function toMetric(input: {
  unit: UnitSystem;
  heightCm: number | null;
  weightKg: number | null;
  feet: number | null;
  inches: number | null;
  pounds: number | null;
}): { heightCm: number; weightKg: number } | null {
  if (input.unit === "metric") {
    if (input.heightCm === null || input.weightKg === null) return null;
    if (input.heightCm < 80 || input.heightCm > 250) return null;
    if (input.weightKg < 20 || input.weightKg > 300) return null;
    return { heightCm: input.heightCm, weightKg: input.weightKg };
  }
  if (input.feet === null || input.inches === null || input.pounds === null) return null;
  if (input.feet < 3 || input.feet > 8) return null;
  if (input.inches < 0 || input.inches >= 12) return null;
  if (input.pounds < 44 || input.pounds > 660) return null;
  const totalInches = input.feet * 12 + input.inches;
  return {
    heightCm: totalInches * 2.54,
    weightKg: input.pounds * 0.45359237,
  };
}

export function metricToImperial(heightCm: number, weightKg: number): {
  feet: string;
  inches: string;
  pounds: string;
} {
  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  const pounds = Math.round(weightKg / 0.45359237);
  return {
    feet: String(Math.max(3, Math.min(8, feet))),
    inches: String(inches >= 12 ? 0 : inches),
    pounds: String(Math.max(44, Math.min(660, pounds))),
  };
}

export function imperialToMetric(feet: number, inches: number, pounds: number): {
  heightCm: string;
  weightKg: string;
} {
  const totalInches = feet * 12 + inches;
  const heightCm = Math.round(totalInches * 2.54);
  const weightKg = (pounds * 0.45359237).toFixed(1);
  return {
    heightCm: String(Math.max(80, Math.min(250, heightCm))),
    weightKg: String(weightKg),
  };
}

export function assessBmi(heightCm: number, weightKg: number): BmiResult | null {
  if (heightCm <= 0 || weightKg <= 0) return null;
  const meters = heightCm / 100;
  const bmi = weightKg / (meters * meters);
  if (!Number.isFinite(bmi)) return null;

  const healthyMinKg = 18.5 * meters * meters;
  const healthyMaxKg = 24.9 * meters * meters;

  let deltaKg = 0;
  let status: "below" | "healthy" | "above" = "healthy";

  if (weightKg < healthyMinKg) {
    deltaKg = healthyMinKg - weightKg;
    status = "below";
  } else if (weightKg > healthyMaxKg) {
    deltaKg = weightKg - healthyMaxKg;
    status = "above";
  }

  return {
    bmi,
    band: bandFor(bmi),
    healthyMinKg,
    healthyMaxKg,
    marker: Math.min(94, Math.max(4, ((bmi - 14) / 24) * 100)),
    deltaKg,
    status,
  };
}

export function formatWeight(kg: number, unit: UnitSystem): string {
  if (unit === "imperial") return `${Math.round(kg / 0.45359237)} lb`;
  return `${kg.toFixed(1)} kg`;
}
