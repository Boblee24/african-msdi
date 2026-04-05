"use client";

import { useState, useEffect } from "react";
import type { DataPoint, CsbSubmission } from "@/lib/db";

type Props = {
  selected: { type: "dataset" | "csb"; item: DataPoint | CsbSubmission } | null;
  onClose: () => void;
};

export default function ApiPanel({ selected, onClose }: Props) {
  const [apiData, setApiData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selected) { setApiData(null); return; }
    fetchApiData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  async function fetchApiData() {
    if (!selected) return;
    setLoading(true);
    setApiData(null);

    try {
      const id =
        selected.type === "dataset"
          ? (selected.item as DataPoint).dataset_id
          : String((selected.item as CsbSubmission).id);

      const res = await fetch(`/api/datasets/${id}`);
      const data = await res.json();
      setApiData(data);
    } catch {
      setApiData({ error: "Failed to fetch API response" });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!apiData) return;
    navigator.clipboard.writeText(JSON.stringify(apiData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!selected) return null;

  const isDataset = selected.type === "dataset";
  const item = selected.item as DataPoint & CsbSubmission;

  return (
    <div style={{
      position: "absolute",
      top: 0, right: 0, bottom: 0,
      width: "380px",
      background: "rgba(6,13,26,0.97)",
      borderLeft: "1px solid var(--border-bright)",
      backdropFilter: "blur(16px)",
      display: "flex",
      flexDirection: "column",
      zIndex: 500,
      animation: "slideIn 0.2s ease",
    }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div>
          <div style={{
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "var(--teal-bright)",
            letterSpacing: "0.1em",
            marginBottom: "4px",
          }}>
            S-100 API RESPONSE
          </div>
          <div style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}>
            {isDataset ? item.dataset_id : `CSB-${item.id}`}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {isDataset ? item.custodian : `Vessel ${item.vessel_id}`}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            width: "28px", height: "28px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>

      {/* Endpoint badge */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          background: "rgba(14,165,233,0.08)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "8px 10px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--teal-muted)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{
            background: "rgba(34,197,94,0.15)",
            color: "#22c55e",
            padding: "1px 6px",
            borderRadius: "3px",
            fontSize: "10px",
            fontWeight: 600,
          }}>GET</span>
          <span style={{ color: "var(--text-secondary)" }}>
            /api/datasets/{isDataset ? item.dataset_id : item.id}
          </span>
        </div>
      </div>

      {/* RBAC notice for restricted data */}
      {isDataset && item.access_level === "restricted" && (
        <div style={{
          margin: "12px 16px 0",
          padding: "10px 12px",
          background: "rgba(251,146,60,0.07)",
          border: "1px solid rgba(251,146,60,0.25)",
          borderRadius: "6px",
          fontSize: "11px",
          color: "#d97706",
          lineHeight: 1.6,
        }}>
          <strong>🔒 Restricted Dataset</strong><br />
          Full-resolution depth grid requires institutional authentication (MEDIN RBAC model). This response shows public metadata + single point. Toggle <em>Admin View</em> on the map to see full coordinates.
        </div>
      )}

      {/* JSON response */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "12px 16px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            200 OK · application/json
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: "rgba(14,165,233,0.1)",
              border: "1px solid var(--border)",
              color: copied ? "#22c55e" : "var(--teal-bright)",
              padding: "3px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              transition: "color 0.2s",
            }}
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>

        <div style={{
          flex: 1,
          overflow: "auto",
          background: "rgba(6,13,26,0.8)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "14px",
          fontFamily: "var(--font-mono)",
          fontSize: "11.5px",
          lineHeight: 1.7,
          color: "var(--text-primary)",
        }}>
          {loading && (
            <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
              Fetching S-100 response...
            </div>
          )}
          {!loading && apiData && (
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {syntaxHighlight(apiData)}
            </pre>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 16px",
        borderTop: "1px solid var(--border)",
        fontSize: "10px",
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
      }}>
        IHO S-102 Bathymetric Surface · WGS84 · MLLW datum
      </div>
    </div>
  );
}

function syntaxHighlight(obj: unknown): React.ReactNode {
  const json = JSON.stringify(obj, null, 2);
  const lines = json.split("\n");

  return lines.map((line, i) => {
    // Key: value highlighting
    const keyMatch = line.match(/^(\s*)("[\w\s]+")(:\s*)(.*)$/);
    if (keyMatch) {
      const [, indent, key, colon, value] = keyMatch;
      let valueColor = "#e2e8f0";
      if (value.startsWith('"')) valueColor = "#86efac"; // strings - green
      else if (value === "true" || value === "false") valueColor = "#fbbf24"; // bool
      else if (value === "null") valueColor = "#94a3b8"; // null
      else if (!isNaN(Number(value.replace(/,\s*$/, "")))) valueColor = "#7dd3fc"; // numbers

      return (
        <span key={i}>
          {indent}
          <span style={{ color: "#93c5fd" }}>{key}</span>
          <span style={{ color: "#475569" }}>{colon}</span>
          <span style={{ color: valueColor }}>{value}</span>
          {"\n"}
        </span>
      );
    }
    return <span key={i} style={{ color: "#475569" }}>{line}{"\n"}</span>;
  });
}
