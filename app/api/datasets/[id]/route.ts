import { NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";

// Mock S-100 / S-102 inspired GeoJSON response
// S-102 is the IHO standard for bathymetric surface data
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initDb();

    const { id } = params;

    // Try official dataset first
    const rows = await sql`
      SELECT * FROM datasets WHERE dataset_id = ${id} LIMIT 1
    `;

    if (rows.length > 0) {
      const point = rows[0];

      // Compute geographic extent (±0.2 degrees around the point)
      const response = {
        datasetId: point.dataset_id,
        productSpecification: "S-102",
        productSpecificationVersion: "2.2.0",
        issuingOrganization: point.custodian,
        dataCustodian: point.node_code === "NG"
          ? "NHA"
          : point.node_code === "KE"
          ? "KMA"
          : "SANHO",
        accessLevel: point.access_level,
        metadataPublic: true,
        geographicExtent: {
          westBoundLongitude: parseFloat(point.lon) - 0.2,
          eastBoundLongitude: parseFloat(point.lon) + 0.2,
          southBoundLatitude: parseFloat(point.lat) - 0.2,
          northBoundLatitude: parseFloat(point.lat) + 0.2,
        },
        surveyDate: point.survey_date,
        verticalDatum: point.vertical_datum,
        horizontalDatum: point.horizontal_datum,
        confidenceLevel: point.confidence_level,
        dataSource: point.data_source,
        coordinateReferenceSystems: {
          horizontal: "EPSG:4326 (WGS84)",
          vertical: point.vertical_datum,
        },
        qualityIndicators: {
          totalHorizontalUncertainty: "±5m (95% confidence)",
          totalVerticalUncertainty: "±0.5m (95% confidence)",
          ihoOrderClassification: "Special Order",
        },
        // Full resolution data — in production this is access-controlled
        // The decimated public version would omit exact coordinates
        depthPoints: [
          {
            lat: parseFloat(point.lat),
            lon: parseFloat(point.lon),
            depth_m: parseFloat(point.depth_m),
            timestamp: point.survey_date
              ? `${point.survey_date}T09:00:00Z`
              : null,
          },
        ],
        note: "Full-resolution depth grid available to authenticated National Hydrographic Office users only. Public API returns single representative point per dataset record.",
      };

      return NextResponse.json(response);
    }

    // Try CSB submission
    const csbRows = await sql`
      SELECT * FROM csb_submissions WHERE id = ${parseInt(id)} LIMIT 1
    `;

    if (csbRows.length > 0) {
      const sub = csbRows[0];
      const response = {
        datasetId: `CSB-${sub.id}`,
        productSpecification: "IHO-CSB",
        issuingOrganization: "Crowdsourced Bathymetry Contributor",
        dataCustodian: "African MSDI Portal",
        accessLevel: "public",
        metadataPublic: true,
        vesselId: sub.vessel_id,
        submissionDate: sub.created_at,
        readingDate: sub.reading_datetime,
        validationStatus: sub.validation_status,
        validationReason: sub.validation_reason,
        confidenceLevel:
          sub.validation_status === "validated" ? "low-csb" : "unverified",
        dataSource: "crowdsourced_bathymetry",
        depthPoints: [
          {
            lat: parseFloat(sub.lat),
            lon: parseFloat(sub.lon),
            depth_m: parseFloat(sub.depth_m),
            timestamp: sub.reading_datetime,
          },
        ],
        note:
          "Crowdsourced Bathymetry data. Not verified against official survey data. Use with caution for navigational purposes.",
      };

      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/datasets/[id] error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
