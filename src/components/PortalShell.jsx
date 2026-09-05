// src/components/shell/PortalShell.jsx

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { appShellStyle, isMobileWidth, mainAreaStyle } from '../../styles/layout';
import { TOKENS } from '../../styles/tokens';

export default function PortalShell({
  links = [],
  activeNav,
  setActiveNav,
  role,
  userName,
  company,
  title,
  subtitle,
  topbarRight,
  children,
}) {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const mobile = isMobileWidth(width);

  useEffect(() => {
    if (!mobile) setMobileMenuOpen(false);
  }, [mobile]);

  return (
    <div style={appShellStyle({ mobileMenuOpen, width })}>
      {!mobile && (
        <Sidebar
          links={links}
          active={activeNav}
          onChange={setActiveNav}
          role={role}
          userName={userName}
          company={company}
        />
      )}

      <Topbar
        mobile={mobile}
        title={title}
        subtitle={subtitle}
        onToggleMenu={() => setMobileMenuOpen(true)}
        rightSlot={topbarRight}
      />

      {mobile && mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: TOKENS.color.overlay,
              zIndex: TOKENS.z.overlay,
            }}
          />
          <Sidebar
            mobile
            links={links}
            active={activeNav}
            onChange={setActiveNav}
            onClose={() => setMobileMenuOpen(false)}
            role={role}
            userName={userName}
            company={company}
          />
        </>
      )}

      <main style={mainAreaStyle(width)}>
        {children}
      </main>
    </div>
  );
}