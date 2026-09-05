// Inline SVG icon set — stroke-based, 18px default, currentColor
// Identical visual language to mock design. Add new icons here as needed.

export function ShellIcon({ name, size = 18, color = 'currentColor', strokeWidth = 1.6, style = {} }) {
  const s = { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style };
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };

  const paths = {
    home:      <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" {...p}/><path d="M9 21V12h6v9" {...p}/></>,
    ledger:    <><rect x="3" y="3" width="18" height="18" rx="2" {...p}/><path d="M7 8h10M7 12h10M7 16h6" {...p}/></>,
    rooms:     <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...p}/></>,
    inbox:     <><path d="M22 12h-6l-2 3h-4l-2-3H2" {...p}/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" {...p}/></>,
    shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/></>,
    globe:     <><circle cx="12" cy="12" r="10" {...p}/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" {...p}/></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" {...p}/><rect x="14" y="3" width="7" height="7" {...p}/><rect x="14" y="14" width="7" height="7" {...p}/><rect x="3" y="14" width="7" height="7" {...p}/></>,
    sparkle:   <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" {...p}/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
    cpu:       <><rect x="4" y="4" width="16" height="16" rx="2" {...p}/><rect x="9" y="9" width="6" height="6" {...p}/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" {...p}/></>,
    target:    <><circle cx="12" cy="12" r="10" {...p}/><circle cx="12" cy="12" r="6" {...p}/><circle cx="12" cy="12" r="2" {...p}/></>,
    trending:  <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" {...p}/><polyline points="16 7 22 7 22 13" {...p}/></>,
    book:      <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" {...p}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" {...p}/></>,
    flame:     <><path d="M8.5 14.5A2.5 2.5 0 0011 17h2a2.5 2.5 0 002.5-2.5c0-1.5-.5-2-1-3.5-.33-1-.5-2-.5-3 0-1-.08-4-4-4 0 2.5-2 5.5-1.5 9.5z" {...p}/></>,
    file:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" {...p}/><polyline points="14 2 14 8 20 8" {...p}/><line x1="16" y1="13" x2="8" y2="13" {...p}/><line x1="16" y1="17" x2="8" y2="17" {...p}/><line x1="10" y1="9" x2="8" y2="9" {...p}/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19" {...p}/><line x1="5" y1="12" x2="19" y2="12" {...p}/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" {...p}/><line x1="12" y1="9" x2="12" y2="13" {...p}/><line x1="12" y1="17" x2="12.01" y2="17" {...p}/></>,
    user:      <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...p}/><circle cx="12" cy="7" r="4" {...p}/></>,
    chevron:   <><polyline points="9 18 15 12 9 6" {...p}/></>,
    search:    <><circle cx="11" cy="11" r="8" {...p}/><line x1="21" y1="21" x2="16.65" y2="16.65" {...p}/></>,
    bell:      <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" {...p}/><path d="M13.73 21a2 2 0 01-3.46 0" {...p}/></>,
    menu:      <><line x1="3" y1="12" x2="21" y2="12" {...p}/><line x1="3" y1="6" x2="21" y2="6" {...p}/><line x1="3" y1="18" x2="21" y2="18" {...p}/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18" {...p}/><line x1="6" y1="6" x2="18" y2="18" {...p}/></>,
    logout:    <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" {...p}/><polyline points="16 17 21 12 16 7" {...p}/><line x1="21" y1="12" x2="9" y2="12" {...p}/></>,
    settings:  <><circle cx="12" cy="12" r="3" {...p}/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...p}/></>,
  };

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      style={s}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.file}
    </svg>
  );
}
