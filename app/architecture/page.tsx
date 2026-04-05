export default function ArchitecturePage() {
  return (
    <div style={{
      minHeight: "calc(100vh - 56px)",
      background: "var(--ocean-deepest)",
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.07) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 80% 90%, rgba(34,197,94,0.04) 0%, transparent 50%)
      `,
      padding: "40px 24px 60px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Page header */}
      <div style={{ textAlign: "center", marginBottom: "40px", maxWidth: "640px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 14px",
          background: "rgba(14,165,233,0.08)",
          border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: "20px",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
          color: "var(--teal-muted)",
          letterSpacing: "0.08em",
          marginBottom: "16px",
        }}>
          SYSTEM ARCHITECTURE
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "30px",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "12px",
          lineHeight: 1.2,
        }}>
          Federated African MSDI — Architecture
        </h1>
        <p style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}>
          A federated model where each nation retains data sovereignty while exposing it through IHO S-100 APIs to a continental discovery portal. Commercial VOOs contribute zero-touch bathymetric data. IOC Digital Lodgment Fees self-fund a Sovereign African Cloud hosted at indigenous Tier-IV data centers.
        </p>
      </div>

      {/* Main architecture SVG */}
      <div style={{
        width: "100%",
        maxWidth: "900px",
        background: "rgba(10,22,40,0.7)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "40px 32px",
        backdropFilter: "blur(8px)",
      }}>
        <svg
          viewBox="0 0 860 520"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto" }}
        >
          <defs>
            <marker id="arrowTeal" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#0ea5e9" fillOpacity="0.8" />
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#22c55e" fillOpacity="0.7" />
            </marker>
            <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#fb923c" fillOpacity="0.8" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="ngGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="keGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="zaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f87171" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ── Central Portal ── */}
          <rect x="280" y="190" width="300" height="130" rx="14"
            fill="url(#portalGrad)" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.6" />
          <text x="430" y="224" textAnchor="middle" fill="#e2e8f0"
            fontSize="13" fontWeight="700" fontFamily="Crimson Pro, Georgia, serif">
            Federated Discovery Portal
          </text>
          <text x="430" y="243" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            african-msdi.vercel.app
          </text>
          <rect x="310" y="255" width="240" height="22" rx="5"
            fill="rgba(14,165,233,0.1)" stroke="rgba(14,165,233,0.3)" strokeWidth="1" />
          <text x="430" y="270" textAnchor="middle" fill="#0ea5e9" fontSize="10" fontFamily="monospace">
            S-100 API Gateway · RBAC · Data Decimation
          </text>
          <rect x="310" y="284" width="112" height="22" rx="5"
            fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
          <text x="366" y="299" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="monospace">
            Spatial Discovery
          </text>
          <rect x="428" y="284" width="122" height="22" rx="5"
            fill="rgba(251,146,60,0.08)" stroke="rgba(251,146,60,0.25)" strokeWidth="1" />
          <text x="489" y="299" textAnchor="middle" fill="#fb923c" fontSize="10" fontFamily="monospace">
            CSB Ingestion · ML QC
          </text>

          {/* ── Node: Nigeria ── */}
          <rect x="30" y="40" width="200" height="140" rx="12"
            fill="url(#ngGrad)" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="58" cy="68" r="10" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5" />
          <text x="58" y="73" textAnchor="middle" fill="#22c55e" fontSize="11">🇳🇬</text>
          <text x="130" y="72" textAnchor="middle" fill="#e2e8f0"
            fontSize="12" fontWeight="700" fontFamily="Crimson Pro, Georgia, serif">
            Nigeria — NHA
          </text>
          <text x="130" y="90" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            National Node
          </text>
          <rect x="50" y="102" width="160" height="18" rx="4"
            fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
          <text x="130" y="115" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="monospace">
            Teledyne CARIS · 20 points
          </text>
          <rect x="50" y="125" width="160" height="18" rx="4"
            fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
          <text x="130" y="138" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace">
            Lagos coastline · Gulf of Guinea
          </text>
          <rect x="50" y="148" width="160" height="18" rx="4"
            fill="rgba(14,165,233,0.06)" stroke="rgba(14,165,233,0.15)" strokeWidth="1" />
          <text x="130" y="161" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
            REST S-102 API endpoint
          </text>

          {/* ── Node: Kenya ── */}
          <rect x="630" y="40" width="200" height="140" rx="12"
            fill="url(#keGrad)" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="658" cy="68" r="10" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="1.5" />
          <text x="658" y="73" textAnchor="middle" fill="#60a5fa" fontSize="11">🇰🇪</text>
          <text x="730" y="72" textAnchor="middle" fill="#e2e8f0"
            fontSize="12" fontWeight="700" fontFamily="Crimson Pro, Georgia, serif">
            Kenya — KMA
          </text>
          <text x="730" y="90" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            National Node
          </text>
          <rect x="650" y="102" width="160" height="18" rx="4"
            fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
          <text x="730" y="115" textAnchor="middle" fill="#bfdbfe" fontSize="9" fontFamily="monospace">
            Kenya Navy MBES · 20 points
          </text>
          <rect x="650" y="125" width="160" height="18" rx="4"
            fill="rgba(96,165,250,0.05)" stroke="rgba(96,165,250,0.15)" strokeWidth="1" />
          <text x="730" y="138" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">
            Mombasa harbour · East Africa
          </text>
          <rect x="650" y="148" width="160" height="18" rx="4"
            fill="rgba(14,165,233,0.06)" stroke="rgba(14,165,233,0.15)" strokeWidth="1" />
          <text x="730" y="161" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
            REST S-102 API endpoint
          </text>

          {/* ── Node: South Africa ── */}
          <rect x="330" y="400" width="200" height="100" rx="12"
            fill="url(#zaGrad)" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.7" />
          <text x="430" y="428" textAnchor="middle" fill="#e2e8f0"
            fontSize="12" fontWeight="700" fontFamily="Crimson Pro, Georgia, serif">
            South Africa — SANHO
          </text>
          <text x="430" y="445" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            National Node / OCIMS
          </text>
          <rect x="350" y="456" width="160" height="16" rx="4"
            fill="rgba(248,113,113,0.08)" stroke="rgba(248,113,113,0.2)" strokeWidth="1" />
          <text x="430" y="468" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">
            OCIMS · Esri ArcGIS · 20 points
          </text>
          <rect x="350" y="477" width="160" height="16" rx="4"
            fill="rgba(14,165,233,0.06)" stroke="rgba(14,165,233,0.15)" strokeWidth="1" />
          <text x="430" y="489" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
            Cape Town · Durban approaches
          </text>

          {/* ── CSB Contributor ── */}
          <rect x="30" y="350" width="180" height="100" rx="12"
            fill="rgba(251,146,60,0.08)" stroke="#fb923c" strokeWidth="1.5" strokeOpacity="0.6" />
          <text x="120" y="378" textAnchor="middle" fill="#e2e8f0"
            fontSize="12" fontWeight="700" fontFamily="Crimson Pro, Georgia, serif">
            🛳 VOO Edge-Node
          </text>
          <text x="120" y="395" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Commercial Vessel of Opportunity
          </text>
          <rect x="48" y="405" width="144" height="16" rx="4"
            fill="rgba(251,146,60,0.08)" stroke="rgba(251,146,60,0.2)" strokeWidth="1" />
          <text x="120" y="417" textAnchor="middle" fill="#fdba74" fontSize="9" fontFamily="monospace">
            Zero-Touch Black Box · NMEA
          </text>
          <rect x="48" y="426" width="144" height="16" rx="4"
            fill="rgba(251,146,60,0.05)" stroke="rgba(251,146,60,0.15)" strokeWidth="1" />
          <text x="120" y="438" textAnchor="middle" fill="#fdba74" fontSize="9" fontFamily="monospace">
            Edge Compute → 4G/VSAT → API
          </text>

          {/* ── Institutional User ── */}
          <rect x="650" y="350" width="180" height="100" rx="12"
            fill="rgba(148,163,184,0.06)" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.7" />
          <text x="740" y="378" textAnchor="middle" fill="#e2e8f0"
            fontSize="12" fontWeight="700" fontFamily="Crimson Pro, Georgia, serif">
            🏛 Institution / Ship
          </text>
          <text x="740" y="395" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Authenticated API consumer
          </text>
          <rect x="666" y="405" width="148" height="16" rx="4"
            fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
          <text x="740" y="417" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
            GET /api/datasets/{"{id}"}
          </text>
          <rect x="666" y="426" width="148" height="16" rx="4"
            fill="rgba(148,163,184,0.05)" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
          <text x="740" y="438" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            S-102 GeoJSON response
          </text>

          {/* ── Connection lines ── */}
          {/* Nigeria → Portal */}
          <path d="M 230 110 C 280 110, 270 220, 280 240"
            fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5"
            strokeDasharray="5,3" markerEnd="url(#arrowGreen)" />
          <text x="244" y="175" fill="#22c55e" fontSize="9" fontFamily="monospace" fillOpacity="0.8">S-102 API</text>

          {/* Kenya → Portal */}
          <path d="M 630 110 C 580 110, 590 220, 580 240"
            fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.5"
            strokeDasharray="5,3" markerEnd="url(#arrowTeal)" />
          <text x="572" y="175" fill="#60a5fa" fontSize="9" fontFamily="monospace" fillOpacity="0.8">S-102 API</text>

          {/* South Africa → Portal */}
          <path d="M 430 400 L 430 325"
            fill="none" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.5"
            strokeDasharray="5,3" markerEnd="url(#arrowTeal)" />
          <text x="435" y="365" fill="#f87171" fontSize="9" fontFamily="monospace" fillOpacity="0.8">S-102 API</text>

          {/* CSB Vessel → Portal */}
          <path d="M 210 385 C 280 380, 280 300, 280 280"
            fill="none" stroke="#fb923c" strokeWidth="1.5" strokeOpacity="0.6"
            strokeDasharray="4,3" markerEnd="url(#arrowOrange)" />
          <text x="202" y="330" fill="#fb923c" fontSize="9" fontFamily="monospace" fillOpacity="0.85">HTTP POST</text>
          <text x="202" y="342" fill="#fb923c" fontSize="9" fontFamily="monospace" fillOpacity="0.85">+ ML QC</text>

          {/* Portal → Institution */}
          <path d="M 580 290 C 640 290, 640 370, 650 380"
            fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.5"
            strokeDasharray="4,3" markerEnd="url(#arrowTeal)" />
          <text x="584" y="340" fill="#94a3b8" fontSize="9" fontFamily="monospace" fillOpacity="0.8">S-100 JSON</text>
          <text x="584" y="352" fill="#94a3b8" fontSize="9" fontFamily="monospace" fillOpacity="0.8">(RBAC filtered)</text>

          {/* IHO Standards label */}
          <rect x="340" y="150" width="180" height="30" rx="6"
            fill="rgba(6,13,26,0.6)" stroke="rgba(14,165,233,0.2)" strokeWidth="1" />
          <text x="430" y="169" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace">
            IHO S-100 Universal Hydrographic Model
          </text>
        </svg>
      </div>

      {/* Key architecture principles */}
      <div style={{
        width: "100%",
        maxWidth: "900px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "16px",
        marginTop: "24px",
      }}>
        {[
          {
            icon: "🏛",
            title: "Federated Governance",
            desc: "Each nation retains full data sovereignty. No centralised server. Modelled on EMODnet's continental-scale federation across sovereign member states.",
            color: "var(--teal-bright)",
          },
          {
            icon: "🔒",
            title: "Data Decimation & Military Air-Gap",
            desc: "Public layer: sparse points, depth rounded to 1 d.p. Navy layer: full density, precise to 3 d.p., hosted on air-gapped servers at Rack Centre Lagos and Teraco Johannesburg — physically disconnected from the public internet.",
            color: "var(--csb-orange)",
          },
          {
            icon: "🏗",
            title: "Sovereign African Cloud",
            desc: "Digital Lodgment Fees fund CAPEX at indigenous Tier-IV data centers (Rack Centre Lagos, Teraco JHB). Africa owns the servers — eliminating perpetual AWS/Azure OPEX and enabling true air-gap security for defence data.",
            color: "#a78bfa",
          },
          {
            icon: "🛳",
            title: "VOO Edge Computing & IOC Data Tax",
            desc: "Commercial Vessels of Opportunity run Zero-Touch Black Boxes — no human input. International Oil Companies pay a Digital Lodgment Fee ($10,000/block) to lodge survey data, self-funding the Sovereign Cloud infrastructure.",
            color: "var(--nigeria-green)",
          },
          {
            icon: "📡",
            title: "IHO S-100 Interoperability",
            desc: "All data is exposed via S-102 compliant REST APIs. Any ECDIS navigation system can consume the data directly — no proprietary formats.",
            color: "var(--kenya-blue)",
          },
        ].map((card) => (
          <div key={card.title} style={{
            background: "rgba(10,22,40,0.7)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "18px 18px",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "20px" }}>{card.icon}</span>
              <span style={{
                fontSize: "13px",
                fontWeight: 600,
                color: card.color,
              }}>{card.title}</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* International precedents */}
      <div style={{
        width: "100%",
        maxWidth: "900px",
        marginTop: "24px",
        background: "rgba(10,22,40,0.7)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px 24px",
      }}>
        <div style={{
          fontSize: "10px",
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          marginBottom: "14px",
        }}>
          INTERNATIONAL PRECEDENTS
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[
            { name: "OCIMS", country: "South Africa", role: "Proves national ocean data portal feasibility in Africa", color: "#f87171" },
            { name: "MEDIN", country: "United Kingdom", role: "Proves federated governance with military-grade data decimation", color: "#a78bfa" },
            { name: "EMODnet", country: "European Union", role: "Proves continental-scale federated discovery works", color: "#60a5fa" },
            { name: "Rack Centre", country: "Lagos, Nigeria", role: "Tier-IV data center — proposed host for NHA Sovereign Marine Cloud CAPEX hardware", color: "#22c55e" },
            { name: "Teraco", country: "Johannesburg, SA", role: "Africa's largest carrier-neutral data center — backup node for SANHO air-gapped military vault", color: "#fb923c" },
          ].map((p) => (
            <div key={p.name} style={{
              flex: "1 1 220px",
              padding: "12px 14px",
              background: "rgba(6,13,26,0.5)",
              border: `1px solid ${p.color}33`,
              borderRadius: "8px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}>
              <div style={{
                width: "32px", height: "32px",
                borderRadius: "6px",
                background: `${p.color}18`,
                border: `1px solid ${p.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                color: p.color,
                flexShrink: 0,
              }}>
                {p.name.slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {p.name} <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>({p.country})</span>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px", lineHeight: 1.5 }}>
                  {p.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
