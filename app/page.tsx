"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import FilterPanel from "@/components/FilterPanel";
import ApiPanel from "@/components/ApiPanel";
import type { DataPoint, CsbSubmission } from "@/lib/db";

// Leaflet must be client-side only
const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--ocean-deep)",
      flexDirection: "column", gap: "16px",
    }}>
      <div style={{
        width: "40px", height: "40px",
        border: "2px solid var(--teal-dim)",
        borderTop: "2px solid var(--teal-bright)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
        Loading African MSDI...
      </span>
    </div>
  ),
});

type Filters = { country: string; confidence: string; source: string };
type Selected = { type: "dataset" | "csb"; item: DataPoint | CsbSubmission } | null;

export default function DiscoveryPortal() {
  const [allDatasets, setAllDatasets] = useState<DataPoint[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<CsbSubmission[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<DataPoint[]>([]);
  const [filters, setFilters] = useState<Filters>({ country: "all", confidence: "all", source: "all" });
  const [selected, setSelected] = useState<Selected>(null);
  const [adminView, setAdminView] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/datasets");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAllDatasets(data.datasets ?? []);
      setAllSubmissions(data.submissions ?? []);
      setFilteredDatasets(data.datasets ?? []);
    } catch (e) {
      setError("Could not connect to database. Check your DATABASE_URL in .env.local and run: npm run seed");
      console.error(e);
    }
  }

  // Apply filters client-side for instant response
  useEffect(() => {
    let result = [...allDatasets];
    if (filters.country !== "all") result = result.filter((d) => d.node_code === filters.country);
    if (filters.confidence !== "all") result = result.filter((d) => d.confidence_level === filters.confidence);
    if (filters.source !== "all") result = result.filter((d) => d.data_source === filters.source);
    setFilteredDatasets(result);
  }, [filters, allDatasets]);

  const handlePointClick = useCallback((data: Selected) => {
    setSelected(data);
  }, []);

  const stats = {
    nigeria: allDatasets.filter((d) => d.node_code === "NG").length,
    kenya:   allDatasets.filter((d) => d.node_code === "KE").length,
    sa:      allDatasets.filter((d) => d.node_code === "ZA").length,
    csb:     allSubmissions.filter((s) => s.validation_status === "validated").length,
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 56px)", overflow: "hidden" }}>

      {/* Error banner */}
      {error && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000,
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.4)",
          borderTop: "none",
          padding: "10px 16px",
          fontSize: "12px",
          color: "#fca5a5",
          fontFamily: "var(--font-mono)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Leaflet map — full background */}
      <MapClient
        datasets={filteredDatasets}
        submissions={allSubmissions}
        onPointClick={handlePointClick}
        adminView={adminView}
      />

      {/* Filter + legend panel — top left */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        stats={stats}
        adminView={adminView}
        onAdminToggle={() => setAdminView((v) => !v)}
      />

      {/* Header card — top centre */}
      <div style={{
        position: "absolute",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 400,
        background: "rgba(6,13,26,0.9)",
        border: "1px solid var(--border-bright)",
        borderRadius: "10px",
        backdropFilter: "blur(12px)",
        padding: "10px 20px",
        textAlign: "center",
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "0.01em",
        }}>
          Federated African Marine Spatial Data Infrastructure
        </div>
        <div style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          marginTop: "3px",
          letterSpacing: "0.05em",
        }}>
          DISCOVERY PORTAL · IHO S-100 COMPLIANT · 3 NATIONAL NODES
        </div>
      </div>

      {/* Instruction hint — bottom centre (hidden when panel open) */}
      {!selected && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 400,
          background: "rgba(6,13,26,0.85)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "7px 16px",
          fontSize: "12px",
          color: "var(--text-muted)",
          backdropFilter: "blur(8px)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          Click any marker to inspect its dataset · Use filters to explore nodes
        </div>
      )}

      {/* S-100 API side panel */}
      <div style={{
        position: "absolute",
        top: 0, right: 0, bottom: 0,
        width: selected ? "380px" : "0",
        overflow: "hidden",
        transition: "width 0.25s ease",
        zIndex: 450,
      }}>
        <ApiPanel selected={selected} onClose={() => setSelected(null)} />
      </div>

    </div>
  );
}
