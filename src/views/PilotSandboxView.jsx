import React, { useState } from 'react';

const GOLD = "#D4AF37";
const DIM = "#3a3a3a";
const BORDER = "#1a1a1a";
const PANEL = "#070707";
const MONO = "'IBM Plex Mono',monospace";

export default function PilotSandboxView() {
  const [calc, setCalc] = useState({ volume: 50000, buyPrice: 1850, sellPrice: 1875 });

  const volume = Number(calc.volume) || 0;
  const buy = Number(calc.buyPrice) || 0;
  const sell = Number(calc.sellPrice) || 0;

  const grossRevenue = volume * sell;
  const costOfGoods = volume * buy;
  const grossMargin = grossRevenue - costOfGoods;
  const platformFee = grossRevenue * 0.02; // 2% Romi Nexus Fee
  const netProfit = grossMargin - platformFee;

  const inpStyle = {
    width: "100%", background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff",
    fontFamily: MONO, fontSize: 12, padding: "10px", outline: "none", borderRadius: 2, marginTop: 6, boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 600, color: '#fff', margin: 0 }}>Deal Margin Calculator</h2>
        <div style={{ fontFamily: MONO, fontSize: 10, color: DIM, marginTop: 4 }}>LOCAL VETTING TOOL · DOES NOT SAVE TO DATABASE</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Input Panel */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, padding: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", display: 'block', marginBottom: 16 }}>TRADE PARAMETERS</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 8, color: DIM }}>VOLUME (MT / BBL)</label>
              <input type="number" style={inpStyle} value={calc.volume} onChange={e => setCalc({...calc, volume: e.target.value})} />
            </div>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 8, color: DIM }}>BUY PRICE (USD)</label>
              <input type="number" style={inpStyle} value={calc.buyPrice} onChange={e => setCalc({...calc, buyPrice: e.target.value})} />
            </div>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 8, color: DIM }}>TARGET SELL PRICE (USD)</label>
              <input type="number" style={inpStyle} value={calc.sellPrice} onChange={e => setCalc({...calc, sellPrice: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 3, padding: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: "0.15em", display: 'block', marginBottom: 16 }}>PROFITABILITY BREAKDOWN</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${BORDER}`, paddingBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: DIM }}>GROSS REVENUE</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#fff' }}>${grossRevenue.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${BORDER}`, paddingBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: DIM }}>COGS (ACQUISITION)</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#c0392b' }}>-${costOfGoods.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${BORDER}`, paddingBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: DIM }}>GROSS MARGIN</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#D4AF37' }}>${grossMargin.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${BORDER}`, paddingBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: DIM }}>NEXUS FEE (2%)</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#c0392b' }}>-${platformFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#111', padding: 12, borderRadius: 2, marginTop: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: '#fff', fontWeight: 600 }}>NET PROFIT</span>
              <span style={{ fontFamily: MONO, fontSize: 14, color: netProfit > 0 ? '#27ae60' : '#c0392b', fontWeight: 700 }}>
                ${netProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}