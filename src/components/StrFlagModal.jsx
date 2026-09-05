// StrFlagModal — STR Draft creation (UAE AML Decree-Law 20/2018)
import { useState, useEffect } from "react";
import { Btn, Tag } from "../ui";
import { useToast } from "../toast/ToastProvider";

const GOLD = "#D4AF37", RED = "#c0392b", GREEN = "#27ae60", ORANGE = "#e67e22";
const DIM = "#3a3a3a", BORDER = "#1a1a1a";
const MONO = "'IBM Plex Mono',monospace";

const WORKER_URL = "https://rominexus-gateway-v6.vacorp-inquiries.workers.dev";

const getCsrfToken = () => {
  const match = document.cookie.match(/(^|;)\s*nexus_csrf\s*=\s*([^;]+)/);
  return match ? match[2] : "";
};

const apiPost = (action, payload = {}) =>
  fetch(WORKER_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Nexus-CSRF": getCsrfToken(),
    },
    body: JSON.stringify({ action, ...payload }),
  }).then(r => r.json());

const STR_CATS = [
  "STRUCTURING","LAYERING","UNKNOWN_SOURCE_OF_FUNDS",
  "SANCTIONS_EVASION","FRAUD","PEP_CONCERN",
  "UNUSUAL_PATTERN","TRADE_BASED_ML","OTHER",
];

const inp = {
  width:"100%", background:"#0a0a0a", border:`1px solid ${BORDER}`,
  color:"#fff", fontFamily:MONO, fontSize:10,
  padding:"8px 10px", outline:"none", borderRadius:2, marginTop:6,
};
const lbl = { fontFamily:MONO, fontSize:8, color:DIM, letterSpacing:"0.1em" };

export function StrFlagModal({ open, onClose, ddQueueId, dealHistoryId, tradeRoomId, subjectDefault="" }) {
  const toast = useToast();
  const [form, setForm] = useState({
    subjectEntityName:"", strCategory:"STRUCTURING",
    internalNarrative:"", commodity:"", approximateValueUsd:"",
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (open) { setForm(f => ({ ...f, subjectEntityName: subjectDefault })); setResult(null); setError(""); }
  }, [open, subjectDefault]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = async () => {
    if (!form.subjectEntityName || !form.internalNarrative)
      return setError("Subject and narrative required.");
    setLoading(true); setError("");
    try {
      const res = await apiPost("flagSTR", {
        subjectEntityName: form.subjectEntityName,
        strCategory: form.strCategory,
        internalNarrative: form.internalNarrative,
        commodity: form.commodity || undefined,
        approximateValueUsd: form.approximateValueUsd || undefined,
        ddQueueId: ddQueueId || undefined,
        dealHistoryId: dealHistoryId || undefined,
        tradeRoomId: tradeRoomId || undefined,
      });
      if (res.strId) { setResult(res); toast("STR draft created — Mario notified.", "success"); }
      else setError(res.error || "STR creation failed.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:400 }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} onClick={onClose}/>
      <div style={{
        position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)",
        width:"95%", maxWidth:520, maxHeight:"90vh", overflowY:"auto",
        background:"#050505", border:`2px solid ${RED}`, borderRadius:3, zIndex:401,
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${RED}44` }}>
          <Tag label="⚑ FLAG SUSPICIOUS TRANSACTION REPORT" color={RED} />
          <Btn onClick={onClose} size="xs">✕ ESC</Btn>
        </div>

        {result ? (
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:12 }}>
            <Tag label="✓ STR DRAFT CREATED" color={GREEN} />
            <span style={{ fontFamily:MONO, fontSize:9, color:DIM }}>STR ID: <span style={{color:GOLD}}>{result.strId}</span></span>
            <span style={{ fontFamily:MONO, fontSize:9, color:DIM, lineHeight:1.7 }}>{result.message}</span>
            <div style={{ background:"#0a0800", border:`1px solid ${ORANGE}44`, borderRadius:3, padding:10 }}>
              <span style={{ fontFamily:MONO, fontSize:8, color:ORANGE }}>Mario Brkic notified to file at: https://goaml.uaf.gov.ae</span>
            </div>
            <Btn variant="default" onClick={onClose} style={{alignSelf:"flex-start"}}>CLOSE</Btn>
          </div>
        ) : (
          <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
            {error && (
              <div style={{ background:"#1a0505", border:`1px solid ${RED}`, color:RED, padding:8, fontFamily:MONO, fontSize:9, borderRadius:2 }}>{error}</div>
            )}
            <div>
              <label style={lbl}>SUBJECT ENTITY NAME *</label>
              <input style={inp} value={form.subjectEntityName} onChange={e => setForm({...form, subjectEntityName:e.target.value})} placeholder="Company or individual name"/>
            </div>
            <div>
              <label style={lbl}>STR CATEGORY *</label>
              <select style={inp} value={form.strCategory} onChange={e => setForm({...form, strCategory:e.target.value})}>
                {STR_CATS.map(c => <option key={c} value={c}>{c.replace(/_/g," ")}</option>)}
              </select>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={lbl}>COMMODITY</label>
                <input style={inp} value={form.commodity} onChange={e => setForm({...form, commodity:e.target.value})} placeholder="e.g. Gold"/>
              </div>
              <div>
                <label style={lbl}>APPROX. VALUE USD</label>
                <input type="number" style={inp} value={form.approximateValueUsd} onChange={e => setForm({...form, approximateValueUsd:e.target.value})} placeholder="500000"/>
              </div>
            </div>
            <div>
              <label style={lbl}>INTERNAL NARRATIVE * (compliance-sensitive)</label>
              <textarea style={{...inp, minHeight:90, resize:"vertical"}} value={form.internalNarrative} onChange={e => setForm({...form, internalNarrative:e.target.value})} placeholder="Describe the suspicious indicators..."/>
            </div>
            <div style={{ background:"#0a0800", border:`1px solid ${ORANGE}44`, borderRadius:3, padding:10 }}>
              <span style={{ fontFamily:MONO, fontSize:8, color:ORANGE, lineHeight:1.7 }}>DRAFT retained 5 years per UAE AML Decree-Law 20/2018. Filing officer (Mario) notified via email.</span>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="default" onClick={onClose} disabled={loading}>CANCEL</Btn>
              <Btn variant="red" onClick={handleSubmit} disabled={loading}>{loading ? "CREATING…" : "⚑ CREATE STR DRAFT"}</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StrFlagModal;
