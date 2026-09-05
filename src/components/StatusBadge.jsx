// src/components/ui/StatusBadge.jsx
// Reconciled: tokens from shell/tokens.js, named export added.

import React from 'react';
import { T } from '../shell/tokens.js';

const STATUS_COLOR = {
  ACTIVE:           T.color.green,
  SIGNED:           T.color.green,
  GO:               T.color.green,
  APPROVED:         T.color.green,
  PASS:             T.color.green,
  CONFIRMED:        T.color.green,
  NEGOTIATING:      T.color.gold,
  PENDING:          T.color.gold,
  OPEN:             T.color.gold,
  PENDING_APPROVAL: T.color.gold,
  DRAFT:            T.color.orange,
  FILED:            T.color.gold,
  PROCESSING:       T.color.gold,
  'NO-GO':          T.color.red,
  CLOSED:           T.color.dim,
  EXPIRED:          T.color.dim,
  RESOLVED:         T.color.dim,
  WITHDRAWN:        T.color.dim,
  HIGH:             T.color.red,
  MED:              T.color.orange,
  LOW:              T.color.green,
  EDD_PRECIOUS:     T.color.red,
  EDD_METALS:       T.color.orange,
  STANDARD:         T.color.dim,
};

export function statusColor(s) {
  return STATUS_COLOR[s] ?? T.color.textMuted;
}

export function StatusBadge({ status, dot = false, size = 'sm' }) {
  const color = statusColor(status);
  const fs    = size === 'xs' ? 8 : 9;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: T.font.mono,
        fontSize: fs,
        color,
        border: `1px solid ${color}`,
        borderRadius: T.radius.full,
        padding: size === 'xs' ? '1px 5px' : '2px 7px',
        letterSpacing: '0.1em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
          }}
        />
      )}
      {status}
    </span>
  );
}

export default StatusBadge;
