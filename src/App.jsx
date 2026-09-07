import React, { useState } from 'react';
import GlobalIntelDashboard from './views/GlobalIntelDashboard';
import OffPlatformClients from './views/OffPlatformClients';
import PilotSandboxView from './views/PilotSandboxView';
import './Global.css';

const GOLD = "#D4AF37";
const DIM = "#3a3a3a";
const BORDER = "#1a1a1a";
const MONO = "'IBM Plex Mono',monospace";
const RED = "#c0392b";
const GREEN = "#27ae60";

const WORKER_URL = import.meta.env.WORKER_URL; 

// --- 1. OTP LOGIN SCREEN ---
function LoginScreen({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async () => {
    if (!email.includes("@")) return setError("⚠ Invalid email.");
    setLoading(true); setError("");
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendOTP", email: email.toLowerCase() })
      }).then(r => r.json());
      
      if (res.success || res.status === "pending") setStep(2);
      else setError(res.error || "Failed to issue OTP.");
    } catch { setError("Network Error: Gateway unreachable."); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) return setError("⚠ Invalid OTP.");
    setLoading(true); setError("");
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyOTP", email: email.toLowerCase(), otp })
      }).then(r => r.json());
      
      // OWASP: Save both the email AND the secure cryptographic token
      if (res.success && res.token) {
        onAuthenticated({ email: email.toLowerCase(), token: res.token });
      } else {
        setError(res.error || "Invalid OTP.");
      }
    } catch { setError("Network Error: Gateway unreachable."); }
    finally { setLoading(false); }
  };

  const inputStyle = { boxSizing: "border-box", width: "100%", background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff", fontFamily: MONO, fontSize: 16, padding: "10px", marginBottom: 20, outline: "none", borderRadius: 2 };
  const btnStyle = { boxSizing: "border-box", width: "100%", padding: "10px", fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, border: "none", borderRadius: 2, transition: "all 0.2s" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#020202", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", zIndex: 9999 }}>
      <div style={{ width: "100%", maxWidth: 360, background: "#050505", border: `1px solid ${BORDER}`, padding: "32px 24px", borderRadius: 3, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, color: GOLD, letterSpacing: "0.2em" }}>NEXUS ASSOCIATE</div>
          <div style={{ fontFamily: MONO, fontSize: 8, color: DIM, letterSpacing: "0.25em", marginTop: 6 }}>PILOT SANDBOX LOGIN</div>
        </div>
        
        {error && <div style={{ background: "#1a0505", border: `1px solid ${RED}`, color: RED, padding: "8px", fontFamily: MONO, fontSize: 9, marginBottom: 16, borderRadius: 2 }}>{error}</div>}
        
        {step === 1 ? (
          <>
            <span style={{ fontFamily: MONO, color: DIM, fontSize: 8, marginBottom: 8, letterSpacing: "0.15em" }}>ASSOCIATE EMAIL</span>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleRequestOTP()} style={inputStyle} autoFocus />
            <button onClick={handleRequestOTP} disabled={loading} style={{ ...btnStyle, background: GOLD, color: "#000", opacity: loading ? 0.6 : 1 }}>{loading ? "TRANSMITTING..." : "REQUEST SECURE OTP"}</button>
          </>
        ) : (
          <>
            <span style={{ fontFamily: MONO, color: DIM, fontSize: 8, marginBottom: 8, letterSpacing: "0.15em" }}>ENTER 6-DIGIT OTP</span>
            <input value={otp} onChange={e => setOtp(e.target.value)} onKeyDown={e => e.key === "Enter" && handleVerifyOTP()} maxLength={6} style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.5em", color: GOLD }} autoFocus />
            <button onClick={handleVerifyOTP} disabled={loading} style={{ ...btnStyle, background: GREEN, color: "#fff", opacity: loading ? 0.6 : 1 }}>{loading ? "VERIFYING..." : "AUTHENTICATE"}</button>
          </>
        )}
      </div>
    </div>
  );
}

// --- 2. MAIN PORTAL SHELL ---
export default function App() {
  const [activeTab, setActiveTab] = useState('intel');
  
  // sessionData will hold { email, token } once authenticated
  const [sessionData, setSessionData] = useState(null);

  // The Gatekeeper: If no session data exists, force the OTP screen
  if (!sessionData) {
    return <LoginScreen onAuthenticated={setSessionData} />;
  }

  // Construct the live user object to pass to your views
  const associateUser = { 
    email: sessionData.email, 
    token: sessionData.token, 
    role: "ASSOCIATE" 
  };

  const NAV_ITEMS = [
    { key: 'intel', label: 'Global Intel' },
    { key: 'clients', label: 'Off-Platform Clients' },
    { key: 'pilot', label: 'Tactical Deal Simulator' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020202', color: '#fff', fontFamily: MONO }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: 260, borderRight: `1px solid ${BORDER}`, background: '#050505', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: '0.2em' }}>NEXUS ASSOCIATE</div>
          <div style={{ fontSize: 8, color: DIM, letterSpacing: '0.2em', marginTop: 4 }}>SECURE SESSION: {associateUser.email.split('@')[0].toUpperCase()}</div>
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

        {/* Logout Button */}
        <div style={{ marginTop: 'auto', padding: 12, borderTop: `1px solid ${BORDER}` }}>
          <button onClick={() => setSessionData(null)} style={{ width: '100%', padding: '10px', background: 'transparent', border: `1px solid ${BORDER}`, color: DIM, fontFamily: MONO, fontSize: 8, letterSpacing: '0.15em', cursor: 'pointer', borderRadius: 2, transition: "all 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = DIM}>
            TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {activeTab === 'intel' && <GlobalIntelDashboard />}
        {activeTab === 'clients' && <OffPlatformClients userData={associateUser} />}
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
      fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s'
    }}>
      {label}
    </button>
  );
}