// src/components/ui/MetricCard.jsx
// Reconciled with mock's KpiCard API: label / value / sub / color / icon / delta.
// Tokens sourced from shell/tokens.js (T) — not the legacy TOKENS path.

import React from 'react';
import { T } from '../shell/tokens.js';
import { Icon } from './Icon.jsx';

export function MetricCard({
  label,
  value,
  sub,
  color = T.color.gold,
  icon,
  delta,          // { positive: bool, value: number, label: string }
  style = {},
}) {
  return (
    <div
      style={{
        background: T.color.panel,
        border: `1px solid ${T.color.border}`,
        borderRadius: T.radius.md,
        padding: '14px 16px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span
          style={{
            fontFamily: T.font.mono,
            fontSize: 8,
            color: T.color.dim,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          {label}
        </span>
        {icon && <Icon name={icon} size={14} color={color} />}
      </div>

      {/* Value */}
      <span
        style={{
          fontFamily: T.font.mono,
          fontSize: 22,
          fontWeight: 700,
          color,
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </span>

      {/* Sub-line / delta */}
      {(sub || delta) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          {delta && (
            <span
              style={{
                fontFamily: T.font.mono,
                fontSize: 9,
                color: delta.positive ? T.color.green : T.color.red,
                letterSpacing: '0.05em',
              }}
            >
              {delta.positive ? '▲' : '▼'} {Math.abs(delta.value)}%
              {delta.label ? ` ${delta.label}` : ''}
            </span>
          )}
          {sub && (
            <span
              style={{
                fontFamily: T.font.mono,
                fontSize: 8,
                color: T.color.dim,
              }}
            >
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MetricCard;
