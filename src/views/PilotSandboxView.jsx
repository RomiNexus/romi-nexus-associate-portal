import React, { useState } from 'react';

const GOLD = "#D4AF37";
const DIM = "#3a3a3a";
const BORDER = "#1a1a1a";
const PANEL = "#070707";
const GREEN = "#27ae60";
const RED = "#c0392b";
const ORANGE = "#e67e22";
const MONO = "'IBM Plex Mono',monospace";

export default function PilotSandboxView() {
  const [form, setForm] = useState({
    commodity: 'Diesel EN590',
    volume: 100000,
    buyPrice: 520,
    sellPrice: 540,
    commissionPct: 3.5 // Custom off-platform rate
  });

  const volume = Number(form.volume) || 0;
  const buy = Number(form.buyPrice) || 0;
  const sell = Number(form.sellPrice) || 0;
  const commPct = Number(form.commissionPct) || 0;

  // --- SCENARIO A: OPTIMAL ---
  const grossRev = volume * sell;
  const cogs = volume * buy;
  const grossMargin = grossRev - cogs;
  const commFee = grossRev * (commPct / 100);
  const netProfit = grossMargin - commFee;

  // --- SCENARIO B: STRESS TEST (Price drops by 3%) ---
  const stressSell = sell * 0.97;
  const stressRev = volume * stressSell;
  const stressMargin = stressRev - cogs;
  const stressFee = stressRev * (commPct / 100);
  const stressNet = stressMargin - stressFee;

  // --- DYNAMIC STRATEGIES ---
  const strategies = [
    "EXECUTION: Utilize a back-to-back Letter of Credit (DLC/SBLC) to eliminate upfront capital exposure.",
    netProfit > 1000000
      ? "RISK MITIGATION: High-margin deal detected. Mandate strict KYC/AML verification on the buyer before issuing the FCO to filter out non-performing intermediaries."
      : "RISK MITIGATION: Margin is compressed. Ensure all logistics, insurance, and freight costs are fully absorbed by the buyer (FOB basis).",
    "FEE PROTECTION: Execute an irrevocable Master Fee Protection Agreement (IMFPA) backed by a top-tier bank paymaster before revealing the supplier's coordinates."
  ];

  const inpStyle = {
    width: "100%", background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff",
    fontFamily: MONO, fontSize: 10, padding: "8px", outline: "none", borderRadius: 2, marginTop: 4, boxSizing: 'border-box'
  };
  const labelStyle = { fontFamily: MONO, fontSize: 8, color: DIM, letterSpacing: "0.1em" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 600, color: '#fff', margin: 0 }}>Tactical Deal Simulator</h2>
        <div style={{ fontFamily: MONO, fontSize: 10, color: DIM, marginTop: 4 }}>OFF-PLATFORM SCENARIO MODELING & STRATEGY</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        
        {/* LEFT COLUMN: INPUTS */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, padding: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", display: 'block', marginBottom: 16 }}>TRANSACTION PARAMETERS</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={labelStyle}>COMMODITY</label>
              <input type="text" style={inpStyle} value={form.commodity} onChange={e => setForm({...form, commodity: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>VOLUME (MT / BBL)</label>
              <input type="number" style={inpStyle} value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>BUY PRICE (USD)</label>
                <input type="number" style={inpStyle} value={form.buyPrice} onChange={e => setForm({...form, buyPrice: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>SELL PRICE (USD)</label>
                <input type="number" style={inpStyle} value={form.sellPrice} onChange={e => setForm({...form, sellPrice: e.target.value})} />
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: 4 }}>
              <label style={{ ...labelStyle, color: GOLD }}>OFF-PLATFORM COMMISSION (%)</label>
              <input type="number" step="0.1" style={{ ...inpStyle, borderColor: GOLD, color: GOLD }} value={form.commissionPct} onChange={e => setForm({...form, commissionPct: e.target.value})} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OUTPUTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* SCENARIOS */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, padding: 20 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", display: 'block', marginBottom: 16 }}>PROFITABILITY SCENARIOS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Optimal */}
              <div style={{ padding: 12, border: `1px solid ${GREEN}44`, borderRadius: 3, background: '#0a0a0a' }}>
                <div style={{ fontFamily: MONO, fontSize: 8, color: GREEN, letterSpacing: "0.1em", marginBottom: 8 }}>TARGET SCENARIO (OPTIMAL)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: DIM }}>GROSS REVENUE</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#fff' }}>${grossRev.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: DIM }}>COMMISSION ({commPct}%)</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: RED }}>-${commFee.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 6, marginTop: 4 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#fff', fontWeight: 600 }}>NET PROFIT</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: GREEN, fontWeight: 700 }}>${netProfit.toLocaleString()}</span>
                </div>
              </div>

              {/* Stress Test */}
              <div style={{ padding: 12, border: `1px solid ${ORANGE}44`, borderRadius: 3, background: '#0a0a0a' }}>
                <div style={{ fontFamily: MONO, fontSize: 8, color: ORANGE, letterSpacing: "0.1em", marginBottom: 8 }}>STRESS TEST (-3% SELL PRICE DROP)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: DIM }}>ADJ. REVENUE</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#fff' }}>${stressRev.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${BORDER}`, paddingTop: 6, marginTop: 4 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: '#fff', fontWeight: 600 }}>ADJ. NET PROFIT</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: stressNet > 0 ? ORANGE : RED, fontWeight: 700 }}>${stressNet.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ADVISORY */}
          <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, padding: 20 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", display: 'block', marginBottom: 16 }}>TACTICAL ADVISORY</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {strategies.map((strategy, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: GOLD, fontSize: 12, lineHeight: 1 }}>▸</span>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: '#c0c0c0', lineHeight: 1.5 }}>
                    {strategy}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}