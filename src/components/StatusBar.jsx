// src/components/shell/StatusBar.jsx
import { useState, useEffect } from 'react';
import { T } from './tokens.js';

// ── Live clock (GST = UTC+4) ───────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState(() => gstNow());
  useEffect(() => {
    const id = setInterval(() => setTime(gstNow()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function gstNow() {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function StatusBar({
  licenseNo = '40601',
  userTag   = '',
  connected = true,
}) {
  const time = useClock();

  return (
    <div style={{
      height: T.layout.statusBarH,
      background: '#050505',
      borderBottom: `1px solid ${T.color.line}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      // Adjusted: 12px left padding matches the exact start of the "ROMI NEXUS" text below
      padding: '0 14px 0 12px', 
      flexShrink: 0,
    }}>

      {/* Left: Pulse dot + system labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          title={connected ? 'Connected' : 'Offline'}
          style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: connected ? T.color.success : T.color.danger,
            boxShadow: connected ? `0 0 6px ${T.color.success}` : 'none',
            animation: connected ? 'statusPulse 2s ease-in-out infinite' : 'none',
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusLabel>INSTITUTIONAL TERMINAL</StatusLabel>
          <StatusLabel>AFZ LIC {licenseNo}</StatusLabel>
        </div>
      </div>

      {/* Right: session user + clock + timezone */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {userTag && (
          <StatusTag gold>{userTag.toUpperCase()}</StatusTag>
        )}
        <StatusLabel mono>{time}</StatusLabel>
        <StatusLabel>GST UTC+4</StatusLabel>
      </div>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}

function StatusTag({ children, gold }) {
  return (
    <span style={{
      fontFamily: T.font.mono,
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.12em',
      color: gold ? T.color.gold : T.color.textMute,
    }}>
      {children}
    </span>
  );
}

function StatusLabel({ children, mono }) {
  return (
    <span style={{
      fontFamily: T.font.mono,
      fontSize: 9,
      color: T.color.textDim,
      letterSpacing: '0.08em',
    }}>
      {children}
    </span>
  );
}