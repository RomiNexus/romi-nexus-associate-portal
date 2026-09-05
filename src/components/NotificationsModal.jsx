import React, { useEffect, useState } from "react";
import { T } from "../shell/tokens";

const RED = "#c0392b";
const GREEN = "#27ae60";
const GOLD = "#D4AF37";

// Helper to color-code the notification based on the backend types
const getBorderColor = (type) => {
  if (type === 'COMPLIANCE' || type === 'danger') return RED;
  if (type === 'AI_MATCH' || type === 'ROOM_APPROVAL') return GOLD;
  return GREEN; // Default for SUPPORT, TRADE_ROOM, success
};

export function NotificationsModal({ open, onClose, notifications = [], onDismiss }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  if (!open) return null;

  const modalStyle = isMobile 
    ? { position: 'fixed', top: 60, left: 16, right: 16, zIndex: 9999, background: T.color.bg1, border: `1px solid ${T.color.lineStrong}`, borderRadius: T.radius.lg, boxShadow: T.shadow.lg, overflow: 'hidden' }
    : { position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 320, zIndex: 200, background: T.color.bg1, border: `1px solid ${T.color.lineStrong}`, borderRadius: T.radius.lg, boxShadow: T.shadow.lg, overflow: 'hidden' };

  return (
    <div style={modalStyle}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.color.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.gold, letterSpacing: '0.15em', fontWeight: 600 }}>
          NOTIFICATIONS
        </span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: T.color.textDim, cursor: 'pointer', fontFamily: T.font.mono, fontSize: 8 }}>
          CLOSE
        </button>
      </div>

      <div style={{ maxHeight: 360, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.textDim }}>NO NEW ALERTS</span>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{
              background: T.color.bg2, borderRadius: T.radius.sm, padding: '12px',
              borderLeft: `3px solid ${getBorderColor(n.type)}`,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.color.text, fontWeight: 600 }}>{n.title}</span>
                {/* Notice: we safely call onDismiss if it is passed from App.jsx */}
                {onDismiss && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }} 
                    style={{ background: 'transparent', border: 'none', color: T.color.textDim, cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                  >
                    ×
                  </button>
                )}
              </div>
              <div style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.textMute, lineHeight: 1.4 }}>
                {n.message || n.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}