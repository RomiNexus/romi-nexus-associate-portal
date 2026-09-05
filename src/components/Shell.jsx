// src/components/shell/Shell.jsx
import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { StatusBar } from './StatusBar.jsx';
import { TickerBar } from './TickerBar.jsx';

const WORKER_URL = "https://api.rominexus.com";

export function Shell({ role, view, setView, userData, onLogout, cmdOpen, setCmdOpen, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSetView = useCallback((v) => {
    setView(v);
    if (isMobile) setMobileOpen(false);
  }, [setView, isMobile]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = mobileOpen ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isMobile]);

  useEffect(() => {
    let active = true;

    const pollNotifications = async () => {
      try {
        const res = await fetch(`${WORKER_URL}/session`, { method: "GET", credentials: "include" });
        if (!res.ok) return;
        const freshData = await res.json();
        
        if (active) {
          const newNotifs = [];
          
          const missing = freshData.missing_docs || freshData.missingDocs || [];
          if (missing.length > 0) {
            newNotifs.push({
              id: 'docs_req',
              title: 'DOCUMENTS REQUIRED',
              message: `${missing.length} compliance files needed.`,
              type: 'alert'
            });
          }

          const rooms = freshData.trade_rooms || [];
          const tickets = freshData.support_tickets || [];
          const identifier = freshData.userId || freshData.email;
          const hasUnread = [...rooms, ...tickets].some(r => {
            if (!r.updated_at) return false;
            const isInit = r.initiator_id === identifier || r.initiator_email === identifier;
            const lastRead = isInit ? r.initiator_last_read_at : r.counterparty_last_read_at;
            return new Date(r.updated_at) > new Date(lastRead || 0);
          });

          let opsUnread = false;
          if (['OPS','FCCO','COFOUNDER','ADMIN'].includes(role)) {
            try {
              const opsRes = await fetch(`${WORKER_URL}?action=getOpsData`, { method: "GET", credentials: "include" });
              const opsData = await opsRes.json();
              if (opsData.pending_rooms?.length > 0 || opsData.pending_mandates?.length > 0) {
                opsUnread = true;
              }
            } catch (e) {}
          }

          if (hasUnread || opsUnread) {
            newNotifs.push({
              id: 'msg_unread',
              title: 'NEW ACTIVITY',
              message: 'You have unread updates in your terminal.',
              type: 'message'
            });
          }

          setNotifications(newNotifs);
        }
      } catch (err) {
        console.warn("Silent poll failed", err);
      }
    };

    pollNotifications();
    const intervalId = setInterval(pollNotifications, 15000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [role]);

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{
      display: 'flex',
      height: '100dvh', // Modern dynamic viewport height
      overflow: 'hidden',
      background: '#020202',
      position: 'relative',
    }}>

      {isMobile && mobileOpen && (
        <div
          className="nx-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            zIndex: 998, WebkitTapHighlightColor: 'transparent',
          }}
        />
      )}

      <div
        className={`nx-sidebar${isMobile ? (mobileOpen ? ' open' : '') : ''}`}
        style={isMobile ? {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          height: 'auto',
          zIndex: 999,
          width: '80vw',
          maxWidth: 200,
          background: '#050505',
          boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.8)' : 'none',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box'
        } : {
          flexShrink: 0,
        }}
      >
        <Sidebar
          role={role} view={view} setView={handleSetView}
          collapsed={!isMobile && sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          userData={userData}
        />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', minWidth: 0,
      }}>
        
        <StatusBar userTag={userData?.email?.split('@')[0] || ''} connected={true} />
        <TickerBar />

        <Topbar
          role={role} userData={userData} onLogout={onLogout}
          onCommand={() => setCmdOpen(true)}
          onMenu={() => isMobile ? setMobileOpen(m => !m) : setSidebarCollapsed(c => !c)}
          page={view} notifications={notifications}
          onDismiss={handleDismissNotification}
        />

        <main style={{
          flex: 1,
          overflowY: 'auto',   // This is the ONLY scroll you need
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {children}
        </main>
      </div>

      {cmdOpen && (
        <CommandPalette role={role} onClose={() => setCmdOpen(false)} onAction={handleSetView} />
      )}
    </div>
  );
}