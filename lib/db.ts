import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(process.env.DATABASE_URL);

// ─── Schema ───────────────────────────────────────────────────────────────────

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS datasets (
      id            SERIAL PRIMARY KEY,
      dataset_id    VARCHAR(60)  UNIQUE NOT NULL,
      node_country  VARCHAR(100) NOT NULL,
      node_code     VARCHAR(10)  NOT NULL,
      custodian     VARCHAR(200) NOT NULL,
      survey_date   DATE,
      confidence_level VARCHAR(20) NOT NULL DEFAULT 'high',
      data_source   VARCHAR(50)  NOT NULL DEFAULT 'official_survey',
      access_level  VARCHAR(20)  NOT NULL DEFAULT 'restricted',
      lat           DECIMAL(10,7) NOT NULL,
      lon           DECIMAL(10,7) NOT NULL,
      depth_m       DECIMAL(8,2)  NOT NULL,
      vertical_datum VARCHAR(60)  DEFAULT 'Mean Lower Low Water',
      horizontal_datum VARCHAR(20) DEFAULT 'WGS84',
      created_at    TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS csb_submissions (
      id                SERIAL PRIMARY KEY,
      vessel_id         VARCHAR(100) NOT NULL,
      lat               DECIMAL(10,7) NOT NULL,
      lon               DECIMAL(10,7) NOT NULL,
      depth_m           DECIMAL(8,2)  NOT NULL,
      reading_datetime  TIMESTAMP NOT NULL,
      validation_status VARCHAR(20) NOT NULL,
      validation_reason TEXT,
      created_at        TIMESTAMP DEFAULT NOW()
    )
  `;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataPoint = {
  id: number;
  dataset_id: string;
  node_country: string;
  node_code: string;
  custodian: string;
  survey_date: string | null;
  confidence_level: string;
  data_source: string;
  access_level: string;
  lat: number;
  lon: number;
  depth_m: number;
  vertical_datum: string;
  horizontal_datum: string;
};

export type CsbSubmission = {
  id: number;
  vessel_id: string;
  lat: number;
  lon: number;
  depth_m: number;
  reading_datetime: string;
  validation_status: "validated" | "flagged" | "rejected";
  validation_reason: string;
  created_at: string;
};
