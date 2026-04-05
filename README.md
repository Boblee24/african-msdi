# African MSDI — Federated Marine Spatial Data Infrastructure

> A working prototype demonstrating continental-scale hydrographic data federation across Africa.
> Built for the NHA / 2026 World Hydrography Day Young Ocean Scholars Competition.

**Live demo:** https://your-app.vercel.app

---

## What this demonstrates

One complete user journey that proves the paper's argument:

1. **Three national nodes** (Nigeria/NHA, Kenya/KMA, South Africa/SANHO) visible on one Leaflet map
2. **S-100 API responses** — click any point → see mock IHO S-102 compliant JSON any ship nav system could consume
3. **CSB submission** — submit a depth reading as a fisherman, watch ML validation run, see result on map
4. **RBAC demo** — toggle Admin View to simulate authenticated NHO institutional access (data decimation)
5. **Architecture diagram** — SVG showing the federated node topology for the visual presentation

---

## Setup (≈ 15 minutes)

### 1. Clone and install

```bash
git clone https://github.com/your-username/african-msdi
cd african-msdi
npm install
```

### 2. Create a Neon database

1. Go to **https://neon.tech** and sign up (free tier is sufficient)
2. Click **"New Project"**
3. Name it `african-msdi`, choose the closest region
4. Once created, go to **Connection Details**
5. Copy the **Connection string** (starts with `postgres://...`)

### 3. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your Neon connection string:

```
DATABASE_URL=postgres://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 4. Seed the database

This creates the tables and inserts 60 realistic depth points across 3 national nodes:

```bash
npm run seed
```

Expected output:
```
🌊 Initialising African MSDI database schema...
🗑️  Clearing existing dataset rows...
📍 Seeding 60 depth points across 3 national nodes...

✅ Seed complete:
   🟢 Nigeria (NHA):        20 points
   🔵 Kenya (KMA):          20 points
   🔴 South Africa (SANHO): 20 points

🚀 Ready. Run: npm run dev
```

### 5. Run locally

```bash
npm run dev
```

Open **http://localhost:3000**

---

## Deployment to Vercel

```bash
npm install -g vercel
vercel
```

When prompted:
- Framework: **Next.js**
- Root directory: `.` (current)
- Build command: `npm run build` (default)

Then add the environment variable:
```
vercel env add DATABASE_URL
# paste your Neon connection string when prompted
```

Deploy:
```bash
vercel --prod
```

**After deployment**, run the seed against production:
```bash
DATABASE_URL="your-neon-url" npm run seed
```

Or re-run the seed from Neon's SQL editor by copying the seed data from `lib/seedData.ts`.

---

## Project structure

```
african-msdi/
├── app/
│   ├── page.tsx                    # Discovery Portal (main map)
│   ├── submit/page.tsx             # CSB Fisherman Submission Portal
│   ├── architecture/page.tsx       # Architecture Diagram
│   ├── layout.tsx                  # Root layout + Nav
│   ├── globals.css                 # Dark maritime theme
│   └── api/
│       ├── datasets/route.ts       # GET all datasets (filterable)
│       ├── datasets/[id]/route.ts  # GET single dataset → S-100 JSON
│       └── submissions/route.ts    # POST CSB submission + ML validation
│
├── components/
│   ├── Nav.tsx                     # Top navigation
│   ├── MapClient.tsx               # Leaflet map (client-only)
│   ├── FilterPanel.tsx             # Filter dropdowns + legend + RBAC toggle
│   └── ApiPanel.tsx                # S-100 JSON viewer side panel
│
├── lib/
│   ├── db.ts                       # Neon connection + schema init
│   ├── mlValidation.ts             # Z-score anomaly detection (ML QC)
│   └── seedData.ts                 # 60 mock depth points
│
└── scripts/
    └── seed.ts                     # Database seed script
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/datasets` | All datasets. Filter with `?country=NG&confidence=high` |
| `GET` | `/api/datasets/:id` | Single dataset in S-100/S-102 mock format |
| `POST` | `/api/submissions` | Submit CSB depth reading + receive ML validation result |
| `GET` | `/api/submissions` | List recent CSB submissions |

### Example S-100 API response

```
GET /api/datasets/NHA-NG-2024-001
```

```json
{
  "datasetId": "NHA-NG-2024-001",
  "productSpecification": "S-102",
  "productSpecificationVersion": "2.2.0",
  "issuingOrganization": "Nigerian Hydrographic Authority",
  "dataCustodian": "NHA",
  "accessLevel": "restricted",
  "metadataPublic": true,
  "geographicExtent": {
    "westBoundLongitude": 3.187,
    "eastBoundLongitude": 3.587,
    "southBoundLatitude": 6.252,
    "northBoundLatitude": 6.652
  },
  "surveyDate": "2024-03-15",
  "verticalDatum": "Mean Lower Low Water",
  "horizontalDatum": "WGS84",
  "confidenceLevel": "high",
  "dataSource": "official_survey",
  "qualityIndicators": {
    "totalHorizontalUncertainty": "±5m (95% confidence)",
    "totalVerticalUncertainty": "±0.5m (95% confidence)",
    "ihoOrderClassification": "Special Order"
  }
}
```

### Example CSB submission

```
POST /api/submissions
Content-Type: application/json

{
  "vessel_id": "LAGFISH-0042",
  "lat": 6.451,
  "lon": 3.391,
  "depth_m": 13.2,
  "reading_datetime": "2024-04-04T08:30:00Z"
}
```

```json
{
  "success": true,
  "validation": {
    "status": "validated",
    "reason": "Reading is consistent with 8 nearby validated survey points (local mean: 12.8m).",
    "confidence": 82,
    "nearbyPointsUsed": 8
  }
}
```

---

## ML Quality Control logic

Implemented in `lib/mlValidation.ts`. Rule-based statistical approach (intentionally explainable):

| Rule | Condition | Status |
|------|-----------|--------|
| Hard rejection | depth ≤ 0 | Rejected |
| Hard rejection | depth > 500m | Rejected |
| Domain threshold | depth > 100m in coastal zone | Flagged |
| Z-score > 2.5σ | vs nearby reference points | Flagged |
| Z-score 1.5–2.5σ | vs nearby reference points | Validated (low confidence) |
| Z-score < 1.5σ | vs nearby reference points | Validated |
| No nearby points | depth 2–100m | Validated (unverified) |

---

## Tech stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 App Router | SSR + API routes in one deployment |
| Map | Leaflet.js + React-Leaflet | Free, no API key, works offline |
| Database | Neon (PostgreSQL) | Serverless, free tier, global |
| ML/QC | Custom JS z-score | Explainable to non-technical judges |
| Deployment | Vercel | Zero-config Next.js hosting |
| Styling | CSS variables, no framework | Lightweight, no build overhead |

All open source. No paid APIs. Reproducible by any African government institution.

---

## The paper argument in one demo

> Africa's ocean data problem is not a lack of technology but a lack of integration architecture.

This prototype demonstrates:
- **CSB ingestion** — fishermen contribute data via a mobile form
- **ML quality control** — z-score validation before publication
- **Federated discovery** — 3 nations' data on one map, each keeping custody
- **S-100 interoperability** — any ECDIS system can consume the API
- **RBAC security** — MEDIN-style data decimation for restricted datasets

Built for the NHA / 2026 World Hydrography Day Young Ocean Scholars Competition (₦10,000,000 prize).
