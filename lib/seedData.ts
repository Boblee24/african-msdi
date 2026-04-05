// ─────────────────────────────────────────────────────────────────────────────
// Seed Data — Three Simulated National Hydrographic Nodes
// ─────────────────────────────────────────────────────────────────────────────

export type SeedPoint = {
  dataset_id: string;
  node_country: string;
  node_code: string;
  custodian: string;
  survey_date: string;
  confidence_level: string;
  data_source: string;
  access_level: string;
  lat: number;
  lon: number;
  depth_m: number;
  vertical_datum: string;
  horizontal_datum: string;
};

// ── Node 1: Nigeria / NHA — Gulf of Guinea, Lagos coastline ──────────────────
const nigeriaSurveyDate = "2024-03-15";
const nigeriaPoints: SeedPoint[] = [
  { lat: 6.452, lon: 3.387, depth_m: 12.4 },
  { lat: 6.438, lon: 3.412, depth_m: 14.1 },
  { lat: 6.421, lon: 3.445, depth_m: 17.8 },
  { lat: 6.467, lon: 3.358, depth_m: 9.6 },
  { lat: 6.480, lon: 3.390, depth_m: 11.2 },
  { lat: 6.398, lon: 3.421, depth_m: 19.3 },
  { lat: 6.411, lon: 3.395, depth_m: 15.7 },
  { lat: 6.444, lon: 3.372, depth_m: 10.8 },
  { lat: 6.460, lon: 3.430, depth_m: 18.5 },
  { lat: 6.427, lon: 3.463, depth_m: 22.1 },
  { lat: 6.390, lon: 3.398, depth_m: 24.6 },
  { lat: 6.475, lon: 3.415, depth_m: 13.3 },
  { lat: 6.403, lon: 3.440, depth_m: 20.9 },
  { lat: 6.456, lon: 3.348, depth_m: 8.7 },
  { lat: 6.488, lon: 3.375, depth_m: 7.4 },
  { lat: 6.416, lon: 3.468, depth_m: 26.2 },
  { lat: 6.433, lon: 3.352, depth_m: 9.1 },
  { lat: 6.448, lon: 3.482, depth_m: 28.4 },
  { lat: 6.382, lon: 3.415, depth_m: 31.7 },
  { lat: 6.492, lon: 3.403, depth_m: 6.8 },
].map((p, i) => ({
  ...p,
  dataset_id: `NHA-NG-2024-${String(i + 1).padStart(3, "0")}`,
  node_country: "Nigeria",
  node_code: "NG",
  custodian: "Nigerian Hydrographic Authority",
  survey_date: nigeriaSurveyDate,
  confidence_level: "high",
  data_source: "official_survey",
  access_level: "restricted",
  vertical_datum: "Mean Lower Low Water",
  horizontal_datum: "WGS84",
}));

// ── Node 2: Kenya / Kenya Maritime Authority — Mombasa harbour ───────────────
const kenyaSurveyDate = "2023-11-08";
const kenyaPoints: SeedPoint[] = [
  { lat: -4.043, lon: 39.668, depth_m: 18.2 },
  { lat: -4.062, lon: 39.712, depth_m: 24.5 },
  { lat: -4.018, lon: 39.645, depth_m: 15.3 },
  { lat: -4.087, lon: 39.688, depth_m: 31.8 },
  { lat: -3.998, lon: 39.703, depth_m: 21.6 },
  { lat: -4.055, lon: 39.731, depth_m: 27.4 },
  { lat: -4.073, lon: 39.660, depth_m: 19.9 },
  { lat: -4.029, lon: 39.722, depth_m: 33.2 },
  { lat: -4.011, lon: 39.676, depth_m: 16.7 },
  { lat: -4.092, lon: 39.715, depth_m: 38.1 },
  { lat: -4.048, lon: 39.643, depth_m: 13.4 },
  { lat: -3.985, lon: 39.695, depth_m: 22.8 },
  { lat: -4.078, lon: 39.740, depth_m: 35.6 },
  { lat: -4.034, lon: 39.659, depth_m: 17.2 },
  { lat: -4.067, lon: 39.698, depth_m: 29.3 },
  { lat: -4.002, lon: 39.718, depth_m: 25.1 },
  { lat: -4.083, lon: 39.672, depth_m: 23.7 },
  { lat: -4.024, lon: 39.735, depth_m: 36.9 },
  { lat: -4.058, lon: 39.649, depth_m: 14.8 },
  { lat: -4.096, lon: 39.703, depth_m: 40.2 },
].map((p, i) => ({
  ...p,
  dataset_id: `KMA-KE-2023-${String(i + 1).padStart(3, "0")}`,
  node_country: "Kenya",
  node_code: "KE",
  custodian: "Kenya Maritime Authority",
  survey_date: kenyaSurveyDate,
  confidence_level: "high",
  data_source: "official_survey",
  access_level: "restricted",
  vertical_datum: "Mean Sea Level",
  horizontal_datum: "WGS84",
}));

// ── Node 3: South Africa / SANHO — Cape Town, Durban ────────────────────────
const saSurveyDate = "2024-01-22";
const saPoints: SeedPoint[] = [
  { lat: -33.912, lon: 18.423, depth_m: 22.4 },
  { lat: -33.898, lon: 18.447, depth_m: 31.6 },
  { lat: -33.934, lon: 18.398, depth_m: 18.9 },
  { lat: -33.875, lon: 18.468, depth_m: 44.2 },
  { lat: -33.921, lon: 18.412, depth_m: 25.7 },
  { lat: -33.887, lon: 18.435, depth_m: 36.8 },
  { lat: -33.948, lon: 18.452, depth_m: 41.3 },
  { lat: -33.862, lon: 18.418, depth_m: 19.5 },
  { lat: -33.906, lon: 18.473, depth_m: 48.6 },
  { lat: -33.930, lon: 18.388, depth_m: 15.2 },
  { lat: -33.873, lon: 18.458, depth_m: 39.7 },
  { lat: -33.944, lon: 18.432, depth_m: 33.1 },
  { lat: -33.892, lon: 18.407, depth_m: 21.8 },
  { lat: -33.918, lon: 18.482, depth_m: 52.4 },
  { lat: -33.857, lon: 18.441, depth_m: 28.3 },
  { lat: -33.937, lon: 18.415, depth_m: 27.9 },
  { lat: -33.880, lon: 18.463, depth_m: 43.5 },
  { lat: -33.909, lon: 18.395, depth_m: 16.8 },
  { lat: -33.925, lon: 18.444, depth_m: 38.2 },
  { lat: -33.868, lon: 18.478, depth_m: 55.1 },
].map((p, i) => ({
  ...p,
  dataset_id: `SANHO-ZA-2024-${String(i + 1).padStart(3, "0")}`,
  node_country: "South Africa",
  node_code: "ZA",
  custodian: "South African Navy Hydrographic Office (SANHO)",
  survey_date: saSurveyDate,
  confidence_level: "high",
  data_source: "official_survey",
  access_level: "restricted",
  vertical_datum: "Mean Lower Low Water",
  horizontal_datum: "WGS84",
}));

export const ALL_SEED_POINTS: SeedPoint[] = [
  ...nigeriaPoints,
  ...kenyaPoints,
  ...saPoints,
];
