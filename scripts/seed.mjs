// scripts/seed.mjs
// Plain ES module — runs directly with Node.js, no TypeScript compiler needed
// Usage: npm run seed

import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

// ── Load .env.local manually ──────────────────────────────────────────────────
try {
  const env = readFileSync(".env.local", "utf8").split("\n");
  for (const line of env) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    if (key && val && !process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local not found — rely on existing env vars (CI/Vercel)
}

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set. Check your .env.local file.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// ── Schema ────────────────────────────────────────────────────────────────────
async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS datasets (
      id               SERIAL PRIMARY KEY,
      dataset_id       VARCHAR(60)   UNIQUE NOT NULL,
      node_country     VARCHAR(100)  NOT NULL,
      node_code        VARCHAR(10)   NOT NULL,
      custodian        VARCHAR(200)  NOT NULL,
      survey_date      DATE,
      confidence_level VARCHAR(20)   NOT NULL DEFAULT 'high',
      data_source      VARCHAR(50)   NOT NULL DEFAULT 'official_survey',
      access_level     VARCHAR(20)   NOT NULL DEFAULT 'restricted',
      lat              DECIMAL(10,7) NOT NULL,
      lon              DECIMAL(10,7) NOT NULL,
      depth_m          DECIMAL(8,2)  NOT NULL,
      vertical_datum   VARCHAR(60)   DEFAULT 'Mean Lower Low Water',
      horizontal_datum VARCHAR(20)   DEFAULT 'WGS84',
      created_at       TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS csb_submissions (
      id                SERIAL PRIMARY KEY,
      vessel_id         VARCHAR(100)  NOT NULL,
      lat               DECIMAL(10,7) NOT NULL,
      lon               DECIMAL(10,7) NOT NULL,
      depth_m           DECIMAL(8,2)  NOT NULL,
      reading_datetime  TIMESTAMP     NOT NULL,
      validation_status VARCHAR(20)   NOT NULL,
      validation_reason TEXT,
      created_at        TIMESTAMP DEFAULT NOW()
    )
  `;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

// Node 1 — Nigeria / NHA — Gulf of Guinea, Lagos coastline
const nigeriaRaw = [
  [6.452, 3.387, 12.4], [6.438, 3.412, 14.1], [6.421, 3.445, 17.8],
  [6.467, 3.358,  9.6], [6.480, 3.390, 11.2], [6.398, 3.421, 19.3],
  [6.411, 3.395, 15.7], [6.444, 3.372, 10.8], [6.460, 3.430, 18.5],
  [6.427, 3.463, 22.1], [6.390, 3.398, 24.6], [6.475, 3.415, 13.3],
  [6.403, 3.440, 20.9], [6.456, 3.348,  8.7], [6.488, 3.375,  7.4],
  [6.416, 3.468, 26.2], [6.433, 3.352,  9.1], [6.448, 3.482, 28.4],
  [6.382, 3.415, 31.7], [6.492, 3.403,  6.8],
];

const nigeriaPoints = nigeriaRaw.map(([lat, lon, depth_m], i) => ({
  dataset_id:       `NHA-NG-2024-${String(i + 1).padStart(3, "0")}`,
  node_country:     "Nigeria",
  node_code:        "NG",
  custodian:        "Nigerian Hydrographic Authority",
  survey_date:      "2024-03-15",
  confidence_level: "high",
  data_source:      "official_survey",
  access_level:     "restricted",
  lat, lon, depth_m,
  vertical_datum:   "Mean Lower Low Water",
  horizontal_datum: "WGS84",
}));

// Node 2 — Kenya / KMA — Mombasa harbour
const kenyaRaw = [
  [-4.043, 39.668, 18.2], [-4.062, 39.712, 24.5], [-4.018, 39.645, 15.3],
  [-4.087, 39.688, 31.8], [-3.998, 39.703, 21.6], [-4.055, 39.731, 27.4],
  [-4.073, 39.660, 19.9], [-4.029, 39.722, 33.2], [-4.011, 39.676, 16.7],
  [-4.092, 39.715, 38.1], [-4.048, 39.643, 13.4], [-3.985, 39.695, 22.8],
  [-4.078, 39.740, 35.6], [-4.034, 39.659, 17.2], [-4.067, 39.698, 29.3],
  [-4.002, 39.718, 25.1], [-4.083, 39.672, 23.7], [-4.024, 39.735, 36.9],
  [-4.058, 39.649, 14.8], [-4.096, 39.703, 40.2],
];

const kenyaPoints = kenyaRaw.map(([lat, lon, depth_m], i) => ({
  dataset_id:       `KMA-KE-2023-${String(i + 1).padStart(3, "0")}`,
  node_country:     "Kenya",
  node_code:        "KE",
  custodian:        "Kenya Maritime Authority",
  survey_date:      "2023-11-08",
  confidence_level: "high",
  data_source:      "official_survey",
  access_level:     "restricted",
  lat, lon, depth_m,
  vertical_datum:   "Mean Sea Level",
  horizontal_datum: "WGS84",
}));

// Node 3 — South Africa / SANHO — Cape Town
const saRaw = [
  [-33.912, 18.423, 22.4], [-33.898, 18.447, 31.6], [-33.934, 18.398, 18.9],
  [-33.875, 18.468, 44.2], [-33.921, 18.412, 25.7], [-33.887, 18.435, 36.8],
  [-33.948, 18.452, 41.3], [-33.862, 18.418, 19.5], [-33.906, 18.473, 48.6],
  [-33.930, 18.388, 15.2], [-33.873, 18.458, 39.7], [-33.944, 18.432, 33.1],
  [-33.892, 18.407, 21.8], [-33.918, 18.482, 52.4], [-33.857, 18.441, 28.3],
  [-33.937, 18.415, 27.9], [-33.880, 18.463, 43.5], [-33.909, 18.395, 16.8],
  [-33.925, 18.444, 38.2], [-33.868, 18.478, 55.1],
];

const saPoints = saRaw.map(([lat, lon, depth_m], i) => ({
  dataset_id:       `SANHO-ZA-2024-${String(i + 1).padStart(3, "0")}`,
  node_country:     "South Africa",
  node_code:        "ZA",
  custodian:        "South African Navy Hydrographic Office (SANHO)",
  survey_date:      "2024-01-22",
  confidence_level: "high",
  data_source:      "official_survey",
  access_level:     "restricted",
  lat, lon, depth_m,
  vertical_datum:   "Mean Lower Low Water",
  horizontal_datum: "WGS84",
}));

const ALL_POINTS = [...nigeriaPoints, ...kenyaPoints, ...saPoints];

// ── Run ───────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌊  Initialising African MSDI database schema...");
  await initDb();

  console.log("🗑️   Clearing existing dataset rows...");
  await sql`DELETE FROM datasets`;

  console.log(`📍  Seeding ${ALL_POINTS.length} depth points across 3 national nodes...`);

  for (const p of ALL_POINTS) {
    await sql`
      INSERT INTO datasets (
        dataset_id, node_country, node_code, custodian,
        survey_date, confidence_level, data_source, access_level,
        lat, lon, depth_m, vertical_datum, horizontal_datum
      ) VALUES (
        ${p.dataset_id}, ${p.node_country}, ${p.node_code}, ${p.custodian},
        ${p.survey_date}, ${p.confidence_level}, ${p.data_source}, ${p.access_level},
        ${p.lat}, ${p.lon}, ${p.depth_m}, ${p.vertical_datum}, ${p.horizontal_datum}
      )
      ON CONFLICT (dataset_id) DO NOTHING
    `;
  }

  console.log(`\n✅  Seed complete:`);
  console.log(`   🟢  Nigeria  (NHA):        ${nigeriaPoints.length} points`);
  console.log(`   🔵  Kenya    (KMA):         ${kenyaPoints.length} points`);
  console.log(`   🔴  S. Africa (SANHO):      ${saPoints.length} points`);
  console.log(`\n🚀  Ready — run: npm run dev\n`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
