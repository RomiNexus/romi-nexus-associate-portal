// _primitives.jsx — Romi Nexus UI Primitives
import { useState, useEffect, useRef } from "react";

/* ─── Design Tokens ──────────────────────────────────────────────── */
export const GOLD = "#D4AF37";
export const RED = "#c0392b";
export const GREEN = "#27ae60";
export const ORANGE = "#e67e22";
export const DIM = "#3a3a3a";
export const BORDER = "#1a1a1a";
export const PANEL = "#070707";
export const MONO = "'IBM Plex Mono',monospace";

/* ─── Utilities ──────────────────────────────────────────────────── */
export const sc = (...args) => args.filter(Boolean).join(" ");

export const timeAgo = (dateStr) => {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 2) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
};

export const expiryColor = (days) => {
  if (days === null) return DIM;
  if (days < 0) return RED;
  if (days <= 7) return ORANGE;
  if (days <= 30) return GOLD;
  return GREEN;
};

const COMMODITY_TIER_MAP = {
  "Gold (XAU)": "EDD_PRECIOUS",
  "Silver (XAG)": "EDD_PRECIOUS",
  "Copper (LME)": "EDD_METALS",
  "Aluminum": "EDD_METALS",
  "Nickel": "EDD_METALS",
  "Zinc": "EDD_METALS",
};
export const classifyCommodityTier = (c) => COMMODITY_TIER_MAP[c] || "STANDARD";

/* ─── M (Mono text span) ─────────────────────────────────────────── */
export const M = ({ children, color, size = 9, style = {} }) => (
  <span style={{ fontFamily: MONO, fontSize: size, color: color || "#c0c0c0", ...style }}>
    {children}
  </span>
);

/* ─── Tag ────────────────────────────────────────────────────────── */
export const Tag = ({ label, color = GOLD, style = {} }) => (
  <span style={{
    fontFamily: MONO, fontSize: 8, color, border: `1px solid ${color}44`,
    padding: "2px 6px", borderRadius: 2, letterSpacing: "0.12em",
    background: `${color}11`, whiteSpace: "nowrap", ...style,
  }}>
    {label}
  </span>
);

/* ─── Btn ────────────────────────────────────────────────────────── */
export function Btn({ children, onClick, variant = "default", size = "sm", disabled = false, style = {}, title }) {
  const base = {
    fontFamily: MONO, cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid", borderRadius: 2, letterSpacing: "0.1em",
    opacity: disabled ? 0.45 : 1, transition: "all 0.15s",
    display: "inline-flex", alignItems: "center", gap: 6,
  };
  const sizes = {
    xs: { fontSize: 8, padding: "3px 8px" },
    sm: { fontSize: 9, padding: "5px 12px" },
    md: { fontSize: 10, padding: "7px 16px" },
  };
  const variants = {
    default:  { color: "#888",  borderColor: BORDER,  background: "transparent" },
    gold:     { color: GOLD,   borderColor: GOLD,    background: `${GOLD}15` },
    green:    { color: GREEN,  borderColor: GREEN,   background: `${GREEN}15` },
    red:      { color: RED,    borderColor: RED,     background: `${RED}15` },
    orange:   { color: ORANGE, borderColor: ORANGE,  background: `${ORANGE}15` },
    primary:  { color: "#000", borderColor: GOLD,    background: GOLD },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{ ...base, ...(sizes[size] || sizes.sm), ...(variants[variant] || variants.default), ...style }}
    >
      {children}
    </button>
  );
}

/* ─── Panel ──────────────────────────────────────────────────────── */
export const Panel = ({ children, style = {}, title, actions }) => (
  <div style={{
    background: PANEL, border: `1px solid ${BORDER}`,
    borderRadius: 3, overflow: "hidden", ...style,
  }}>
    {title && (
      <div style={{
        padding: "10px 16px", borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: GOLD, letterSpacing: "0.15em" }}>{title}</span>
        {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

/* ─── Immersive ProgressCircle ─────────────────────────────────── */
export const ProgressCircle = ({ value = 0, max = 100, size = "100%", color = GOLD }) => {
  const radius = 34;
  const stroke = 6;
  const viewBoxSize = 80;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} style={{ transform: 'rotate(-90deg)', opacity: 0.85, display: 'block' }}>
      <circle cx={viewBoxSize/2} cy={viewBoxSize/2} r={radius} fill="none" stroke={`${color}33`} strokeWidth={stroke} />
      <circle
        cx={viewBoxSize/2} cy={viewBoxSize/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  );
};

/* ─── Immersive Sparkline ───────────────────────────────────────── */
export const Sparkline = ({ data = [], color = GOLD, height = 50, width = 160 }) => {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ opacity: 0.85, display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ─── Full-Card KpiCard ─────────────────────────────────────────── */
export const KpiCard = ({ label, value, sub, color = GOLD, chart, style = {} }) => (
  <div style={{
    background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3,
    padding: "16px 20px", position: "relative", overflow: "hidden", 
    display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 100, ...style,
  }}>
    
    {chart && (
      <div style={{ 
        position: 'absolute', inset: 0, display: 'flex', 
        alignItems: 'center', justifyContent: 'center', zIndex: 0 
      }}>
        {chart}
      </div>
    )}
    {/* Text content sits on top */}
    <div style={{ position: 'relative', zIndex: 1 }}>
      <span style={{ fontFamily: MONO, fontSize: 7, color: DIM, letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ fontFamily: MONO, fontSize: 24, color, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      {sub && <span style={{ fontFamily: MONO, fontSize: 8, color: DIM }}>{sub}</span>}
    </div>
  </div>
);

/* ─── RiskBar ────────────────────────────────────────────────────── */
export const RiskBar = ({ score = 0, max = 100, style = {} }) => {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const color = pct > 70 ? RED : pct > 40 ? ORANGE : GREEN;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, ...style }}>
      <div style={{ flex: 1, height: 4, background: BORDER, borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 8, color, minWidth: 28, textAlign: "right" }}>{score}</span>
    </div>
  );
};

/* ─── FilterInput ────────────────────────────────────────────────── */
export const FilterInput = ({ value, onChange, placeholder = "Filter...", style = {} }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#c0c0c0",
      fontFamily: MONO, fontSize: 9, padding: "5px 10px", outline: "none",
      borderRadius: 2, ...style,
    }}
  />
);

/* ─── Sheet (slide-in drawer) ────────────────────────────────────── */
export function Sheet({ open, onClose, title, children, width = 440 }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width,
        background: "#050505", borderLeft: `1px solid ${BORDER}`,
        display: "flex", flexDirection: "column",
        animation: "slideIn 0.25s ease",
      }}>
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em" }}>{title}</span>
          <Btn onClick={onClose} size="xs">✕ ESC</Btn>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, maxWidth = 560 }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", animation: "fadeIn 0.15s ease" }} onClick={onClose} />
      <div style={{
        position: "relative", width: "95%", maxWidth, maxHeight: "90vh", overflowY: "auto",
        background: "#050505", border: `1px solid ${BORDER}`, borderRadius: 3,
        animation: "fadeIn 0.15s ease", zIndex: 401,
      }}>
        {title && (
          <div style={{
            padding: "14px 20px", borderBottom: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em" }}>{title}</span>
            <Btn onClick={onClose} size="xs">✕ ESC</Btn>
          </div>
        )}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── FormField ──────────────────────────────────────────────────── */
export const FormField = ({ label, children, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <label style={{ fontFamily: MONO, fontSize: 8, color: DIM, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {label}
    </label>
    {children}
  </div>
);

export const NxInput = ({ style = {}, ...props }) => (
  <input
    style={{
      background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff",
      fontFamily: MONO, fontSize: 10, padding: "8px 10px", outline: "none",
      borderRadius: 2, width: "100%", ...style,
    }}
    {...props}
  />
);

export const NxSelect = ({ children, style = {}, ...props }) => (
  <select
    style={{
      background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff",
      fontFamily: MONO, fontSize: 10, padding: "8px 10px", outline: "none",
      borderRadius: 2, width: "100%", ...style,
    }}
    {...props}
  >
    {children}
  </select>
);

export const NxTextarea = ({ style = {}, ...props }) => (
  <textarea
    style={{
      background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff",
      fontFamily: MONO, fontSize: 10, padding: "8px 10px", outline: "none",
      borderRadius: 2, width: "100%", resize: "vertical", minHeight: 80, ...style,
    }}
    {...props}
  />
);

/* ─── Divider ────────────────────────────────────────────────────── */
export const Divider = ({ style = {} }) => (
  <div style={{ height: 1, background: BORDER, margin: "8px 0", ...style }} />
);

/* ─── EmptyState ─────────────────────────────────────────────────── */
export const EmptyState = ({ message = "No data", sub, action }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "48px 24px", gap: 12, textAlign: "center",
  }}>
    <span style={{ fontFamily: MONO, fontSize: 24, color: DIM }}>□</span>
    <span style={{ fontFamily: MONO, fontSize: 10, color: DIM, letterSpacing: "0.1em" }}>{message}</span>
    {sub && <span style={{ fontFamily: MONO, fontSize: 9, color: "#2a2a2a" }}>{sub}</span>}
    {action}
  </div>
);

/* ─── Skeleton ───────────────────────────────────────────────────── */
export const Skeleton = ({ width = "100%", height = 14, style = {} }) => (
  <div style={{
    width, height, background: "#111", borderRadius: 2,
    animation: "pulse 1.5s ease-in-out infinite", ...style,
  }} />
);

/* ─── LiveDot ────────────────────────────────────────────────────── */
export const LiveDot = ({ color = GREEN, pulse = true, style = {} }) => (
  <span style={{
    display: "inline-block", width: 6, height: 6, borderRadius: "50%",
    background: color, flexShrink: 0,
    animation: pulse ? "pulse 2s ease-in-out infinite" : "none", ...style,
  }} />
);

/* ─── EddWarningBadge ────────────────────────────────────────────── */
export const EddWarningBadge = ({ tier }) => {
  if (!tier || tier === "STANDARD") return null;
  const colors = { EDD_PRECIOUS: GOLD, EDD_METALS: ORANGE };
  const color = colors[tier] || ORANGE;
  return (
    <Tag label={`⚠ ${tier.replace("_", " ")}`} color={color} />
  );
};

/* ─── NxTable ────────────────────────────────────────────────────── */
export const Th = ({ children, style = {} }) => (
  <th style={{
    fontFamily: MONO, fontSize: 7, color: DIM, letterSpacing: "0.15em",
    textTransform: "uppercase", padding: "8px 12px", textAlign: "left",
    borderBottom: `1px solid ${BORDER}`, fontWeight: 500, ...style,
  }}>
    {children}
  </th>
);

export const Td = ({ children, style = {} }) => (
  <td style={{
    fontFamily: MONO, fontSize: 9, color: "#c0c0c0",
    padding: "8px 12px", borderBottom: `1px solid ${BORDER}22`, ...style,
  }}>
    {children}
  </td>
);

export const NxTable = ({ children, style = {} }) => (
  <div style={{ overflowX: "auto", ...style }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      {children}
    </table>
  </div>
);