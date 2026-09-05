// Nexus Design Tokens — single source of truth
// Phase 2: patched to add all keys required by upgraded shell components.
// New additions:  textGhost, success, warning, danger, goldDim, goldHover,
//                 gold10/20/30, topbarHeight, sidebarCollapsed, shadow.lg alias.
// Backwards-compatible: all legacy aliases retained until Phase 2 migration completes.
//
// Fix (2026-05-05): textDim #333333 → #666666, textMute #666666 → #999999.
//   Both were near-invisible on bg0/bg1 dark surfaces (sidebar nav labels unreadable).
//   topbarHeight alias added (= topbarH) — Topbar.jsx referenced missing key.

export const T = {
  color: {
    // ── Accent (overridable via --nx-accent CSS var) ──────────────────
    gold:         'var(--nx-accent, #D4AF37)',
    goldDim:      '#a8892a',                    // subdued gold (brand-mark gradient end)
    goldHover:    '#b5952f',                    // gold hover state
    gold10:       'rgba(212,175,55,0.10)',
    gold20:       'rgba(212,175,55,0.20)',
    gold30:       'rgba(212,175,55,0.30)',

    // ── Semantic status colours ───────────────────────────────────────
    success:      '#00e676',                    // green  (mock: --success / --green)
    warning:      '#ffab00',                    // amber  (mock: --warning / --orange)
    danger:       '#ff1744',                    // red    (mock: --danger  / --red)
    info:         '#4fc3f7',                    // blue   (mock: --info)

    // Legacy aliases kept for existing components
    red:          '#ff1744',                    // → danger
    green:        '#00e676',                    // → success
    orange:       '#ffab00',                    // → warning

    // ── Layered surfaces (bg0 → bg4, darkest → lightest) ─────────────
    bg0:          '#020202',   // root background  (status bar, table headers)
    bg1:          '#080808',   // card / panel base (matches mock --bg1)
    bg2:          '#0d0d0d',   // input, segmented, search bg (mock --bg2)
    bg3:          '#121212',   // hover state, icon chip (mock --bg3)
    bg4:          '#1a1a1a',   // active / selected

    // ── Border tokens ─────────────────────────────────────────────────
    line:         '#1a1a1a',   // default border    (mock --line)
    lineStrong:   '#252525',   // hover / focus     (mock --line-strong)

    // ── Text tokens ───────────────────────────────────────────────────
    // FIXED: textDim was #333333 (invisible on bg0/bg1); bumped to #666666.
    //        textMute was #666666; bumped to #999999 for readable secondary text.
    text:         '#e8e8e8',   // primary readable  (mock --text)
    textMute:     '#999999',   // secondary / muted (mock --text-mute)
    textDim:      '#666666',   // tertiary labels   (mock --text-dim)
    textGhost:    '#333333',   // near-invisible    (mock --text-ghost, separators)

    // ── Legacy aliases (keep until Phase 2 migration completes) ───────
    bg:           '#020202',   // → bg0
    panel:        '#080808',   // → bg1
    surface:      '#0d0d0d',   // between bg0 and bg1
    surface2:     '#121212',   // → bg3
    border:       '#1a1a1a',   // → line
    dim:          '#3a3a3a',   // legacy (use textDim going forward)
    textMuted:    '#999999',   // → textMute (updated)
    textFaint:    '#666666',   // → textDim  (updated)
  },

  font: {
    sans: "'Inter', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },

  // ── Border radius ─────────────────────────────────────────────────────
  radius: {
    sm:   4,
    md:   6,
    lg:   10,
    full: 9999,
  },

  // ── Spacing (4px base unit) ────────────────────────────────────────────
  space: {
    1:  4,
    2:  8,
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    8:  32,
    10: 40,
    12: 48,
  },

  // ── Shadows ─────────────────────────────────────────────────────────────
  shadow: {
    glow: '0 0 20px rgba(212,175,55,0.38)',
    sm:   '0 1px 3px rgba(0,0,0,0.4)',
    md:   '0 4px 16px rgba(0,0,0,0.6)',
    lg:   '0 8px 32px rgba(0,0,0,0.6)',   // matches mock --shadow-lg
  },

  // ── Layout dimensions ─────────────────────────────────────────────────
  layout: {
    topbarH:           56,   // px  (mock: --topbar-h 56px)
    topbarHeight:      56,   // px  alias — Topbar.jsx reads T.layout.topbarHeight
    sidebarW:          224,  // px  (mock: --sidebar-w 224px)
    sidebarCollapsed:  60,   // px  (mock: --sidebar-collapsed 60px)
    tickerH:           26,   // px
    statusBarH:        24,   // px
    drawerW:           360,  // px
  },

  // ── Density multipliers ───────────────────────────────────────────────
  density: {
    compact:     { sidebarWidth: 200, rowH: 28, pad: 10, fontSize: 11 },
    comfortable: { sidebarWidth: 224, rowH: 34, pad: 14, fontSize: 12 },
    roomy:       { sidebarWidth: 240, rowH: 40, pad: 18, fontSize: 13 },
  },
};

// ── Role configuration ────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT: {
    label: 'Client',
    org:   'Vacorp Inquiries Ltd.',
    nav: [
      { id: 'home',     label: 'Overview',        icon: 'home'    },
      { id: 'mandates', label: 'Mandates Ledger',  icon: 'ledger'  },
      { id: 'rooms',    label: 'Trade Rooms',      icon: 'rooms'   },
      { id: 'inbox',    label: 'Support Inbox',    icon: 'inbox'   },
      { id: 'dd',       label: 'My DD Status',     icon: 'shield'  },
      { id: 'intel',    label: 'Global Intel',     icon: 'globe'   },
    ],
  },
  BUYER: {
    label: 'Buyer',
    org:   'Vacorp Inquiries Ltd.',
    nav: [
      { id: 'home',     label: 'Overview',        icon: 'home'    },
      { id: 'mandates', label: 'Mandates Ledger',  icon: 'ledger'  },
      { id: 'rooms',    label: 'Trade Rooms',      icon: 'rooms'   },
      { id: 'inbox',    label: 'Support Inbox',    icon: 'inbox'   },
      { id: 'dd',       label: 'My DD Status',     icon: 'shield'  },
      { id: 'intel',    label: 'Global Intel',     icon: 'globe'   },
    ],
  },
  SUPPLIER: {
    label: 'Supplier',
    org:   'Romi Nexus Portal',
    nav: [
      { id: 'home',     label: 'Overview',        icon: 'home'    },
      { id: 'mandates', label: 'Mandates Ledger',  icon: 'ledger'  },
      { id: 'rooms',    label: 'Trade Rooms',      icon: 'rooms'   },
      { id: 'inbox',    label: 'Support Inbox',    icon: 'inbox'   },
      { id: 'dd',       label: 'My DD Status',     icon: 'shield'  },
      { id: 'intel',    label: 'Global Intel',     icon: 'globe'   },
    ],
  },
  BUYER_MANDATE: {
  label: 'Buyer (Mandate)',
  org:   'Romi Nexus Portal',
  nav: [
    { id: 'mandates', label: 'Mandates Ledger', icon: 'ledger' },
    { id: 'rooms',    label: 'Trade Rooms',     icon: 'rooms'  },
    { id: 'inbox',    label: 'Support Inbox',   icon: 'inbox'  },
    { id: 'dd',       label: 'My DD Status',    icon: 'shield' },
    { id: 'intel',    label: 'Global Intel',    icon: 'globe'  },
  ],
},
SUPPLIER_MANDATE: {
  label: 'Supplier (Mandate)',
  org:   'Romi Nexus Portal',
  nav: [
    { id: 'mandates', label: 'Mandates Ledger', icon: 'ledger' },
    { id: 'rooms',    label: 'Trade Rooms',     icon: 'rooms'  },
    { id: 'inbox',    label: 'Support Inbox',   icon: 'inbox'  },
    { id: 'dd',       label: 'My DD Status',    icon: 'shield' },
    { id: 'intel',    label: 'Global Intel',    icon: 'globe'  },
  ],
},
  OPS: {
    label: 'Ops Desk',
    org:   'Romi Nexus Operations',
    nav: [
      { id: 'home',     label: 'Dashboard',       icon: 'dashboard' },
      { id: 'inbox',    label: 'Support Inbox',   icon: 'inbox'     }, // ADDED THIS LINE
      { id: 'orchestr', label: 'Prime Match',     icon: 'sparkle'   },
      { id: 'godview',  label: 'Trade God-View',  icon: 'eye'       },
      { id: 'ddqueue',  label: 'AI Underwriter',  icon: 'cpu'       },
      { id: 'difc',     label: 'DIFC Controls',   icon: 'shield'    },
      { id: 'intel',    label: 'Global Intel',    icon: 'globe'     },
      { id: 'off-platform', label: 'OFF-PLATFORM', icon: 'users'    },
    ],
  },
  COFOUNDER: {
    label: 'Cofounder',
    org:   'Romi Group F.Z.C',
    nav: [
      { id: 'home',     label: 'CFO Desk',        icon: 'grid' },
      { id: 'pipeline', label: 'Mandate Book',    icon: 'target' },
      { id: 'ar',       label: 'Accounts Rec.',   icon: 'book' },
      { id: 'treasury', label: 'Treasury & A/P',  icon: 'credit-card' },
      { id: 'tax',      label: 'Tax & Audit',     icon: 'shield' },
      { id: 'risk',     label: 'Risk & Escrow',   icon: 'alert-triangle' },
      { id: 'oracle',   label: 'Market Oracle',   icon: 'trending' },
      { id: 'intel',    label: 'Global Intel',    icon: 'globe' },
      { id: 'off-platform', label: 'OFF-PLATFORM', icon: 'users' },
    ],
  },
  FCCO: {
    label: 'FCCO',
    org:   'Compliance Office',
    nav: [
      { id: 'home',   label: 'Compliance',        icon: 'shield' },
      { id: 'inbox',    label: 'Support Inbox',   icon: 'inbox'  }, 
      { id: 'orchestr', label: 'Prime Match',     icon: 'sparkle'},
      { id: 'edd',    label: 'EDD Pending',       icon: 'flame'  },
      { id: 'review', label: 'Compliance Review', icon: 'file'   },
      { id: 'audit',  label: 'DIFC Audit Log',    icon: 'book'   },
      { id: 'intel',  label: 'Global Intel',      icon: 'globe'  },
      { id: 'off-platform', label: 'OFF-PLATFORM', icon: 'users' },
    ],
  },
};
