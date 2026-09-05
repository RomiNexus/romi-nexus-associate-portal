// src/components/ui/DataTable.jsx
// Reconciled: swapped TOKENS → T from shell/tokens.js, added hover row state.

import React, { useState } from 'react';
import { T } from '../shell/tokens.js';

export function DataTable({
  columns = [],
  rows = [],
  empty = 'No records found.',
  rowKey = (row, i) => row?.id ?? i,
  compact = false,
  onRowClick,
}) {
  const [hov, setHov] = useState(null);
  const padY = compact ? 8 : 12;
  const padX = compact ? 10 : 16;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || 'left',
                  padding: `${padY}px ${padX}px`,
                  borderBottom: `1px solid ${T.color.border}`,
                  fontFamily: T.font.mono,
                  fontSize: 9,
                  color: T.color.dim,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  background: T.color.panel,
                  userSelect: 'none',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                style={{
                  padding: '36px 16px',
                  textAlign: 'center',
                  fontFamily: T.font.mono,
                  fontSize: 11,
                  color: T.color.dim,
                }}
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                onClick={() => onRowClick?.(row)}
                style={{
                  background: hov === i ? T.color.panelHover ?? '#111' : 'transparent',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 120ms ease',
                  borderBottom: `1px solid ${T.color.border}`,
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: `${padY}px ${padX}px`,
                      textAlign: col.align || 'left',
                      verticalAlign: 'middle',
                      fontFamily: col.mono !== false ? T.font.mono : T.font.sans,
                      fontSize: compact ? 10 : 11,
                      color: col.color ?? T.color.textMuted,
                      whiteSpace: col.wrap ? 'normal' : 'nowrap',
                    }}
                  >
                    {col.render ? col.render(row, i) : (row?.[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
