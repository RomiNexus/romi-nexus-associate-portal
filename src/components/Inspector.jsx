// src/components/inspector/Inspector.jsx
import { useEffect, useState } from "react";
import { Btn, Tag, Divider } from "../ui";
import { StatusBadge } from "../ui/StatusBadge";

const GOLD   = "#D4AF37";
const RED    = "#c0392b";
const GREEN  = "#27ae60";
const ORANGE = "#e67e22";
const DIM    = "#3a3a3a";
const BORDER = "#1a1a1a";
const MONO   = "'IBM Plex Mono',monospace";

function Row({ label, value, color }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, padding:"6px 0", borderBottom:`1px solid ${BORDER}` }}>
      <span style={{ fontFamily:MONO, fontSize:8, color:DIM, letterSpacing:"0.1em", flexShrink:0, paddingTop:1 }}>{label}</span>
      <span style={{ fontFamily:MONO, fontSize:9, color: color || "#c0c0c0", textAlign:"right", lineHeight:1.5 }}>
        {typeof value === 'object' ? JSON.stringify(value) : value}
      </span>
    </div>
  );
}

export function Inspector({ item, data, onClose, onStrFlag }) {
  // Support both 'item' and 'data' props depending on how it's called
  const targetItem = item || data;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!targetItem) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [targetItem, onClose]);

  if (!targetItem) return null;

  // Determine if it's a DD applicant based on fields passed
  const isDD = "risk_score" in targetItem || "verdict" in targetItem || "role" in targetItem || "ddStatus" in targetItem || "pending_docs" in targetItem;

  const getRiskColor = (score) => {
    if (!score) return undefined;
    const num = Number(score);
    return num > 70 ? RED : num > 40 ? GOLD : GREEN;
  };

  const handleViewSecureDoc = async (storagePath) => {
    try {
      const res = await fetch('https://api.rominexus.com/?action=getSecureDocumentUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ storagePath })
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        window.open(data.url, '_blank');
      } else {
        alert(`Access Denied: ${data.error || 'Could not generate secure link'}`);
      }
    } catch (err) {
      alert('Network error while requesting secure document.');
    }
  };

  const handleDocDecision = async (docId, decision) => {
    setIsProcessing(true);
    try {
      const res = await fetch('https://api.rominexus.com/?action=verifySupplementalDoc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ docId, decision })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`Document successfully marked as ${decision}.`);
        onClose(); // Closes the inspector to refresh the main OpsDesk queue
      } else {
        alert(`Error: ${data.error || 'Failed to process decision'}`);
      }
    } catch (err) {
      alert('Network error while saving decision.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:"fixed", inset:0, zIndex:299, background:"rgba(0,0,0,0.4)" }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(440px, 92vw)",
        background: "#050505",
        border: `1px solid ${BORDER}`,
        borderRight: "none",
        zIndex: 300,
        display: "flex", flexDirection: "column",
        animation: "slideIn 0.22s cubic-bezier(0.16,1,0.3,1)",
        overflowY: "hidden",
      }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:MONO, fontSize:10, color:GOLD, letterSpacing:"0.15em" }}>
              {isDD ? "DD RECORD INSPECTOR" : "MANDATE DETAIL"}
            </span>
            {(targetItem.status || targetItem.ddStatus) && <StatusBadge status={targetItem.status || targetItem.ddStatus} />}
          </div>
          <Btn onClick={onClose} size="xs">✕ BACK</Btn>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:4 }}>

          {/* Core Identity */}
          <Row label="ID"            value={targetItem.id || targetItem.mandateId || targetItem.ddId} color={GOLD} />
          <Row label="ENTITY"        value={targetItem.company_name || targetItem.entity || targetItem.clientName} />
          
          {/* AI Underwriter Explicit Data Map */}
          {isDD && (
            <>
              <Divider />
              <Row label="ROLE"          value={targetItem.role} />
              <Row label="COMMODITY"     value={targetItem.commodity} />
              <Row label="VERDICT"       value={targetItem.verdict} color={targetItem.verdict === 'GO' ? GREEN : targetItem.verdict === 'NO-GO' ? RED : GOLD} />
              <Row label="RISK SCORE"    value={targetItem.risk_score != null ? `${targetItem.risk_score} / 100` : undefined} color={getRiskColor(targetItem.risk_score)} />
              
              <Row label="MISSING DOCS"  value={targetItem.missing_docs?.length > 0 ? targetItem.missing_docs.join(', ') : "None"} color={targetItem.missing_docs?.length > 0 ? RED : GREEN} />

              {/* ─── SUPPLEMENTAL DOCUMENTS BLOCK ─── */}
              {targetItem.pending_docs && targetItem.pending_docs.length > 0 && (
                <>
                  <Divider />
                  <div style={{ fontFamily:MONO, fontSize:8, color:GOLD, letterSpacing:"0.1em", marginBottom:8, marginTop: 8 }}>
                    SUPPLEMENTAL DOCS UPLOADED
                  </div>
                  
                  {targetItem.pending_docs.map((doc, idx) => {
                    // FIX: Only consider it failed/locked if it was explicitly rejected by ops or failed permanently
                    const isRejected = doc.status === 'REJECTED_BY_OPS' || doc.status === 'FAILED';
                    const isVerified = doc.status === 'APPROVED' || doc.status === 'VERIFIED';
                    
                    // If it is NOT permanently rejected AND NOT permanently verified, Ops can take action!
                    const isActionable = !isRejected && !isVerified;
                    
                    return (
                      <div key={idx} style={{ 
                        padding: 12, 
                        background: '#0a0a0a', 
                        border: `1px solid ${isVerified ? GREEN : isRejected ? RED : ORANGE}44`, 
                        borderRadius: 4, 
                        marginBottom: 12 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                          <span style={{ fontFamily:MONO, fontSize:10, color: '#fff', fontWeight: 600 }}>
                            {doc.doc_type?.toUpperCase().replace(/_/g, ' ')}
                          </span>
                          <Tag label={doc.status} color={isVerified ? GREEN : isRejected ? RED : ORANGE} />
                        </div>
                        
                        <Row label="AI CONFIDENCE" value={doc.ai_confidence ? `${doc.ai_confidence}%` : "Pending..."} color={doc.ai_confidence >= 80 ? GREEN : RED} />

                        {/* AI REASONING / EXECUTIVE SUMMARY FOR THIS DOC */}
                        <div style={{ marginTop: 12, marginBottom: 8 }}>
                          <div style={{ fontFamily:MONO, fontSize:8, color:DIM, letterSpacing:"0.1em", marginBottom:4 }}>
                            AI VERIFICATION SUMMARY
                          </div>
                          <div style={{ 
                            fontFamily:MONO, 
                            fontSize:9, 
                            color:"#c0c0c0", 
                            lineHeight:1.6, 
                            background:"#111", 
                            padding:10, 
                            borderRadius:2, 
                            border:`1px solid ${BORDER}` 
                          }}>
                            {doc.ai_summary || "No AI summary generated yet."}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                           <Btn 
                              variant="ghost" 
                              size="xs" 
                              onClick={() => handleViewSecureDoc(doc.storage_path)}
                           >
                             VIEW DOCUMENT
                           </Btn>
                           
                           {/* The buttons will now correctly show for 'MANUAL_REVIEW_REQUIRED' */}
                           {isActionable && (
                             <>
                               <Btn 
                                  variant="ghost" size="xs" style={{ color: GREEN, borderColor: GREEN }}
                                  onClick={() => handleDocDecision(doc.id, 'APPROVED')} disabled={isProcessing}
                               >
                                 {isProcessing ? '...' : 'CLEAR'}
                               </Btn>
                               <Btn 
                                  variant="ghost" size="xs" style={{ color: RED, borderColor: RED }}
                                  onClick={() => handleDocDecision(doc.id, 'REJECTED')} disabled={isProcessing}
                               >
                                 {isProcessing ? '...' : 'REJECT'}
                               </Btn>
                             </>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}

          {!isDD && (
            <>
              <Divider />
              <Row label="COMMODITY"     value={targetItem.commodity} />
              <Row label="VOLUME"        value={targetItem.volume || targetItem.quantity} />
              <Row label="VALUE (USD)"   value={targetItem.valueUsd ?? targetItem.dealValue} color={GREEN} />
              <Row label="ORIGIN"        value={targetItem.origin || targetItem.country} />
              <Row label="DESTINATION"   value={targetItem.destination} />
              <Divider />
              <Row label="STATUS"       value={targetItem.status} />
              <Row label="SUBMITTED"    value={targetItem.submittedAt || targetItem.createdAt} />
              <Row label="EXPIRES"      value={targetItem.expiresAt} />
              <Row label="COUNTERPARTY" value={targetItem.counterparty} />
            </>
          )}

          {/* Main Narrative / Executive Summary Map */}
          {targetItem.executive_summary || targetItem.audit_reasoning || targetItem.notes || targetItem.narrative ? (
            <>
              <Divider />
              <div style={{ fontFamily:MONO, fontSize:8, color:DIM, letterSpacing:"0.1em", marginBottom:4 }}>MAIN EXECUTIVE SUMMARY</div>
              <div style={{ fontFamily:MONO, fontSize:9, color:"#8a8a8a", lineHeight:1.7, background:"#0a0a0a", padding:10, borderRadius:2, border:`1px solid ${BORDER}` }}>
                {targetItem.executive_summary || targetItem.audit_reasoning || targetItem.notes || targetItem.narrative}
              </div>
            </>
          ) : null}
        </div>
        
        <div style={{ padding:"12px 20px", borderTop:`1px solid ${BORDER}`, display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
          {isDD && onStrFlag && (
            <Btn variant="red" size="sm" onClick={() => onStrFlag(targetItem)}>
              ⚑ FLAG STR
            </Btn>
          )}
        </div>
      </div>
    </>
  );
}

export default Inspector;