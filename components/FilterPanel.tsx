"use client";

type Filters = { country: string; confidence: string; source: string };

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  stats: { nigeria: number; kenya: number; sa: number; csb: number };
  adminView: boolean;
  onAdminToggle: () => void;
};

export default function FilterPanel({ filters, onChange, stats, adminView, onAdminToggle }: Props) {
  function update(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div style={{
      position: "absolute",
      top: "12px", left: "12px",
      zIndex: 500, width: "226px",
      display: "flex", flexDirection: "column", gap: "8px",
    }}>
      {/* Filter box */}
      <div style={{
        background: "rgba(6,13,26,0.92)",
        border: "1px solid var(--border-bright)",
        borderRadius: "10px",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "9px 14px", borderBottom: "1px solid var(--border)",
          fontSize: "10px", fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em", color: "var(--teal-bright)",
        }}>
          FILTER DATASETS
        </div>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <FilterSelect label="Country node" value={filters.country} onChange={(v) => update("country", v)}
            options={[
              { value: "all", label: "All nodes" },
              { value: "NG", label: "🇳🇬 Nigeria (NHA)" },
              { value: "KE", label: "🇰🇪 Kenya (KMA)" },
              { value: "ZA", label: "🇿🇦 South Africa (SANHO)" },
            ]}
          />
          <FilterSelect label="Confidence" value={filters.confidence} onChange={(v) => update("confidence", v)}
            options={[
              { value: "all", label: "All levels" },
              { value: "high", label: "High (official)" },
              { value: "low-csb", label: "Low (CSB)" },
            ]}
          />
          <FilterSelect label="Data source" value={filters.source} onChange={(v) => update("source", v)}
            options={[
              { value: "all", label: "All sources" },
              { value: "official_survey", label: "Official survey" },
              { value: "crowdsourced_bathymetry", label: "VOO Edge-Node" },
            ]}
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{
        background: "rgba(6,13,26,0.92)", border: "1px solid var(--border)",
        borderRadius: "10px", backdropFilter: "blur(12px)", padding: "12px 14px",
      }}>
        <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>
          LEGEND
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          <LegendItem color="#22c55e" label="Nigeria / NHA" count={stats.nigeria} />
          <LegendItem color="#60a5fa" label="Kenya / KMA" count={stats.kenya} />
          <LegendItem color="#f87171" label="South Africa / SANHO" count={stats.sa} />
          <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }} />
          <LegendItem color="#fb923c" label="VOO — Validated" count={stats.csb} small />
          <LegendItem color="#94a3b8" label="VOO — Flagged" count={null} small />
        </div>
      </div>

      {/* ── Data Decimation / Military Toggle ── */}
      <div style={{
        background: adminView ? "rgba(239,68,68,0.07)" : "rgba(6,13,26,0.92)",
        border: `1px solid ${adminView ? "rgba(239,68,68,0.5)" : "var(--border)"}`,
        borderRadius: "10px",
        backdropFilter: "blur(12px)",
        padding: "10px 14px",
        transition: "all 0.25s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px" }}>{adminView ? "🪖" : "🌐"}</span>
            <span style={{
              fontSize: "10px", fontFamily: "var(--font-mono)",
              letterSpacing: "0.07em", fontWeight: 600,
              color: adminView ? "#f87171" : "var(--text-muted)",
            }}>
              {adminView ? "NAVY / MILITARY" : "PUBLIC / COMMERCIAL"}
            </span>
          </div>
          <Toggle checked={adminView} onChange={onAdminToggle} danger={adminView} />
        </div>

        <div style={{
          fontSize: "11px", lineHeight: 1.55,
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "7px",
          color: adminView ? "#fca5a5" : "var(--text-muted)",
        }}>
          {adminView ? (
            <>
              <strong style={{ color: "#f87171" }}>High-resolution:</strong> precise to 3 decimal places · dense point clusters · full depth values
            </>
          ) : (
            <>
              <strong style={{ color: "var(--text-secondary)" }}>Decimated:</strong> rounded to 1 d.p. · sparse clusters · commercial safety layer only
            </>
          )}
        </div>

        {adminView && (
          <div style={{
            marginTop: "8px", padding: "3px 8px",
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)",
            color: "#f87171", letterSpacing: "0.05em",
          }}>
            ⚠ RESTRICTED · NHO AUTHENTICATED ACCESS
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        background: "rgba(6,13,26,0.85)", border: "1px solid var(--border)",
        borderRadius: "10px", backdropFilter: "blur(12px)", padding: "10px 14px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <StatPill label="Nodes" value="3" color="var(--teal-bright)" />
          <StatPill label="Points" value={String(stats.nigeria + stats.kenya + stats.sa)} color="var(--text-primary)" />
          <StatPill label="VOO" value={String(stats.csb)} color="var(--csb-orange)" />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: "100%", background: "rgba(15,32,64,0.8)",
        border: "1px solid var(--border)", borderRadius: "6px",
        color: "var(--text-primary)", padding: "5px 8px", fontSize: "12px",
        cursor: "pointer", outline: "none",
      }}>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#0a1628" }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function LegendItem({ color, label, count, small }: { color: string; label: string; count: number | null; small?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: small ? "8px" : "10px", height: small ? "8px" : "10px",
        borderRadius: "50%", background: color, flexShrink: 0,
        boxShadow: `0 0 5px ${color}55`,
      }} />
      <span style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1 }}>{label}</span>
      {count !== null && (
        <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "0 5px", borderRadius: "3px" }}>
          {count}
        </span>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, danger }: { checked: boolean; onChange: () => void; danger?: boolean }) {
  return (
    <button onClick={onChange} style={{
      width: "36px", height: "20px", borderRadius: "10px",
      background: checked
        ? danger
          ? "linear-gradient(90deg, #b91c1c, #ef4444)"
          : "linear-gradient(90deg, var(--teal-muted), var(--teal-bright))"
        : "rgba(255,255,255,0.1)",
      border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: "2px",
        left: checked ? "18px" : "2px",
        width: "16px", height: "16px", borderRadius: "50%",
        background: "white", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "18px", fontFamily: "var(--font-mono)", fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}
