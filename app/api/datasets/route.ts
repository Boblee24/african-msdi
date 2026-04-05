import { NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await initDb();

    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const confidence = searchParams.get("confidence");
    const source = searchParams.get("source");

    // Build filtered query
    let datasets;
    if (country && country !== "all") {
      datasets = await sql`
        SELECT * FROM datasets WHERE node_code = ${country}
        ORDER BY node_country, id
      `;
    } else if (confidence && confidence !== "all") {
      datasets = await sql`
        SELECT * FROM datasets WHERE confidence_level = ${confidence}
        ORDER BY node_country, id
      `;
    } else if (source && source !== "all") {
      datasets = await sql`
        SELECT * FROM datasets WHERE data_source = ${source}
        ORDER BY node_country, id
      `;
    } else {
      datasets = await sql`SELECT * FROM datasets ORDER BY node_country, id`;
    }

    // Also return CSB submissions
    const submissions = await sql`
      SELECT * FROM csb_submissions ORDER BY created_at DESC LIMIT 100
    `;

    return NextResponse.json({ datasets, submissions });
  } catch (error) {
    console.error("GET /api/datasets error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
