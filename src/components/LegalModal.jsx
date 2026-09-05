// LegalModal — Privacy Policy + Terms of Use overlay
import { useEffect } from "react";
import { Btn } from "../ui";

const GOLD = "#D4AF37";
const DIM  = "#3a3a3a";
const BORDER = "#1a1a1a";
const MONO = "'IBM Plex Mono',monospace";

const PRIVACY_TEXT = `ROMI GROUP F.Z.C — PRIVACY POLICY
Governed by UAE Federal Personal Data Protection Law, Decree-Law No. 45 of 2021 (PDPL).
Dispute resolution: DIFC Courts by contractual election (NCNDA). The DIFC Courts election does not alter the applicable data protection statute.

1. DATA CONTROLLER
Romi Group F.Z.C (Ajman Free Zone Licence No. 40601) acts as the primary Data Controller for all principal data processed through the Romi Nexus Gateway. Regulated under UAE Federal AML/CFT framework (Decree-Law No. 20 of 2018).

2. DATA COLLECTION
We strictly collect corporate identification, beneficial ownership data, and transaction histories required to satisfy UAE Federal AML/KYC obligations and perform our proprietary Due Diligence (DD) underwriting.

3. RIGHT TO ERASURE (ART. 14 — UAE PDPL)
Under UAE Federal PDPL Decree-Law No. 45 of 2021, users possess the right to erasure. Execution of this right will irreversibly shred all platform data associated with the user, except where retention is mandated by UAE Federal AML statutes (typically 5 years post-transaction).

4. SECURE COMMUNICATIONS & COMPLIANCE OVERSIGHT
All Trade Room communications, financial coordinates, and uploaded documents are secured via TLS 1.3 in transit and encrypted at rest (AES-256). To enforce the Mutual NCNDA and ensure regulatory compliance, authorized Romi Nexus Compliance personnel maintain secure, audited access to active Trade Rooms.`;

const TERMS_TEXT = `ROMI GROUP F.Z.C — TERMS OF USE
Institutional Gateway

1. PRINCIPAL-TO-PRINCIPAL ONLY
Romi Nexus is a strictly principal-to-principal environment. Brokers, intermediaries, and mandate chains without verified signatory power are strictly prohibited.

2. REPUTATION SCORING
Your Reputation Score is a dynamic metric reflecting your reliability, document authenticity, and successful deal closures.

3. NON-CIRCUMVENTION
By accessing this platform, you are bound by the 24-month Mutual NCNDA accepted during your initial OTP authentication. Circumvention of the 2% Facilitation Fee carries a liquidated damage equal to 3x the avoided commission.

4. JURISDICTION
All disputes arising from platform use shall be referred exclusively to the DIFC Courts.

5. AI-ASSISTED DUE DILIGENCE & DATA SOVEREIGNTY CONSENT
Romi Nexus operates as a technological facilitator utilizing advanced AI for data extraction and risk scoring. By submitting documentation, the User provides explicit, informed consent for their data to be securely routed to international sub-processors in the EU and USA via ephemeral, Zero-Data-Retention (ZDR) cloud infrastructure. To strictly comply with OWASP standards, all entity resolution and document extraction is processed entirely in-memory. No corporate data, Personally Identifiable Information (PII), or trade secrets are stored on third-party servers, logged, or utilized to train foundational AI models. While our proprietary systems are calibrated to institutional standards, all automated summaries, KYC/AML flags, and match scores are strictly advisory.

6. INDEPENDENT VERIFICATION & LIABILITY
Romi Group F.Z.C. makes no representations or warranties regarding the accuracy of AI outputs. Transacting principals bear the sole, non-delegable responsibility to independently verify all counterparty documentation prior to executing an SPA. Romi Group F.Z.C. accepts no liability for economic loss or document misrepresentation arising from reliance on AI-generated assessments or international data processing workflows.`;

export function LegalModal({ open, onClose, type }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  if (!open) return null;
  const isPrivacy = type === "privacy";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", animation:"fadeIn 0.15s ease" }} onClick={onClose}/>
      <div style={{
        width:"90%", maxWidth:800, height:"80vh", background:"#050505",
        border:`1px solid ${BORDER}`, borderRadius:3,
        display:"flex", flexDirection:"column", zIndex:601, animation:"fadeIn 0.15s ease",
      }}>
        <div style={{ padding:"16px 24px", borderBottom:`1px solid ${BORDER}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:MONO, fontSize:11, color:GOLD, letterSpacing:"0.2em" }}>
            {isPrivacy ? "PRIVACY POLICY" : "TERMS OF USE"}
          </span>
          <Btn onClick={onClose} size="xs">CLOSE</Btn>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"24px", fontFamily:MONO, fontSize:9, color:"#8a8a8a", lineHeight:1.8, whiteSpace:"pre-wrap" }}>
          {isPrivacy ? PRIVACY_TEXT : TERMS_TEXT}
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
