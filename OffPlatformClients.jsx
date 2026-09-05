// nexus-associate-portal/src/views/OffPlatformClients.jsx
//
// PLACEHOLDER — the real OffPlatformClients.jsx was referenced in the build
// instructions but was not included in the uploaded files, so this stub
// exists only so the project resolves and runs. Replace this file with your
// actual component (it will receive a `userData` prop: { email, role }).

const GOLD  = "#D4AF37";
const DIM   = "#3a3a3a";
const MONO  = "'IBM Plex Mono',monospace";

export default function OffPlatformClients({ userData }) {
  return (
    <div style={{ padding: 16, fontFamily: MONO }}>
      <div style={{ fontSize: 11, color: GOLD, letterSpacing: "0.18em", fontWeight: 700 }}>
        OFF-PLATFORM CLIENTS
      </div>
      <div style={{ fontSize: 8, color: DIM, marginTop: 8 }}>
        Placeholder view — swap in the real component. Signed in as {userData?.email} ({userData?.role}).
      </div>
    </div>
  );
}
