"use client";

import { useEffect, useRef } from "react";
import type { DataPoint, CsbSubmission } from "@/lib/db";

type MapProps = {
  datasets: DataPoint[];
  submissions: CsbSubmission[];
  onPointClick: (data: { type: "dataset" | "csb"; item: DataPoint | CsbSubmission }) => void;
  adminView: boolean;
};

const NODE_COLOURS: Record<string, string> = {
  NG: "#22c55e",
  KE: "#60a5fa",
  ZA: "#f87171",
};

const CSB_COLOURS: Record<string, string> = {
  validated: "#fb923c",
  flagged: "#94a3b8",
  rejected: "#6b7280",
};

function createSvgIcon(color: string, size = 10, ring = true): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size * 3}" height="${size * 3}" viewBox="0 0 30 30">
      ${ring ? `<circle cx="15" cy="15" r="13" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1" stroke-opacity="0.4"/>` : ""}
      <circle cx="15" cy="15" r="7" fill="${color}" fill-opacity="0.9" stroke="${color}" stroke-width="1.5"/>
      <circle cx="15" cy="15" r="3" fill="white" fill-opacity="0.6"/>
    </svg>
  `;
}

export default function MapClient({ datasets, submissions, onPointClick, adminView }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<ReturnType<typeof import("leaflet")["map"]> | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || leafletRef.current) return;

      // React Strict Mode can remount before the async import resolves in dev.
      // If that happens, Leaflet still sees the old container as initialized.
      delete (mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const map = L.map(mapRef.current!, {
        center: [2, 20], zoom: 4,
        zoomControl: true, attributionControl: true,
        minZoom: 2, maxZoom: 17,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors | African MSDI',
        maxZoom: 19,
      }).addTo(map);
      leafletRef.current = map;
      renderMarkers(L, map, datasets, submissions, adminView, onPointClick);
    });

    return () => {
      cancelled = true;

      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }

      if (mapRef.current) {
        delete (mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!leafletRef.current) return;
    import("leaflet").then((L) => {
      if (!leafletRef.current) return;
      renderMarkers(L, leafletRef.current, datasets, submissions, adminView, onPointClick);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets, submissions, adminView]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── Marker rendering (extracted so it can reference latest adminView) ────────

function renderMarkers(
  L: typeof import("leaflet"),
  map: ReturnType<typeof import("leaflet")["map"]>,
  datasets: DataPoint[],
  submissions: CsbSubmission[],
  adminView: boolean,
  onPointClick: MapProps["onPointClick"]
) {
  // Clear existing
  map.eachLayer((layer) => {
    if ((layer as unknown as Record<string,unknown>)._icon !== undefined) map.removeLayer(layer);
  });

  // ── DATA DECIMATION ──────────────────────────────────────────────────────
  // Public view:   every 3rd point only (sparse), depth rounded to 1 d.p.
  // Military view: all points (dense), depth precise to 3 d.p.
  const pointsToRender = adminView
    ? datasets
    : datasets.filter((_, i) => i % 3 === 0);

  pointsToRender.forEach((point) => {
    const color = NODE_COLOURS[point.node_code] ?? "#94a3b8";
    const size = adminView ? 12 : 9;
    const icon = L.divIcon({
      html: createSvgIcon(color, size, adminView),
      className: "",
      iconSize: [size * 3, size * 3],
      iconAnchor: [size * 1.5, size * 1.5],
      popupAnchor: [0, -(size * 1.5)],
    });
    const marker = L.marker([Number(point.lat), Number(point.lon)], { icon });
    marker.bindPopup(buildOfficialPopup(point, adminView), { maxWidth: 300 });
    marker.on("click", () => onPointClick({ type: "dataset", item: point }));
    marker.addTo(map);
  });

  // ── VOO / CSB points ─────────────────────────────────────────────────────
  submissions.forEach((sub) => {
    if (sub.validation_status === "rejected") return;
    const color = CSB_COLOURS[sub.validation_status] ?? "#94a3b8";
    const icon = L.divIcon({
      html: createSvgIcon(color, 7, false),
      className: "",
      iconSize: [21, 21],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
    const marker = L.marker([Number(sub.lat), Number(sub.lon)], { icon });
    marker.bindPopup(buildCsbPopup(sub), { maxWidth: 280 });
    marker.on("click", () => onPointClick({ type: "csb", item: sub }));
    marker.addTo(map);
  });
}

function buildOfficialPopup(point: DataPoint, isAdmin: boolean): string {
  const flags: Record<string, string> = { NG: "🇳🇬", KE: "🇰🇪", ZA: "🇿🇦" };
  const flag = flags[point.node_code] ?? "🌍";
  const color = NODE_COLOURS[point.node_code] ?? "#94a3b8";

  // DATA DECIMATION: public sees rounded depth; military sees full precision
  const depthDisplay = isAdmin
    ? `${Number(point.depth_m).toFixed(3)} m`
    : `${Number(point.depth_m).toFixed(1)} m`;

  const coordDisplay = isAdmin
    ? `${Number(point.lat).toFixed(5)}, ${Number(point.lon).toFixed(5)}`
    : `${Number(point.lat).toFixed(2)}, ${Number(point.lon).toFixed(2)} (decimated)`;

  return `
    <div style="font-family:'DM Sans',sans-serif;font-size:13px;line-height:1.5">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12)">
        <span style="font-size:18px">${flag}</span>
        <div>
          <div style="font-weight:600;color:#e2e8f0;font-size:13px">${point.node_country}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${color}">${point.dataset_id}</div>
        </div>
      </div>
      ${isAdmin ? `<div style="margin-bottom:6px;padding:3px 7px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#f87171">🪖 MILITARY VIEW · FULL RESOLUTION</div>` : `<div style="margin-bottom:6px;padding:3px 7px;background:rgba(148,163,184,0.08);border:1px solid rgba(148,163,184,0.2);border-radius:4px;font-size:10px;font-family:'JetBrains Mono',monospace;color:#94a3b8">🌐 PUBLIC VIEW · DECIMATED DATA</div>`}
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Custodian</td>
          <td style="color:#e2e8f0;padding:2px 0 2px 8px;font-size:11px;text-align:right">${point.custodian}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Survey date</td>
          <td style="color:#e2e8f0;padding:2px 0 2px 8px;font-size:12px;text-align:right">${point.survey_date ?? "Unknown"}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Depth</td>
          <td style="color:${isAdmin ? "#0ea5e9" : "#e2e8f0"};padding:2px 0 2px 8px;font-size:12px;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:${isAdmin ? "700" : "400"}">${depthDisplay}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Coordinates</td>
          <td style="color:${isAdmin ? "#7dd3fc" : "#475569"};padding:2px 0 2px 8px;font-size:11px;text-align:right;font-family:'JetBrains Mono',monospace">${coordDisplay}</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Access</td>
          <td style="padding:2px 0 2px 8px;text-align:right">
            <span style="background:rgba(251,146,60,0.15);color:#fb923c;padding:1px 6px;border-radius:4px;font-size:11px">RESTRICTED</span>
          </td>
        </tr>
      </table>
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#94a3b8">
        ${isAdmin ? "🔓 Air-gapped Sovereign Cloud · Full resolution available" : "🔒 Decimated layer · Toggle Military View for full data"}
      </div>
    </div>
  `;
}

function buildCsbPopup(sub: CsbSubmission): string {
  const SM: Record<string, { label: string; color: string; bg: string }> = {
    validated: { label: "VALIDATED", color: "#fb923c", bg: "rgba(251,146,60,0.15)" },
    flagged:   { label: "FLAGGED",   color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
    rejected:  { label: "REJECTED",  color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
  };
  const s = SM[sub.validation_status] ?? SM.flagged;
  return `
    <div style="font-family:'DM Sans',sans-serif;font-size:13px;line-height:1.5">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12)">
        <span style="font-size:18px">🛳</span>
        <div>
          <div style="font-weight:600;color:#e2e8f0;font-size:13px">VOO Edge-Node Data</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#fb923c">CSB-${sub.id} · ${sub.vessel_id}</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">ML Status</td>
          <td style="padding:2px 0 2px 8px;text-align:right">
            <span style="background:${s.bg};color:${s.color};padding:1px 6px;border-radius:4px;font-size:11px;font-weight:500">${s.label}</span>
          </td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Depth</td>
          <td style="color:#0ea5e9;padding:2px 0 2px 8px;font-size:12px;text-align:right;font-family:'JetBrains Mono',monospace;font-weight:600">${Number(sub.depth_m).toFixed(1)} m</td>
        </tr>
        <tr>
          <td style="color:#94a3b8;padding:2px 0;font-size:12px">Vessel</td>
          <td style="color:#e2e8f0;padding:2px 0 2px 8px;font-size:12px;text-align:right">${sub.vessel_id}</td>
        </tr>
      </table>
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#94a3b8;font-style:italic">
        ML QC: ${sub.validation_reason?.substring(0, 100)}...
      </div>
    </div>
  `;
}
