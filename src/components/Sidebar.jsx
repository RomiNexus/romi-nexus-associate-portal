// src/components/shell/Sidebar.jsx
// MOBILE FIX: Removed all inline window.innerWidth checks.
// Mobile behavior is now controlled by Shell.jsx via className + transform.
import { useState } from 'react';
import { T, ROLES } from './tokens.js';
import { ShellIcon } from './ShellIcons.jsx';
import newLogo from '../../assets/nexus-logo.svg';

function NexusLogo({ collapsed }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: collapsed ? '16px 0' : '16px 14px 14px',
      justifyContent: collapsed ? 'center' : 'flex-start',
      borderBottom: `1px solid ${T.color.line}`,
      flexShrink: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <img src={newLogo} alt="Romi Nexus" style={{ width: 24, height: 24, flexShrink: 0 }} />
      {!collapsed && (
        <div style={{ overflow: 'hidden', minWidth: 0 }}>
          <div style={{
            fontFamily: T.font.mono, fontWeight: 700, fontSize: 11,
            color: T.color.gold, letterSpacing: '0.18em', lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}>ROMI NEXUS</div>
          <div style={{
            fontFamily: T.font.mono, fontSize: 7,
            color: T.color.textDim, letterSpacing: '0.2em', marginTop: 2,
            whiteSpace: 'nowrap',
          }}>INSTITUTIONAL GATEWAY</div>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role, collapsed, userData }) {
  const cfg = ROLES[role] || ROLES.CLIENT;
  if (collapsed) return null;

  const companyName =
    userData?.company_name   ||
    userData?.companyName    ||
    userData?.applicant_name ||
    userData?.full_name      ||
    userData?.name           ||
    '';

  return (
    <div style={{
      margin: '8px 10px 4px',
      padding: '8px 10px',
      background: `${T.color.gold}0d`,
      border: `1px solid ${T.color.gold}28`,
      borderRadius: T.radius.md,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {companyName && (
        <div style={{
          fontFamily: T.font.mono, fontSize: 9, color: T.color.text,
          fontWeight: 600, letterSpacing: '0.1em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {companyName.toUpperCase()}
        </div>
      )}
      <div style={{
        fontFamily: T.font.mono, fontSize: 7,
        color: T.color.gold, letterSpacing: '0.18em',
        whiteSpace: 'nowrap',
      }}>
        {cfg.label.toUpperCase()}
      </div>
    </div>
  );
}

function NavItem({ item, active, onClick, collapsed }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: collapsed ? '12px 0' : '11px 14px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active ? `${T.color.gold}12` : hov ? T.color.bg2 : 'transparent',
        border: 'none',
        borderLeft: `2px solid ${active ? T.color.gold : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
        minHeight: 44,
      }}
    >
      <div style={{ flexShrink: 0, display: 'flex', width: 16, justifyContent: 'center' }}>
        <ShellIcon
          name={item.icon}
          size={14}
          color={active ? T.color.gold : hov ? T.color.textMute : T.color.textDim}
        />
      </div>
      {!collapsed && (
        <span style={{
          fontFamily: T.font.mono,
          fontSize: 9,
          letterSpacing: '0.11em',
          color: active ? T.color.gold : hov ? T.color.textMute : T.color.textDim,
          whiteSpace: 'nowrap',
        }}>
          {item.label.toUpperCase()}
        </span>
      )}
    </button>
  );
}

export function Sidebar({ role, view, setView, collapsed, onToggle, userData, showRoleBadge = true }) {
  const cfg = ROLES[role] || ROLES.CLIENT;
  const sidebarWidth = collapsed ? 56 : 200;

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100%',
        background: T.color.bg1,
        borderRight: `1px solid ${T.color.line}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        zIndex: 100,
        boxSizing: 'border-box',
      }}
    >
      <NexusLogo collapsed={collapsed} />

      {showRoleBadge && (
        <RoleBadge role={role} collapsed={collapsed} userData={userData} />
      )}

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 0' }}>
        {!collapsed && (
          <div style={{
            padding: '8px 14px 8px',
            fontFamily: T.font.mono, fontSize: 7,
            color: T.color.textMute, letterSpacing: '0.22em',
          }}>NAVIGATION</div>
        )}
        {cfg.nav.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={view === item.id}
            onClick={() => setView(item.id)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div style={{
        borderTop: `1px solid ${T.color.line}`,
        padding: '6px 0',
        display: 'flex',
        flexDirection: 'column',
        background: T.color.bg1,
        flexShrink: 0,
      }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('nx:legal', { detail: 'terms' }))}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '12px 0' : '10px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            minHeight: 40,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = T.color.bg2)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ width: 16, display: 'flex', justifyContent: 'center' }}>
            <ShellIcon name="book" size={13} color={T.color.textDim} />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: T.font.mono, fontSize: 8, color: T.color.textDim, letterSpacing: '0.08em' }}>
              TERMS OF USE
            </span>
          )}
        </button>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('nx:legal', { detail: 'privacy' }))}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: collapsed ? '12px 0' : '10px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'transparent', border: 'none',
            cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            minHeight: 40,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = T.color.bg2)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ width: 16, display: 'flex', justifyContent: 'center' }}>
            <ShellIcon name="shield" size={13} color={T.color.textDim} />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: T.font.mono, fontSize: 8, color: T.color.textDim, letterSpacing: '0.08em' }}>
              PRIVACY POLICY
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}