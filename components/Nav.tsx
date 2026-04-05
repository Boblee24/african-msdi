"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();

  const links = [
    { href: "/", label: "Discovery Portal" },
    { href: "/submit", label: "Data Ingestion" },
    { href: "/architecture", label: "Architecture" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      height: "56px",
      background: "rgba(6,13,26,0.96)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: "0",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "28px", flexShrink: 0 }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "6px",
          background: "linear-gradient(135deg, var(--teal-bright), var(--teal-dim))",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>🌊</div>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600,
          color: "var(--text-primary)", letterSpacing: "0.01em",
        }}>
          African <span style={{ color: "var(--teal-bright)" }}>MSDI</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((link) => {
          const active = path === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              padding: "6px 14px", borderRadius: "6px",
              fontSize: "13px", fontWeight: 500,
              color: active ? "var(--teal-bright)" : "var(--text-secondary)",
              background: active ? "rgba(14,165,233,0.12)" : "transparent",
              border: active ? "1px solid rgba(14,165,233,0.25)" : "1px solid transparent",
              textDecoration: "none", transition: "all 0.15s ease",
            }}>
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right badges */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
        {/* IHO standard badge */}
        <div style={{
          padding: "3px 10px", borderRadius: "20px",
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)",
          fontSize: "11px", fontFamily: "var(--font-mono)",
          color: "var(--nigeria-green)", letterSpacing: "0.05em",
        }}>
          PROTOTYPE · IHO S-100
        </div>

        {/* Sovereign cloud badge */}
        <div style={{
          padding: "3px 10px", borderRadius: "20px",
          background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.28)",
          fontSize: "11px", fontFamily: "var(--font-mono)",
          color: "#a78bfa", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#a78bfa", display: "inline-block",
            boxShadow: "0 0 5px #a78bfa",
          }} />
          SOVEREIGN AFRICAN CLOUD
        </div>

        {/* Node status */}
        <div style={{
          padding: "3px 10px", borderRadius: "20px",
          background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
          fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--teal-muted)",
        }}>
          3 NODES ACTIVE
        </div>
      </div>
    </nav>
  );
}
