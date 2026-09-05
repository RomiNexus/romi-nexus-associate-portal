// src/components/ui/Panel.jsx

import React from 'react';
import { TOKENS } from '../../styles/tokens';

export default function Panel({
  title,
  eyebrow,
  meta,
  action,
  children,
  style = {},
  bodyStyle = {},
  padded = true,
  elevated = false,
}) {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0b0b0b 0%, #070707 100%)',
        border: `1px solid ${TOKENS.color.border}`,
        borderRadius: TOKENS.radius.lg,
        boxShadow: elevated ? TOKENS.shadow.floating : TOKENS.shadow.panel,
        overflow: 'hidden',
        minWidth: 0,
        minHeight: 0,
        ...style,
      }}
    >
      {(title || eyebrow || meta || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            padding: '16px 18px',
            borderBottom: `1px solid ${TOKENS.color.border}`,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0))',
          }}
        >
          <div style={{ minWidth: 0 }}>
            {eyebrow && (
              <div
                style={{
                  fontFamily: TOKENS.font.mono,
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  color: TOKENS.color.gold,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <div
                style={{
                  fontFamily: TOKENS.font.sans,
                  fontSize: 18,
                  lineHeight: 1.25,
                  fontWeight: 600,
                  color: TOKENS.color.text,
                }}
              >
                {title}
              </div>
            )}
            {meta && (
              <div
                style={{
                  marginTop: 6,
                  fontFamily: TOKENS.font.mono,
                  fontSize: 11,
                  color: TOKENS.color.textSoft,
                  letterSpacing: '0.04em',
                }}
              >
                {meta}
              </div>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}

      <div
        style={{
          padding: padded ? 18 : 0,
          minWidth: 0,
          minHeight: 0,
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </section>
  );
}