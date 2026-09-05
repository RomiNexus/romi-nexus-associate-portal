import React, { useState, useEffect, useMemo, useRef } from 'react';
import { T, ROLES } from './tokens.js';
import { ShellIcon } from './ShellIcons.jsx';

export function CommandPalette({ onClose, onAction, role, view }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  // Focus input immediately when mounted
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
    setQuery('');
    setActiveIdx(0);
  }, []);

  const commands = useMemo(() => {
    const list = [];
    const cfg = ROLES[role] || ROLES.CLIENT;

    // 1. NAVIGATION COMMANDS
    cfg.nav.forEach(n => {
      list.push({
        id: n.id,
        type: 'view',
        label: `GO TO: ${n.label.toUpperCase()}`,
        icon: n.icon || 'grid',
        category: 'NAVIGATION'
      });
    });

    // 2. CONTEXTUAL ACTIONS BASED ON ROLE
    if (role === 'COFOUNDER') {
      list.push(
        { id: 'run-match', type: 'action', label: 'EXEC: RUN MATCHING ALGORITHM', icon: 'refresh', category: 'EXECUTIVE' },
        { id: 'export-pl', type: 'action', label: 'FINANCE: EXPORT P&L REPORT', icon: 'file', category: 'EXECUTIVE' },
        { id: 'audit-log', type: 'view',   label: 'COMPLIANCE: VIEW AUDIT TRAIL', icon: 'eye', category: 'EXECUTIVE' }
      );
    }

    if (role === 'FCCO') {
      list.push(
        { id: 'clear-edd', type: 'action', label: 'GATE: CLEAR EDD RESTRICTION', icon: 'shield', category: 'COMPLIANCE' },
        { id: 'flag-str',  type: 'action', label: 'AML: FLAG SUSPICIOUS REPORT', icon: 'alert', category: 'COMPLIANCE' }
      );
    }

    if (role === 'OPS') {
      list.push(
        { id: 'approve-dd', type: 'action', label: 'KYC: APPROVE PENDING APPLICATION', icon: 'check', category: 'OPERATIONS' },
        { id: 'close-room', type: 'action', label: 'TRADE: TERMINATE ACTIVE ROOM', icon: 'x', category: 'OPERATIONS' }
      );
    }

    // 3. UNIVERSAL ACTIONS
    list.push(
      { id: 'logout', type: 'action', label: 'SYSTEM: TERMINATE SESSION', icon: 'log-out', category: 'SYSTEM' }
    );

    return list.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  }, [role, query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev + 1) % commands.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev - 1 + commands.length) % commands.length);
    }
    if (e.key === 'Enter' && commands[activeIdx]) {
      e.preventDefault();
      onAction(commands[activeIdx].id);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '15vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 600, background: T.color.bg1,
          border: `1px solid ${T.color.lineStrong}`, borderRadius: T.radius.lg,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)', overflow: 'hidden',
          animation: 'paletteIn 0.15s ease-out'
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${T.color.line}` }}>
          <ShellIcon name="search" size={18} color={T.color.textDim} />
          <input
            ref={inputRef}
            autoFocus
            placeholder="Search commands, views, or commodities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1, background: 'none', border: 'none', color: '#fff',
              fontFamily: T.font.mono, fontSize: 16, marginLeft: 14, 
              outline: 'none', WebkitUserSelect: 'text'
            }}
          />
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: 8 }}>
          {commands.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: T.color.textDim, fontFamily: T.font.mono, fontSize: 11 }}>
              NO MATCHING COMMANDS FOUND
            </div>
          ) : (
            commands.map((cmd, idx) => (
              <button
                key={`${cmd.id}-${idx}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => { onAction(cmd.id); onClose(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', border: 'none', borderRadius: T.radius.md,
                  cursor: 'pointer', textAlign: 'left',
                  background: idx === activeIdx ? T.color.bg2 : 'transparent',
                  transition: 'background 0.1s'
                }}
              >
                <ShellIcon name={cmd.icon} size={16} color={idx === activeIdx ? T.color.gold : T.color.textDim} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font.mono, fontSize: 12, color: idx === activeIdx ? '#fff' : T.color.textMute }}>
                    {cmd.label}
                  </div>
                </div>
                <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.textDim, letterSpacing: '0.1em' }}>
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '10px 20px', background: T.color.bg0, borderTop: `1px solid ${T.color.line}`,
          display: 'flex', gap: 16, alignItems: 'center'
        }}>
          <KbdLabel keys={['↑','↓']} label="Navigate" />
          <KbdLabel keys={['↵']} label="Execute" />
          <KbdLabel keys={['esc']} label="Close" />
        </div>
      </div>

      <style>{`
        @keyframes paletteIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function KbdLabel({ keys, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {keys.map(k => (
        <kbd key={k} style={{ 
          background: T.color.bg3, color: T.color.textDim, padding: '2px 6px', 
          borderRadius: 4, fontSize: 10, fontFamily: T.font.mono 
        }}>{k}</kbd>
      ))}
      <span style={{ fontSize: 10, color: T.color.textDim, fontFamily: T.font.sans }}>{label}</span>
    </div>
  );
}