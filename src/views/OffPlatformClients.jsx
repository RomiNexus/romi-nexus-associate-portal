import React, { useState, useRef, useEffect } from 'react';

// --- SELF-CONTAINED UI COMPONENTS ---
const GOLD = '#D4AF37';
const DIM = '#3a3a3a';
const BORDER = '#1a1a1a';
const MONO = "'IBM Plex Mono',monospace";

const Panel = ({ title, meta, children }) => (
  <div style={{ background: '#070707', border: `1px solid ${BORDER}`, borderRadius: 3 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
      <span style={{ fontFamily: MONO, fontSize: 10, color: GOLD, letterSpacing: '0.1em' }}>{title}</span>
      {meta && <span style={{ fontFamily: MONO, fontSize: 8, color: DIM }}>{meta}</span>}
    </div>
    <div style={{ overflowX: 'auto' }}>{children}</div>
  </div>
);

const Btn = ({ children, onClick, variant = "default", type = "button", disabled }) => (
  <button type={type} onClick={onClick} disabled={disabled} style={{
    background: variant === 'gold' ? GOLD : 'transparent', color: variant === 'gold' ? '#000' : GOLD,
    border: `1px solid ${variant === 'gold' ? GOLD : BORDER}`, padding: '6px 12px',
    fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 2, opacity: disabled ? 0.5 : 1, fontWeight: 600
  }}>
    {children}
  </button>
);

const Td = ({ children, color = "#c0c0c0" }) => (
  <td style={{ padding: '12px 14px', borderBottom: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: 9, color }}>
    {children}
  </td>
);

const Th = ({ children }) => (
  <th style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, fontFamily: MONO, fontSize: 8, color: DIM, textAlign: 'left', letterSpacing: '0.1em' }}>
    {children}
  </th>
);

// --- MAIN COMPONENT ---
export default function OffPlatformClients({ userData }) {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const initialForm = { id: null, name: '', entity: '', commodities: '', region: '', email: '', phone: '', notes: '', document: null };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('https://api.rominexus.com/?action=getOffPlatformClients', {
          method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userData?.email })
        });
        const data = await res.json();
        if (data.success) setClients(data.clients || []);
      } catch (err) { console.error("Error fetching clients:", err); }
    };
    if (userData?.email) fetchClients();
  }, [userData?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.entity) return alert("Name and Entity are required.");
    setIsSubmitting(true);
    
    try {
      const actionType = form.id ? 'updateOffPlatformClient' : 'addOffPlatformClient';
      const fd = new FormData();
      fd.append('action', actionType);
      fd.append('email', userData?.email);
      if (form.id) fd.append('id', form.id);
      Object.keys(form).forEach(key => { if (form[key] && key !== 'id') fd.append(key, form[key]); });

      const res = await fetch(`https://api.rominexus.com/?action=${actionType}`, { method: 'POST', credentials: 'include', body: fd });
      const data = await res.json();
      
      if (data.success) {
        setClients(prev => form.id ? prev.map(c => c.id === form.id ? data.client : c) : [data.newClient, ...prev]);
        setIsModalOpen(false);
        setForm(initialForm);
      } else alert(data.error || "Failed to save client.");
    } catch (err) { alert("Network error."); } 
    finally { setIsSubmitting(false); }
  };

  const inputStyle = { width: "100%", background: "#0a0a0a", border: `1px solid ${BORDER}`, color: "#fff", fontFamily: MONO, fontSize: 10, padding: "8px", outline: "none", borderRadius: 2, marginTop: 4, boxSizing: 'border-box' };
  const labelStyle = { fontFamily: MONO, fontSize: 8, color: DIM, letterSpacing: "0.1em" };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 600, color: '#fff', margin: 0 }}>Off-Platform Clients</h2>
        <Btn variant="gold" onClick={() => { setForm(initialForm); setIsModalOpen(true); }}>+ ADD CLIENT</Btn>
      </div>

      <Panel title="CLIENT DIRECTORY" meta={`${clients.length} RECORDS`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead><tr><Th>Name</Th><Th>Entity</Th><Th>Region</Th><Th>Commodities</Th><Th>Contact</Th><Th>Action</Th></tr></thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', fontFamily: MONO, fontSize: 10, color: DIM }}>NO CLIENTS RECORDED</td></tr>
            ) : clients.map((c, i) => (
              <tr key={i}>
                <Td color="#fff">{c.name}</Td><Td color={GOLD}>{c.entity}</Td><Td>{c.region || "—"}</Td>
                <Td>{c.commodities || "—"}</Td><Td>{c.email}<br/>{c.phone}</Td>
                <Td><Btn onClick={() => { setForm(c); setIsModalOpen(true); }}>EDIT</Btn></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', background: "rgba(0,0,0,0.85)" }}>
          <div style={{ width: "95%", maxWidth: 500, background: "#050505", border: `1px solid ${GOLD}`, borderRadius: 3, padding: 20 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD, display: "block", marginBottom: 16 }}>{form.id ? "EDIT CLIENT" : "ADD CLIENT"}</span>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>NAME *</label><input required style={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div><label style={labelStyle}>ENTITY *</label><input required style={inputStyle} value={form.entity} onChange={e => setForm({...form, entity: e.target.value})} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>COMMODITIES</label><input style={inputStyle} value={form.commodities} onChange={e => setForm({...form, commodities: e.target.value})} /></div>
                <div><label style={labelStyle}>REGION</label><input style={inputStyle} value={form.region} onChange={e => setForm({...form, region: e.target.value})} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>EMAIL</label><input type="email" style={inputStyle} value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div><label style={labelStyle}>PHONE</label><input style={inputStyle} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
                <Btn onClick={() => setIsModalOpen(false)}>CANCEL</Btn>
                <Btn variant="gold" type="submit" disabled={isSubmitting}>{isSubmitting ? "SAVING..." : "SAVE"}</Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}