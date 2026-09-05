import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";
import DOMPurify from "dompurify";

const GOLD   = "#D4AF37";
const RED    = "#c0392b";
const GREEN  = "#27ae60";
const ORANGE = "#e67e22";
const DIM    = "#3a3a3a";
const BORDER = "#1a1a1a";
const PANEL  = "#070707";
const MONO   = "'IBM Plex Mono',monospace";

const WORKER_URL = "https://api.rominexus.com";

const _api = {
  get: async (action, params = {}) => {
    const url = new URL(WORKER_URL);
    url.searchParams.set("action", action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    try {
      const res = await fetch(url.toString(), { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Intel API Fallback triggered:", err.message);
      throw err;
    }
  },
};

function deterministicScore(str, min = 20, max = 95) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return min + (Math.abs(h) % (max - min + 1));
}

function intensityColor(v) {
  if (v >= 75) return RED;
  if (v >= 50) return ORANGE;
  if (v >= 30) return GOLD;
  return DIM;
}

const MOCK_NEWS = [
  { id: "m1", category: "FREIGHT", headline: "RED SEA DISRUPTION — HOUTHI THREAT LEVEL ELEVATED", impactsynthesis: "Suez Canal alternative routing via Cape of Good Hope adds 10–14 days. Freight rate premium 18–22%.", commoditytags: ["Brent", "Gold", "Freight"], intensity: 88, date: new Date(Date.now() - 3600000).toISOString() },
  { id: "m2", category: "COMPLIANCE", headline: "UAE CENTRAL BANK AML FRAMEWORK UPDATE — Q2 2026", impactsynthesis: "New beneficial ownership thresholds effective Q3 2026. DNFBP entities must re-register.", commoditytags: ["Gold", "Silver", "Compliance"], intensity: 72, date: new Date(Date.now() - 7200000).toISOString() },
];

// 🚀 UPDATED TABS
const TABS = ["ORCHESTRATOR SYNTHESIS", "AGRI", "PRECIOUS METALS", "BASE METALS", "ENERGY", "CONFLICT"];

const S = {
  panel:     { background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, display: "flex", flexDirection: "column" },
  panelHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 },
  mono:      (size = 9, color = DIM) => ({ fontFamily: MONO, fontSize: size, color, letterSpacing: "0.1em" }),
  tag:       (color = DIM) => ({ fontFamily: MONO, fontSize: 8, padding: "2px 6px", borderRadius: 2, border: `1px solid ${color}`, color, letterSpacing: "0.1em", whiteSpace: "nowrap" }),
  kpi:       { background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "12px 16px", minWidth: 0 },
};

function PanelHead({ title, meta, action }) {
  return (
    <div style={S.panelHead}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.12em" }}>{title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {meta && <span style={S.mono(8, DIM)}>{meta}</span>}
        {action}
      </div>
    </div>
  );
}

function LiveDot({ color = GREEN }) {
  return <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: color, animation: "pulse 2s infinite", flexShrink: 0 }} />;
}

function IntensityBar({ value }) {
  const color = intensityColor(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <div style={{ width: 56, height: 4, background: "#0d0d0d", borderRadius: 1, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 8, color, minWidth: 24 }}>{value}</span>
    </div>
  );
}

function KpiCard({ label, value, color = GOLD, sub }) {
  return (
    <div style={S.kpi}>
      <span style={{ fontFamily: MONO, fontSize: 7, color: DIM, letterSpacing: "0.2em", display: "block", marginBottom: 6 }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color, display: "block" }}>{value}</span>
      {sub && <span style={{ fontFamily: MONO, fontSize: 8, color: DIM, display: "block", marginTop: 4 }}>{sub}</span>}
    </div>
  );
}

function NewsCard({ item, expanded, onToggle }) {
  const [hov, setHov] = useState(false);
  const color = intensityColor(item.intensity);
  return (
    <div onClick={onToggle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? "#0a0a0a" : "#050505", border: `1px solid ${BORDER}`, borderLeft: `2px solid ${hov || expanded ? color : color + "33"}`, borderRadius: 3, padding: "10px 14px", cursor: "pointer", transition: "background 0.15s, border-left-color 0.15s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: "#c0c0c0", fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{item.headline}</span>
        <IntensityBar value={item.intensity} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: expanded ? 10 : 0 }}>
        {(item.commoditytags || []).map(t => (<span key={t} style={S.tag(DIM)}>{t}</span>))}
        <span style={{ fontFamily: MONO, fontSize: 7, color: DIM, marginLeft: "auto" }}>
          {item.date ? new Date(item.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
        </span>
      </div>
      {expanded && item.impactsynthesis && (
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10, marginTop: 4, animation: "fadeIn 0.15s ease" }}>
          <span style={{ fontFamily: MONO, fontSize: 8, color: DIM, letterSpacing: "0.15em", display: "block", marginBottom: 6 }}>
            {item.impactsynthesis.includes("LIVE MARKET FEED") ? "MARKET FEED SYNOPSIS" : "AI IMPACT SYNTHESIS"}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 8, color: "#8a8a8a", lineHeight: 1.8, display: "block" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.impactsynthesis.replace(/\b(HIGH|CRITICAL|ELEVATED)\b/g, `<span style="color:${RED}">$1</span>`).replace(/\b(MEDIUM|MODERATE)\b/g, `<span style="color:${ORANGE}">$1</span>`)) }} />
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, color: GOLD, fontSize: 8, fontFamily: MONO, textDecoration: "none", borderBottom: `1px solid ${GOLD}44` }}>READ FULL SOURCE →</a>
          )}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return <div style={{ height: 56, borderRadius: 3, background: "linear-gradient(90deg,#0d0d0d 25%,#141414 50%,#0d0d0d 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }} />;
}

export default function GlobalIntelDashboard({ activeMandates }) {
  const [activeTab, setActiveTab]   = useState("ORCHESTRATOR SYNTHESIS");
  const [news, setNews]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);
  const [apiFailed, setApiFailed]   = useState(false);

  const fetchIntel = useCallback(async (tab) => {
    setLoading(true);
    setApiFailed(false);
    try {
      const res = await _api.get("getGlobalIntel", { category: tab });
      if (res && res.error) throw new Error(res.error);

      if (res?.items?.length) {
        const normalized = res.items.map((n, i) => {
          const headline = n.headline || n.title || "MARKET SIGNAL DETECTED";
          return {
            id: n.id || i, headline, link: n.link || null,
            commoditytags: Array.isArray(n.commoditytags) ? n.commoditytags : [tab],
            intensity: n.intensity || deterministicScore(headline),
            impactsynthesis: n.impactsynthesis || n.title || "Awaiting synthesis...",
            date: n.date || new Date().toISOString(),
          };
        });
        setNews(normalized);
      } else throw new Error("No items returned from worker");
      
    } catch (err) {
      console.error("🚨 INTEL FEED ERROR:", err.message);
      setApiFailed(true);
      setNews(MOCK_NEWS);
    } finally {
      setLoading(false);
      setLastRefresh(Date.now());
    }
  }, []);

  useEffect(() => { fetchIntel(activeTab); }, [activeTab, fetchIntel]);
  useEffect(() => { const t = setInterval(() => fetchIntel(activeTab), 300000); return () => clearInterval(t); }, [activeTab, fetchIntel]);

  const filteredNews   = news.filter(n => !filterQuery || n.headline.toLowerCase().includes(filterQuery.toLowerCase()) || (n.commoditytags || []).some(t => t.toLowerCase().includes(filterQuery.toLowerCase())));
  const criticalCount  = news.filter(n => n.intensity >= 75).length;
  const avgIntensity   = news.length ? Math.round(news.reduce((s, n) => s + (n.intensity || 50), 0) / news.length) : 0;
  
  const sparkData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateKey = d.toISOString().split("T")[0]; 
    const dayNews = news.filter(n => n.date && n.date.startsWith(dateKey));
    let avg = dayNews.length > 0 ? Math.round(dayNews.reduce((acc, curr) => acc + curr.intensity, 0) / dayNews.length) : deterministicScore(dateKey + activeTab, 40, 65);
    return { day: dayStr, v: avg };
  });

  return (
    <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
      <div style={{ padding: "16px 16px 80px 16px", display: "flex", flexDirection: "column", gap: 16, minHeight: "min-content" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.18em" }}>GLOBAL INTEL</span>
              {apiFailed && news.length > 0 && <span style={{...S.tag(ORANGE), fontSize: 7}}>LOCAL CACHE ENABLED</span>}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 8, color: DIM, marginTop: 4 }}>OSINT · FREIGHT · COMPLIANCE · MACRO SIGNALS</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LiveDot color={apiFailed ? ORANGE : GREEN} />
            <span style={{ fontFamily: MONO, fontSize: 8, color: apiFailed ? ORANGE : GREEN }}>{apiFailed ? "STALE" : "LIVE"}</span>
            {lastRefresh && <span style={{ fontFamily: MONO, fontSize: 7, color: DIM }}>{new Date(lastRefresh).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>}
            <button onClick={() => fetchIntel(activeTab)} style={{ fontFamily: MONO, fontSize: 8, color: loading ? DIM : GOLD, background: "transparent", border: `1px solid ${loading ? BORDER : GOLD + "44"}`, borderRadius: 2, padding: "4px 10px", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s", letterSpacing: "0.1em" }}>{loading ? "..." : "↻"}</button>
          </div>
        </div>

        {/* KPI GRID */}
        <div className="nx-intel-kpi-grid" style={{ display: "grid", gap: 12 }}>
          <KpiCard label="CRITICAL THREATS" value={criticalCount} color={criticalCount > 0 ? RED : GREEN} sub={`INTENSITY ≥ 75`} />
          <KpiCard label="TENSION INDEX"    value={`${avgIntensity}%`} color={avgIntensity >= 70 ? RED : avgIntensity >= 50 ? ORANGE : GOLD} sub="MARKET AGGREGATE" />
          <KpiCard label="SIGNALS TRACKED"  value={news.length}    color={GOLD}      sub="ACTIVE CATEGORY" />
          <KpiCard label="MANDATE EXPOSURE" value={activeMandates?.length ?? "—"} color="#c0c0c0" sub="LIVE ON PLATFORM" />
        </div>

        {/* TREND CHART */}
        <div style={S.panel}>
          <PanelHead title="7-DAY TENSION TREND" meta={activeTab} />
          <div style={{ padding: "12px 8px 8px", height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <XAxis dataKey="day" tick={{ fontFamily: MONO, fontSize: 8, fill: DIM }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip contentStyle={{ background: "#050505", border: `1px solid ${BORDER}`, borderRadius: 2, fontFamily: MONO, fontSize: 8 }} labelStyle={{ color: GOLD }} itemStyle={{ color: "#c0c0c0" }} formatter={(v) => [`${v}`, "INTENSITY"]} />
                <Line type="monotone" dataKey="v" stroke={GOLD} strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: GOLD }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TABS.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                style={{ fontFamily: MONO, fontSize: 8, color: activeTab === tab ? "#020202" : (tab === "ORCHESTRATOR SYNTHESIS" ? GOLD : DIM), background: activeTab === tab ? GOLD : "transparent", border: `1px solid ${activeTab === tab ? GOLD : BORDER}`, borderRadius: 2, padding: "4px 10px", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.1em" }}
              >
                {tab === "ORCHESTRATOR SYNTHESIS" && activeTab !== tab ? "✨ " : ""}{tab}
              </button>
            ))}
          </div>
        </div>

        {/* FEED */}
        <div style={S.panel}>
          <PanelHead title="INTELLIGENCE FEED" meta={`${filteredNews.length} SIGNALS`} action={<LiveDot color={apiFailed ? ORANGE : GREEN} />} />
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : filteredNews.map(item => (
              <NewsCard key={item.id} item={item} expanded={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
            ))}
          </div>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 7, color: DIM, letterSpacing: "0.25em", paddingTop: 4 }}>LIVE FREIGHT INTELLIGENCE</div>

        <div className="nx-freight-grid" style={{ display: "grid", gap: 16 }}>
          <div style={S.panel}>
            <PanelHead title="GLOBAL OCEAN FREIGHT" meta="LIVE MARINE TRAFFIC" action={<LiveDot />} />
            <div style={{ height: 380, background: "#000" }}>
              <iframe title="Ocean Tracking" src="https://www.marinetraffic.com/en/ais/embed?zoom=2&centery=20&centerx=0&maptype=3&shownames=false&mmsi=0&fleet=&fleetname=&vtypes=" width="100%" height="100%" frameBorder="0" style={{ filter: "invert(90%) hue-rotate(180deg) contrast(120%)" }} />
            </div>
          </div>
          <div style={S.panel}>
            <PanelHead title="GLOBAL AIR FREIGHT" meta="LIVE ADS-B EXCHANGE" action={<LiveDot />} />
            <div style={{ height: 380, background: "#000" }}>
              <iframe title="Air Tracking" src="https://globe.adsbexchange.com/?hideSidebar&hideButtons&scale=0.6" sandbox="allow-scripts allow-same-origin" width="100%" height="100%" frameBorder="0" />
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .nx-intel-kpi-grid { grid-template-columns: repeat(4, 1fr); }
        .nx-freight-grid { grid-template-columns: 1fr 1fr; }
        
        @media (max-width: 1024px) { .nx-intel-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .nx-freight-grid { grid-template-columns: 1fr !important; }
          .nx-intel-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}