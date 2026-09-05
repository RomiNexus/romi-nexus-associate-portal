import React, { useState, useRef, useEffect, useMemo } from 'react';
import { T, ROLES } from './tokens';
import { ShellIcon } from './ShellIcons';
import { NotificationsModal } from '../modals/NotificationsModal';

export function Topbar({ role, userData, onLogout, onCommand, onMenu, page }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // ── NEW: Manage Live Notifications & Dismissals ──
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const cfg = ROLES[role] || ROLES.CLIENT;

  // ── Reactive width tracking ─────────────────────────────
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isSmall  = screenWidth <= 600;
  const isTiny   = screenWidth <= 400;

  // ── Listen for Live Notifications ────────────────────────
  useEffect(() => {
    const handleNotifUpdate = (e) => {
      if (e.detail) {
        // Filter out any notifications the user has already dismissed
        const activeNotifs = e.detail.filter(n => !dismissedIds.has(n.id));
        setNotifications(activeNotifs);
      }
    };
    window.addEventListener('nx:notifications_updated', handleNotifUpdate);
    return () => window.removeEventListener('nx:notifications_updated', handleNotifUpdate);
  }, [dismissedIds]); // Re-run if dismissed list changes

  // ── Handle Dismissal ─────────────────────────────────────
  const handleDismiss = (id) => {
    // 1. Add to permanent ignore list
    setDismissedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // 2. Instantly remove from current view
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ── Close dropdowns on outside click ───────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const companyName = userData?.company_name || userData?.applicant_name || 'Romi Nexus Partner';
  const userEmail   = userData?.email || '';
  const userInitial = (companyName || userEmail || 'U')[0].toUpperCase();

  const pageTitle = useMemo(() => {
    const item = cfg.nav?.find(n => n.id === page);
    return item ? item.label.toUpperCase() : page?.toUpperCase() ?? '';
  }, [page, cfg]);

  return (
    <header style={{
      height: 52, background: T.color.bg1, borderBottom: `1px solid ${T.color.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 10px' : '0 14px', flexShrink: 0,
      position: 'sticky', top: 0, zIndex: 100, width: '100%', boxSizing: 'border-box',
    }}>

      {/* LEFT: Hamburger + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, minWidth: 0, flexShrink: 1 }}>
        <button
          onClick={onMenu}
          style={{
            background: 'transparent', border: 'none', color: T.color.textDim,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            padding: '6px', flexShrink: 0, minWidth: 32, minHeight: 32,
            touchAction: 'manipulation', zIndex: 10,
          }}
          aria-label="Toggle navigation"
        >
          <ShellIcon name="menu" size={isMobile ? 20 : 18} />
        </button>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {!isTiny && !isSmall && (
            <>
              <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.textDim, letterSpacing: '0.1em', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
                {companyName.toUpperCase()}
              </span>
              <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.textDim }}>/</span>
            </>
          )}
          <span style={{ fontFamily: T.font.mono, fontSize: 9, color: T.color.textMute, letterSpacing: '0.1em', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isTiny ? 100 : 160 }}>
            {pageTitle}
          </span>
        </div>
      </div>

      {/* RIGHT: Search, Bell, Divider, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8, flexShrink: 0, marginLeft: 'auto', position: 'relative', zIndex: 9999 }}>
        
        {/* Search button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCommand(); }}
          style={{
            background: T.color.bg2, border: `1px solid ${T.color.line}`, borderRadius: T.radius.md,
            padding: isSmall ? '6px 8px' : '6px 10px', display: 'flex', alignItems: 'center',
            gap: 6, cursor: 'pointer', color: T.color.textDim, minHeight: 32, touchAction: 'manipulation', zIndex: 10,
          }}
          aria-label="Search (⌘K)"
        >
          <ShellIcon name="search" size={14} />
          {!isSmall && <span style={{ fontFamily: T.font.mono, fontSize: 9, letterSpacing: '0.1em' }}>SEARCH</span>}
          {!isSmall && (
            <kbd style={{
              background: T.color.bg3, padding: '2px 4px', borderRadius: 2,
              fontSize: 8, fontFamily: T.font.mono,
            }}>⌘K</kbd>
          )}
        </button>

        {/* Notification Bell with Local Modal Dropdown */}
        <div ref={notifRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 32, height: 32, background: 'transparent', border: 'none',
              cursor: 'pointer', color: notifications.length > 0 ? T.color.gold : T.color.textDim,
              display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation', zIndex: 10,
            }}
            aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length})` : ''}`}
          >
            <ShellIcon name="bell" size={16} />
          </button>
          
          {/* THE RED NOTIFICATION DOT */}
          {notifications.length > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%',
              background: '#c0392b', border: `1.5px solid ${T.color.bg1}`, pointerEvents: 'none',
            }} />
          )}

          {/* THE RESTORED MODAL DROPDOWN */}
          <NotificationsModal 
            open={notifOpen} 
            onClose={() => setNotifOpen(false)} 
            notifications={notifications} 
            onDismiss={handleDismiss} // Passed perfectly to Modal now!
          />
        </div>

        <div style={{ width: 1, height: 16, background: T.color.line, margin: '0 2px' }} />

        {/* Profile Avatar */}
        <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: 32, height: 32, minWidth: 32, minHeight: 32, borderRadius: '50%',
              background: T.color.gold, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation', zIndex: 10, flexShrink: 0, flexGrow: 0,
            }}
          >
            <span style={{ fontFamily: T.font.mono, fontWeight: 800, fontSize: 12, color: '#000' }}>
              {userInitial}
            </span>
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', top: 40, right: 0, width: 220, background: T.color.bg1,
              border: `1px solid ${T.color.lineStrong}`, borderRadius: T.radius.lg,
              boxShadow: T.shadow.lg, padding: 12, zIndex: 200, animation: 'dropIn 0.1s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: T.font.mono, fontWeight: 800, fontSize: 14, color: '#000' }}>{userInitial}</span>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontFamily: T.font.mono, fontSize: 10, fontWeight: 600, color: T.color.text, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {companyName.toUpperCase()}
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: T.color.line, margin: '0 -12px 10px' }} />
              <button onClick={onLogout} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', padding: '8px 10px', borderRadius: 4, cursor: 'pointer', color: T.color.danger || '#ff1744', fontFamily: T.font.mono, fontSize: 10, minHeight: 40 }}>LOGOUT</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}