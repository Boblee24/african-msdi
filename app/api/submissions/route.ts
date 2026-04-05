import { NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";
import {
  validateDepthReading,
  getPointsWithinRadius,
} from "@/lib/mlValidation";

export async function POST(request: Request) {
  try {
    await initDb();

    const body = await request.json();
    const { vessel_id, lat, lon, depth_m, reading_datetime } = body;

    // Basic input validation
    if (!vessel_id || lat === undefined || lon === undefined || depth_m === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: vessel_id, lat, lon, depth_m" },
        { status: 400 }
      );
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const depthNum = parseFloat(depth_m);

    if (isNaN(latNum) || isNaN(lonNum) || isNaN(depthNum)) {
      return NextResponse.json(
        { error: "lat, lon, depth_m must be valid numbers" },
        { status: 400 }
      );
    }

    // Fetch all existing validated official points for context
    const existingPoints = await sql`
      SELECT lat, lon, depth_m FROM datasets
      WHERE confidence_level = 'high'
    `;

    // Also include previously validated CSB points
    const validatedCsb = await sql`
      SELECT lat, lon, depth_m FROM csb_submissions
      WHERE validation_status = 'validated'
    `;

    const allReference = [
      ...existingPoints.map((p) => ({
        lat: parseFloat(p.lat),
        lon: parseFloat(p.lon),
        depth_m: parseFloat(p.depth_m),
      })),
      ...validatedCsb.map((p) => ({
        lat: parseFloat(p.lat),
        lon: parseFloat(p.lon),
        depth_m: parseFloat(p.depth_m),
      })),
    ];

    const nearbyPoints = getPointsWithinRadius(allReference, latNum, lonNum, 10);

    // Run ML quality control
    const validation = validateDepthReading(depthNum, latNum, lonNum, nearbyPoints);

    // Save to database (rejected points still logged for audit)
    const rdDatetime = reading_datetime || new Date().toISOString();

    const inserted = await sql`
      INSERT INTO csb_submissions (
        vessel_id, lat, lon, depth_m, reading_datetime,
        validation_status, validation_reason
      ) VALUES (
        ${vessel_id}, ${latNum}, ${lonNum}, ${depthNum},
        ${rdDatetime}, ${validation.status}, ${validation.reason}
      )
      RETURNING id, vessel_id, lat, lon, depth_m, reading_datetime,
                validation_status, validation_reason, created_at
    `;

    return NextResponse.json({
      success: true,
      submission: inserted[0],
      validation: {
        status: validation.status,
        reason: validation.reason,
        confidence: validation.confidence,
        nearbyPointsUsed: nearbyPoints.length,
      },
    });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initDb();
    const submissions = await sql`
      SELECT * FROM csb_submissions ORDER BY created_at DESC LIMIT 100
    `;
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
