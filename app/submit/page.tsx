"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── African coastal bounding boxes for realistic auto-generated coordinates ───
const VOO_ZONES = [
  { name: "Gulf of Guinea (Lagos Approach)",    latMin: 6.30, latMax: 6.55, lonMin: 3.20, lonMax: 3.65, node: "NG" },
  { name: "Niger Delta Offshore",               latMin: 5.20, latMax: 5.80, lonMin: 4.80, lonMax: 6.20, node: "NG" },
  { name: "Mombasa Harbour Approach",           latMin: -4.15,latMax: -3.90,lonMin: 39.55,lonMax: 39.80,node: "KE" },
  { name: "Dar es Salaam Channel",              latMin: -7.00,latMax: -6.70,lonMin: 39.20,lonMax: 39.45,node: "KE" },
  { name: "Cape Town Table Bay",                latMin: -33.98,latMax:-33.82,lonMin:18.33, lonMax:18.55, node: "ZA" },
  { name: "Durban Harbour Approach",            latMin: -29.95,latMax:-29.80,lonMin:31.00, lonMax:31.15, node: "ZA" },
];

const VESSEL_IDS = [
  "TUG-LAGOS-ATLANTIC-07", "TUG-APAPA-DELTA-03", "FERRY-BAR BEACH-11",
  "VOO-MOMBASA-KIUNGA-02", "TUG-DURBAN-BLUFF-09", "VOO-CT-ROBBEN-14",
  "FERRY-LAGOS-BADAGRY-06", "TUG-PORT-HARCOURT-01",
];

function randBetween(min: number, max: number, decimals = 6) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

type PingLog = {
  id: number;
  vesselId: string;
  zone: string;
  lat: number;
  lon: number;
  depth_m: number;
  status: "validated" | "flagged" | "rejected" | "pending";
  reason: string;
  confidence: number;
  timestamp: string;
};

type IocFormState = {
  company: string;
  block: string;
  filename: string;
  acknowledged: boolean;
  licenseAgreed: boolean;
  licenseNumber: string;
};

export default function DataIngestionPage() {
  const [tab, setTab] = useState<"voo" | "ioc">("voo");

  return (
    <div style={{
      minHeight: "calc(100vh - 56px)",
      background: "var(--ocean-deepest)",
      backgroundImage: `
        radial-gradient(ellipse 70% 40% at 50% 0%, rgba(14,165,233,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 30% 30% at 80% 85%, rgba(34,197,94,0.04) 0%, transparent 50%)
      `,
      padding: "32px 16px 60px",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "680px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "4px 12px",
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
            borderRadius: "20px", fontSize: "11px", fontFamily: "var(--font-mono)",
            color: "var(--teal-muted)", letterSpacing: "0.08em", marginBottom: "12px",
          }}>
            📡 DATA INGESTION GATEWAY · AFRICAN MSDI
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "26px",
            fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "8px",
          }}>
            Data Ingestion Simulator
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Two automated ingestion pathways — no manual data entry required.
            Edge computing handles vessel telemetry; the governance gateway handles
            institutional lodgment from International Oil Companies.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "20px",
          background: "rgba(6,13,26,0.8)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "4px",
        }}>
          {([
            { key: "voo" as const, icon: "🛳", label: "VOO Edge-Node Simulator", sub: "Zero-touch automated sonar" },
            { key: "ioc" as const, icon: "🏭", label: "IOC Digital Lodgment Gateway", sub: "Data tax & drilling license policy" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: "7px", border: "none",
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                background: tab === t.key ? "var(--ocean-surface)" : "transparent",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)" }}>
                {t.icon} {t.label}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {tab === "voo" ? <VooTab /> : <IocTab />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB A — VOO Edge-Node Simulator
// ─────────────────────────────────────────────────────────────────────────────

function VooTab() {
  const [log, setLog] = useState<PingLog[]>([]);
  const [pinging, setPinging] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (autoMode) {
      autoRef.current = setInterval(() => { firePing(); }, 4000);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoMode]);

  async function firePing() {
    if (pinging) return;
    setPinging(true);
    const zone = VOO_ZONES[Math.floor(Math.random() * VOO_ZONES.length)];
    const vesselId = VESSEL_IDS[Math.floor(Math.random() * VESSEL_IDS.length)];
    const lat = randBetween(zone.latMin, zone.latMax, 6);
    const lon = randBetween(zone.lonMin, zone.lonMax, 6);
    const depth_m = parseFloat((Math.random() * 75 + 5).toFixed(2));
    const now = new Date().toISOString();
    const entryId = idRef.current++;

    setLog((prev) => [{
      id: entryId, vesselId, zone: zone.name, lat, lon, depth_m,
      status: "pending", reason: "Running ML anomaly detection...", confidence: 0, timestamp: now,
    }, ...prev.slice(0, 49)]);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vessel_id: vesselId, lat, lon, depth_m, reading_datetime: now }),
      });
      const data = await res.json();
      setLog((prev) => prev.map((e) =>
        e.id === entryId
          ? { ...e, status: data.validation.status, reason: data.validation.reason, confidence: data.validation.confidence }
          : e
      ));
    } catch {
      setLog((prev) => prev.map((e) =>
        e.id === entryId
          ? { ...e, status: "flagged", reason: "Network error — could not reach API", confidence: 0 }
          : e
      ));
    } finally {
      setPinging(false);
    }
  }

  const SC: Record<string, string> = { validated: "#22c55e", flagged: "#f59e0b", rejected: "#ef4444", pending: "#94a3b8" };
  const SL: Record<string, string> = { validated: "VALIDATED", flagged: "FLAGGED", rejected: "REJECTED", pending: "PROCESSING..." };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Architecture strip */}
      <div style={{
        background: "rgba(10,22,40,0.85)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "16px 18px",
      }}>
        <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "12px" }}>
          ZERO-TOUCH BLACK BOX ARCHITECTURE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { icon: "🛳", label: "Commercial VOO\n(Harbour Tug)", color: "#0ea5e9" },
            { arrow: "→", sub: "NMEA 0183" },
            { icon: "📦", label: "Edge Node\n(Black Box)", color: "#22c55e" },
            { arrow: "→", sub: "4G/VSAT" },
            { icon: "🌐", label: "ML QC Gateway\n(MSDI API)", color: "#a78bfa" },
            { arrow: "→", sub: "Validated" },
            { icon: "🗺", label: "Continental\nMap", color: "#fb923c" },
          ].map((s, i) =>
            "arrow" in s ? (
              <div key={i} style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{ color: "var(--border-bright)", fontSize: "16px" }}>→</div>
                <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>{s.sub}</div>
              </div>
            ) : (
              <div key={i} style={{
                flexShrink: 0, textAlign: "center", padding: "8px 10px", minWidth: "72px",
                background: `${s.color}12`, border: `1px solid ${s.color}30`, borderRadius: "8px",
              }}>
                <div style={{ fontSize: "20px" }}>{s.icon}</div>
                <div style={{ fontSize: "9px", color: s.color, whiteSpace: "pre-line", marginTop: "2px", fontFamily: "var(--font-mono)", lineHeight: 1.3 }}>{s.label}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Controls + log */}
      <div style={{ background: "rgba(10,22,40,0.85)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        {/* Control bar */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: autoMode ? "#22c55e" : "#475569",
              boxShadow: autoMode ? "0 0 8px #22c55e" : "none",
              animation: autoMode ? "blink 1.5s infinite" : "none",
            }} />
            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
            <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: autoMode ? "#22c55e" : "var(--text-muted)" }}>
              {autoMode ? "AUTO-PING ACTIVE" : "MANUAL MODE"}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => firePing()} disabled={pinging} style={{
              padding: "8px 14px", borderRadius: "7px", border: "none",
              background: pinging ? "rgba(14,165,233,0.15)" : "linear-gradient(135deg,#0891b2,#0ea5e9)",
              color: "white", fontSize: "12px", fontWeight: 600,
              cursor: pinging ? "default" : "pointer", opacity: pinging ? 0.7 : 1,
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              {pinging
                ? <><MiniSpinner /> Processing...</>
                : <>📡 Simulate Sonar Ping</>
              }
            </button>
            <button onClick={() => setAutoMode((v) => !v)} style={{
              padding: "8px 12px", borderRadius: "7px",
              background: autoMode ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
              border: `1px solid ${autoMode ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
              color: autoMode ? "#f87171" : "#22c55e",
              fontSize: "12px", fontWeight: 600, cursor: "pointer",
            }}>
              {autoMode ? "⏹ Stop" : "▶ Auto"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {[
            { l: "Total Pings", v: log.length, c: "var(--text-primary)" },
            { l: "Validated", v: log.filter(x => x.status === "validated").length, c: "#22c55e" },
            { l: "Flagged",   v: log.filter(x => x.status === "flagged").length,   c: "#f59e0b" },
            { l: "Rejected",  v: log.filter(x => x.status === "rejected").length,  c: "#ef4444" },
          ].map((s) => (
            <div key={s.l} style={{ flex: 1, padding: "10px 8px", textAlign: "center", borderRight: "1px solid var(--border)" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", color: s.c }}>{s.v}</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Telemetry log */}
        <div style={{ height: "280px", overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(6,13,26,0.6)" }}>
          {log.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
              Click "Simulate Sonar Ping" to generate vessel telemetry
            </div>
          )}
          {log.map((e) => (
            <div key={e.id} style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ color: "var(--teal-bright)", fontWeight: 600 }}>{e.vesselId}</span>
                <span style={{ padding: "1px 6px", borderRadius: "3px", fontSize: "10px", background: `${SC[e.status]}18`, color: SC[e.status], fontWeight: 600 }}>
                  {SL[e.status]}
                </span>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "10px", marginBottom: "2px" }}>
                {e.zone} · {new Date(e.timestamp).toLocaleTimeString()}
              </div>
              <div style={{ color: "#7dd3fc" }}>
                lat {e.lat.toFixed(5)} · lon {e.lon.toFixed(5)} · <strong style={{ color: "var(--text-primary)" }}>{e.depth_m}m</strong>
                {e.confidence > 0 && <span style={{ color: "#a78bfa", marginLeft: "8px" }}>conf: {e.confidence}%</span>}
              </div>
              {e.status !== "pending" && (
                <div style={{ color: "var(--text-muted)", fontSize: "10px", fontStyle: "italic", marginTop: "3px", lineHeight: 1.5 }}>
                  {e.reason.slice(0, 130)}{e.reason.length > 130 ? "..." : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link href="/" style={{
        textAlign: "center", padding: "9px", background: "rgba(14,165,233,0.08)",
        border: "1px solid var(--border)", borderRadius: "7px",
        color: "var(--teal-bright)", fontSize: "13px", textDecoration: "none",
      }}>
        View validated pings on the Discovery Map →
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB B — IOC Digital Lodgment Gateway
// ─────────────────────────────────────────────────────────────────────────────

const IOC_COMPANIES = [
  "Shell Petroleum Development Company (SPDC)",
  "Chevron Nigeria Limited (CNL)",
  "TotalEnergies EP Nigeria",
  "ExxonMobil Exploration & Production Nigeria",
  "ENI Nigeria / NAOC",
];

const OIL_BLOCKS = [
  "OML-118 (Bonga Deep-water, Nigeria)",
  "OML-130 (Akpo Field, Nigeria)",
  "OML-133 (Erha Field, Nigeria)",
  "Block 5C (Rovuma Basin, Mozambique)",
  "Block 15/06 (Angola Ultra-deepwater)",
  "OML-85 (Mombasa Offshore, Kenya)",
  "OML-140 (Agbami Field, Nigeria)",
];

function IocTab() {
  const [form, setForm] = useState<IocFormState>({
    company: "", block: "", filename: "",
    acknowledged: false, licenseAgreed: false, licenseNumber: "",
  });
  const [step, setStep] = useState<"form" | "processing" | "done">("form");

  function update<K extends keyof IocFormState>(k: K, v: IocFormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit() {
    if (!form.company || !form.block || !form.acknowledged || !form.licenseAgreed) return;
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2600));
    const year = new Date().getFullYear();
    update("licenseNumber", `NHA-DRL-${year}-${Math.floor(Math.random() * 9000) + 1000}`);
    setStep("done");
  }

  if (step === "processing") {
    return (
      <div style={{
        background: "rgba(10,22,40,0.85)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "52px 24px", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
      }}>
        <div style={{ width: "48px", height: "48px", border: "3px solid var(--teal-dim)", borderTop: "3px solid var(--teal-bright)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--teal-bright)" }}>Processing Digital Lodgment...</div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 2 }}>
          Verifying survey file integrity ✓<br />
          Registering lodgment fee (₦16,500,000) ✓<br />
          Ingesting to Sovereign Marine Cloud...<br />
          Issuing drilling license...
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "fadeUp 0.3s ease" }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Certificate */}
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px", padding: "22px" }}>
          <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>✓</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#22c55e" }}>Lodgment Accepted · Drilling License Issued</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "3px" }}>Survey data registered in Sovereign Marine Cloud · Decimated version queued for public MSDI</div>
            </div>
          </div>
          <div style={{ background: "rgba(6,13,26,0.7)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "10px" }}>DRILLING LICENSE CERTIFICATE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                ["License No.", form.licenseNumber],
                ["Issued by", "Nigerian Hydrographic Authority"],
                ["Company", form.company.split("(")[0].trim()],
                ["Block", form.block],
                ["Lodgment Fee", "₦16,500,000 (~$10,000 USD)"],
                ["Fee Status", "PAID ✓"],
                ["Data Custody", "NHA Sovereign Marine Cloud"],
                ["Data Center", "Rack Centre Lagos / Teraco JHB"],
                ["Valid Until", new Date(Date.now() + 365*24*60*60*1000*3).toLocaleDateString("en-GB", { year:"numeric",month:"long",day:"numeric" })],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{k}</div>
                  <div style={{ color: k === "Fee Status" ? "#22c55e" : k === "License No." ? "var(--teal-bright)" : "var(--text-primary)", fontWeight: k === "License No." ? 700 : 400 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policy note */}
        <div style={{ background: "rgba(14,165,233,0.05)", border: "1px solid rgba(14,165,233,0.15)", borderRadius: "10px", padding: "14px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--teal-muted)", marginBottom: "5px" }}>📋 How the Data Tax Governance Model Self-Funds the Infrastructure</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.7 }}>
            Each ₦16.5M lodgment fee funds physical server CAPEX at <strong style={{ color: "var(--text-secondary)" }}>Rack Centre Lagos</strong> and <strong style={{ color: "var(--text-secondary)" }}>Teraco Johannesburg</strong> — Africa's Tier-IV data centers. Because Africa <em>owns</em> the servers, the military data vault can be fully air-gapped (disconnected from public internet) while only the decimated safety layer is exposed via the API.
          </div>
        </div>

        <button onClick={() => { setStep("form"); setForm({ company:"",block:"",filename:"",acknowledged:false,licenseAgreed:false,licenseNumber:"" }); }}
          style={{ padding: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>
          Submit another lodgment
        </button>
      </div>
    );
  }

  const canSubmit = !!(form.company && form.block && form.acknowledged && form.licenseAgreed);

  return (
    <div style={{ background: "rgba(10,22,40,0.85)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }} />
        <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.08em" }}>IOC SURVEY DATA LODGMENT · GOVERNANCE PORTAL</span>
      </div>

      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Policy notice */}
        <div style={{ padding: "12px 14px", borderRadius: "8px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#f59e0b", marginBottom: "5px" }}>⚖ Mandatory Data Lodgment Policy</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Under the proposed African Ocean Data Governance Framework, all IOCs conducting surveys in African EEZs must lodge full-resolution bathymetric data with the relevant NHA before drilling licenses are issued. Fee: <strong style={{ color: "#fbbf24" }}>$10,000 USD per survey block</strong>.
          </div>
        </div>

        {/* Company */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Oil company <span style={{ color: "#f59e0b" }}>*</span></label>
          <select value={form.company} onChange={(e) => update("company", e.target.value)} style={sel}>
            <option value="" style={{ background: "#0a1628" }}>Select company...</option>
            {IOC_COMPANIES.map((c) => <option key={c} value={c} style={{ background: "#0a1628" }}>{c}</option>)}
          </select>
        </div>

        {/* Block */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Survey block / licence area <span style={{ color: "#f59e0b" }}>*</span></label>
          <select value={form.block} onChange={(e) => update("block", e.target.value)} style={sel}>
            <option value="" style={{ background: "#0a1628" }}>Select block...</option>
            {OIL_BLOCKS.map((b) => <option key={b} value={b} style={{ background: "#0a1628" }}>{b}</option>)}
          </select>
        </div>

        {/* File upload */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Survey data file <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>(.segy · .csar · .bag)</span></label>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "7px", background: "rgba(6,13,26,0.8)", border: "1px solid var(--border)", cursor: "pointer" }}>
            <span style={{ fontSize: "16px" }}>📂</span>
            <span style={{ fontSize: "13px", color: form.filename ? "var(--text-primary)" : "var(--text-muted)" }}>
              {form.filename || "Choose survey file..."}
            </span>
            <input type="file" accept=".segy,.bag,.csar,.xyz,.csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) update("filename", f.name); }} style={{ display: "none" }} />
          </label>
        </div>

        {/* Checkboxes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Check checked={form.acknowledged} onChange={(v) => update("acknowledged", v)} color="#f59e0b"
            label={<>I acknowledge the <strong style={{ color: "#fbbf24" }}>₦16,500,000 Digital Lodgment Fee</strong> (~$10,000 USD) payable to the National Hydrographic Authority</>} />
          <Check checked={form.licenseAgreed} onChange={(v) => update("licenseAgreed", v)} color="#0ea5e9"
            label="I confirm that full-resolution survey data will be lodged with the NHA Sovereign Marine Cloud, and that a decimated public-safety version will be published on the African MSDI Discovery Portal" />
        </div>

        <button onClick={handleSubmit} disabled={!canSubmit} style={{
          padding: "12px", borderRadius: "8px", border: "none",
          background: canSubmit ? "linear-gradient(135deg, #b45309, #f59e0b)" : "rgba(255,255,255,0.05)",
          color: canSubmit ? "white" : "var(--text-muted)",
          fontSize: "14px", fontWeight: 600, cursor: canSubmit ? "pointer" : "default", transition: "all 0.15s",
        }}>
          🏭 Submit Lodgment & Generate Drilling License
        </button>
      </div>
    </div>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function MiniSpinner() {
  return <div style={{ width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />;
}

function Check({ checked, onChange, label, color }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode; color: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
      <div onClick={() => onChange(!checked)} style={{
        width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, marginTop: "1px",
        background: checked ? `${color}20` : "rgba(6,13,26,0.8)",
        border: `1px solid ${checked ? color : "var(--border)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s", cursor: "pointer",
      }}>
        {checked && <span style={{ color, fontSize: "12px", fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{label}</span>
    </div>
  );
}

const sel: React.CSSProperties = {
  width: "100%", background: "rgba(6,13,26,0.8)", border: "1px solid var(--border)",
  borderRadius: "7px", color: "var(--text-primary)", padding: "10px 12px",
  fontSize: "13px", cursor: "pointer", outline: "none",
};
