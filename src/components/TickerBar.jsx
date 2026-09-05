import { useState } from 'react';
import { T } from './tokens.js';
import { useLivePrices } from '../../hooks/useLivePrices.js';

export const DEFAULT_TICKER_ITEMS = [
  { sym: 'XAU/oz',    price: '—', change: '—', up: true  },
  { sym: 'XAG/oz',    price: '—', change: '—', up: true  },
  { sym: 'WTI/bbl',   price: '—', change: '—', up: false },
  { sym: 'BRENT/bbl', price: '—', change: '—', up: false },
  { sym: 'CU/MT',     price: '—', change: '—', up: true  },
  { sym: 'AL/MT',     price: '—', change: '—', up: false },
  { sym: 'CACAO/MT',  price: '—', change: '—', up: true  },
  { sym: 'COFFEE/lb', price: '—', change: '—', up: true  },
];

function TickerItem({ sym, price, change, up }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '0 18px', height: T.layout.tickerH,
      borderRight: `1px solid ${T.color.line}`, flexShrink: 0,
    }}>
      <span style={{ fontFamily: T.font.mono, fontSize: 9, fontWeight: 600, color: T.color.gold, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{sym}</span>
      <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.text, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{price}</span>
      <span style={{ fontFamily: T.font.mono, fontSize: 9, color: up ? T.color.success : T.color.danger, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{change}</span>
    </div>
  );
}

export function TickerBar() {
  const [hovered, setHovered] = useState(false);
  const { items } = useLivePrices(); // Status removed since dot is gone
  const allItems = [...items, ...items];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: T.layout.tickerH, background: T.color.bg0,
        // Updated: Using T.color.gold to match the ROMI NEXUS block
        borderBottom: `1.5px solid ${T.color.gold}`, 
        display: 'flex', alignItems: 'center',
        overflow: 'hidden', flexShrink: 0,
        position: 'relative', userSelect: 'none',
      }}
    >
      <div style={{
        background: T.color.gold, color: '#000',
        padding: '0 12px', height: '100%',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: T.font.mono, fontSize: 9, fontWeight: 700,
        letterSpacing: '0.18em', whiteSpace: 'nowrap',
        flexShrink: 0, zIndex: 2,
      }}>
        ROMI NEXUS ▶
      </div>

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          animation: 'tickerScroll 36s linear infinite',
          animationPlayState: hovered ? 'paused' : 'running',
          willChange: 'transform',
        }}>
          {allItems.map((item, i) => <TickerItem key={`${item.sym}-${i}`} {...item} />)}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
