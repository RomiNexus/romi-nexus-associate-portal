// nexus-associate-portal/src/App.jsx
import React, { useState } from 'react';
import GlobalIntelDashboard from './views/GlobalIntelDashboard';
import OffPlatformClients from './views/OffPlatformClients';
import PilotSandboxView from './views/PilotSandboxView';
import './Global.css';

const GOLD = "#D4AF37";
const DIM = "#3a3a3a";
const BORDER = "#1a1a1a";
const MONO = "'IBM Plex Mono',monospace";

// Mock associate identity for the sandbox — no live auth, no production user data.
const MOCK_ASSOCIATE_USER = {
  email: "associate@rominexus.com",
  role: "ASSOCIATE"
};

const NAV_ITEMS = [
  { key: 'intel', label: 'Global Intel' },
  { key: 'clients', label: 'Off-Platform Clients' },
  { key: 'pilot', label: 'Pilot Sandbox' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('intel');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', fontFamily: MONO }}>
      {/* Sidebar Navigation */}
      <div style={{ width: 260, borderRight: `1px solid ${BORDER}`, background: '#050505', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.2em' }}>NEXUS ASSOCIATE</div>
          <div style={{ fontSize: 8, color: DIM, letterSpacing: '0.2em', marginTop: 4 }}>PILOT SANDBOX ENVIRONMENT</div>
        </div>
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <SidebarBtn
              key={item.key}
              active={activeTab === item.key}
              onClick={() => setActiveTab(item.key)}
              label={item.label}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === 'intel' && <GlobalIntelDashboard />}
        {activeTab === 'clients' && <OffPlatformClients userData={MOCK_ASSOCIATE_USER} />}
        {activeTab === 'pilot' && <PilotSandboxView />}
      </div>
    </div>
  );
}

function SidebarBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '10px 14px', background: active ? '#111' : 'transparent',
      border: active ? `1px solid ${GOLD}44` : '1px solid transparent', color: active ? GOLD : DIM,
      fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer', borderRadius: 2
    }}>
      {label}
    </button>
  );
}
