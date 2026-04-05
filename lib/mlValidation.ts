// ─────────────────────────────────────────────────────────────────────────────
// ML Quality Control Layer — Crowdsourced Bathymetry Validation
//
// Uses rule-based statistical anomaly detection (z-score + domain thresholds).
// This is intentionally explainable for non-technical judges.
// ─────────────────────────────────────────────────────────────────────────────

export type ValidationResult = {
  status: "validated" | "flagged" | "rejected";
  reason: string;
  confidence: number; // 0-100
};

type NearbyPoint = { depth_m: number };

// Haversine distance in kilometres
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Filter validated points within radiusKm of a coordinate
export function getPointsWithinRadius(
  allPoints: Array<{ lat: number; lon: number; depth_m: number }>,
  lat: number,
  lon: number,
  radiusKm = 10
): NearbyPoint[] {
  return allPoints.filter(
    (p) => haversineKm(lat, lon, p.lat, p.lon) <= radiusKm
  );
}

// Z-score: how many standard deviations from the mean?
function zScore(value: number, values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(
    values.map((v) => (v - mean) ** 2).reduce((a, b) => a + b, 0) / values.length
  );
  return std === 0 ? 0 : Math.abs((value - mean) / std);
}

// ─── Main validation function ─────────────────────────────────────────────────

export function validateDepthReading(
  depth_m: number,
  lat: number,
  lon: number,
  nearbyPoints: NearbyPoint[]
): ValidationResult {
  // Rule 1 — Hard physical impossibility
  if (depth_m <= 0) {
    return {
      status: "rejected",
      reason:
        "Depth reading is zero or negative. This is physically impossible for an open-water bathymetric reading. Submission rejected.",
      confidence: 0,
    };
  }

  // Rule 2 — Extreme outlier for coastal Africa context (>500m in known shallow coastal zone)
  if (depth_m > 500) {
    return {
      status: "rejected",
      reason:
        `Depth of ${depth_m}m exceeds the maximum plausible value (500m) for the coastal zones monitored by this portal. Submission rejected.`,
      confidence: 0,
    };
  }

  // Rule 3 — Suspiciously deep for coastal/harbour contexts (100–500m triggers flag)
  if (depth_m > 100) {
    return {
      status: "flagged",
      reason:
        `Depth of ${depth_m}m is unusually large for a coastal area. Readings above 100m in near-shore zones require manual review by a hydrographic officer. Added to map with low confidence.`,
      confidence: 25,
    };
  }

  // Rule 4 — Statistical z-score comparison against nearby validated points
  if (nearbyPoints.length >= 3) {
    const depths = nearbyPoints.map((p) => p.depth_m);
    const z = zScore(depth_m, depths);
    const mean = depths.reduce((a, b) => a + b, 0) / depths.length;

    if (z > 2.5) {
      return {
        status: "flagged",
        reason:
          `This reading (${depth_m}m) is ${z.toFixed(1)} standard deviations from the local mean depth (${mean.toFixed(1)}m across ${nearbyPoints.length} nearby verified points). Flagged for manual review.`,
        confidence: 35,
      };
    }

    if (z > 1.5) {
      return {
        status: "validated",
        reason:
          `Reading is within an acceptable statistical range. It is ${z.toFixed(1)} standard deviations from the local mean depth of ${mean.toFixed(1)}m (${nearbyPoints.length} nearby points). Marked as low-confidence CSB.`,
        confidence: 65,
      };
    }

    return {
      status: "validated",
      reason:
        `Reading is consistent with ${nearbyPoints.length} nearby validated survey points (local mean: ${mean.toFixed(1)}m). Depth of ${depth_m}m is within normal variation. Added to map as Crowdsourced Bathymetry.`,
      confidence: 82,
    };
  }

  // Rule 5 — No nearby reference points, apply basic domain knowledge
  if (depth_m < 2) {
    return {
      status: "flagged",
      reason:
        `Depth of ${depth_m}m is very shallow. While possible near shore, it may indicate a GPS or sensor error. Flagged for manual review.`,
      confidence: 40,
    };
  }

  return {
    status: "validated",
    reason:
      `No nearby reference points exist for statistical comparison. Reading of ${depth_m}m is within plausible coastal range. Added to map as unverified Crowdsourced Bathymetry.`,
    confidence: 55,
  };
}
