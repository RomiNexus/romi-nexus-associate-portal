// nexus-associate-portal/src/views/PilotSandboxView.jsx
import { useState, useRef, useEffect } from 'react';

const GOLD   = "#D4AF37";
const DIM    = "#3a3a3a";
const BORDER = "#1a1a1a";
const PANEL  = "#070707";
const GREEN  = "#27ae60";
const MONO   = "'IBM Plex Mono',monospace";

const SIM_STEPS = [
  { text: "INITIALIZING LOCAL SANDBOX ENGINE...", delay: 500 },
  { text: "LOADING MOCK ORDER BOOK (5,000 FAKE ROWS)...", delay: 1200 },
  { text: "EXECUTING SPATIAL ARBITRAGE ALGORITHM V2.1...", delay: 1800 },
  { text: "NO MATCHES FOUND. OFFLINE DATASET EXHAUSTED.", delay: 1000 },
];

export default function PilotSandboxView() {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const consoleRef = useRef(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => {
      // Clean up any pending timers if the view unmounts mid-simulation.
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [lines]);

  function runSimulation() {
    if (running) return;
    setRunning(true);
    setLines([]);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    let cumulativeDelay = 0;
    SIM_STEPS.forEach((step, i) => {
      cumulativeDelay += step.delay;
      const t = setTimeout(() => {
        setLines(prev => [...prev, step.text]);
        if (i === SIM_STEPS.length - 1) setRunning(false);
      }, cumulativeDelay);
      timeoutsRef.current.push(t);
    });
  }

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ padding: "16px 16px 80px 16px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>

        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.18em" }}>
            PILOT SANDBOX
          </div>
          <div style={{ fontFamily: MONO, fontSize: 8, color: DIM, marginTop: 4 }}>
            OFFLINE SIMULATION · NO LIVE DATA · NO PRODUCTION ACCESS
          </div>
        </div>

        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.12em" }}>SIMULATION CONTROL</span>
            <button
              onClick={runSimulation}
              disabled={running}
              style={{
                fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em",
                color: running ? DIM : "#020202",
                background: running ? "transparent" : GOLD,
                border: `1px solid ${running ? BORDER : GOLD}`,
                borderRadius: 2, padding: "8px 16px",
                cursor: running ? "not-allowed" : "pointer",
                transition: "all 0.15s"
              }}
            >
              {running ? "RUNNING..." : "START SIMULATION"}
            </button>
          </div>

          <div
            ref={consoleRef}
            style={{
              background: "#050505", minHeight: 220, maxHeight: 360, overflowY: "auto",
              padding: 14, fontFamily: MONO, fontSize: 10, color: GREEN, lineHeight: 1.8
            }}
          >
            {lines.length === 0 && !running && (
              <div style={{ color: DIM }}>&gt; awaiting simulation start...</div>
            )}
            {lines.map((line, i) => (
              <div key={i}>&gt; {line}</div>
            ))}
            {running && lines.length < SIM_STEPS.length && (
              <div style={{ color: GREEN, animation: "pulse 1s infinite" }}>&gt; _</div>
            )}
          </div>
        </div>

        <div style={{ fontFamily: MONO, fontSize: 7, color: DIM, letterSpacing: "0.2em" }}>
          ALL OUTPUT IS SIMULATED · NO EXTERNAL REQUESTS ARE MADE
        </div>
      </div>
    </div>
  );
}
