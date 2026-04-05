// ─────────────────────────────────────────────────────────────────────────────
// Seed Script — run with: npm run seed
// Make sure DATABASE_URL is in your .env.local before running
// ─────────────────────────────────────────────────────────────────────────────

import { config } from "node:process";
import * as dotenv from "fs";

// Load .env.local manually for the script context
(function loadEnv() {
  try {
    const env = require("fs")
      .readFileSync(".env.local", "utf8")
      .split("\n")
      .filter((l: string) => l.trim() && !l.startsWith("#"));
    for (const line of env) {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  } catch {
    // .env.local not found — rely on existing env vars
  }
})();

import { initDb, sql } from "../lib/db";
import { ALL_SEED_POINTS } from "../lib/seedData";

async function seed() {
  console.log("🌊 Initialising African MSDI database schema...");
  await initDb();

  console.log("🗑️  Clearing existing dataset rows...");
  await sql`DELETE FROM datasets`;

  console.log(`📍 Seeding ${ALL_SEED_POINTS.length} depth points across 3 national nodes...`);

  for (const point of ALL_SEED_POINTS) {
    await sql`
      INSERT INTO datasets (
        dataset_id, node_country, node_code, custodian,
        survey_date, confidence_level, data_source, access_level,
        lat, lon, depth_m, vertical_datum, horizontal_datum
      ) VALUES (
        ${point.dataset_id}, ${point.node_country}, ${point.node_code},
        ${point.custodian}, ${point.survey_date}, ${point.confidence_level},
        ${point.data_source}, ${point.access_level},
        ${point.lat}, ${point.lon}, ${point.depth_m},
        ${point.vertical_datum}, ${point.horizontal_datum}
      )
      ON CONFLICT (dataset_id) DO NOTHING
    `;
  }

  const nigeriaCount = ALL_SEED_POINTS.filter((p) => p.node_code === "NG").length;
  const kenyaCount   = ALL_SEED_POINTS.filter((p) => p.node_code === "KE").length;
  const saCount      = ALL_SEED_POINTS.filter((p) => p.node_code === "ZA").length;

  console.log(`\n✅ Seed complete:`);
  console.log(`   🟢 Nigeria (NHA):        ${nigeriaCount} points`);
  console.log(`   🔵 Kenya (KMA):          ${kenyaCount} points`);
  console.log(`   🔴 South Africa (SANHO): ${saCount} points`);
  console.log(`\n🚀 Ready. Run: npm run dev\n`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
