import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getIniciales } from '../../utils/formatters';

function IconHome({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 3v4M16 3v4M4 11h16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconClipboard({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4h6l1 2h3v16H5V6h3l1-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconLab({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3h6v5l4 11a2 2 0 01-2 2H7a2 2 0 01-2-2l4-11V3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 3h6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconLogout({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 7V5a2 2 0 012-2h7v18h-7a2 2 0 01-2-2v-2M15 12H3M6 9l-3 3 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconHome },
  { to: '/citas', label: 'Mis Citas', Icon: IconCalendar },
  { to: '/historia', label: 'Historia', Icon: IconClipboard },
  { to: '/laboratorios', label: 'Laboratorio', Icon: IconLab },
];

function SidebarPanel({ onNavigate }) {
  const { paciente, logout } = useAuth();
  const initials = getIniciales(paciente?.nombre, paciente?.apellido);

  return (
    <>
      <div className="sidebarBrand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {[paciente?.nombre, paciente?.apellido].filter(Boolean).join(' ') ||
                'Paciente'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {paciente?.email || paciente?.documento || ''}
            </div>
          </div>
        </div>
      </div>
      <nav className="sidebarNav" aria-label="Principal">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebarLink ${isActive ? 'sidebarLinkActive' : ''}`
            }
            onClick={onNavigate}
            end={to === '/dashboard'}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebarFooter">
        <button
          type="button"
          className="btn btnGhost"
          style={{ width: '100%', justifyContent: 'flex-start' }}
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          <IconLogout />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header className="mobileHeader">
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
          Clínica Portal
        </span>
        <button
          type="button"
          className="hamburger"
          aria-label="Abrir menú"
          onClick={() => setDrawerOpen(true)}
        >
          <IconMenu />
        </button>
      </header>

      <div
        className={`drawerOverlay ${drawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
        onKeyDown={(e) => e.key === 'Escape' && closeDrawer()}
        role="presentation"
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`drawerPanel sidebarMobileOnly ${drawerOpen ? 'open' : ''}`}
        aria-hidden={!drawerOpen}
      >
        <SidebarPanel onNavigate={closeDrawer} />
      </aside>

      <aside className="sidebar sidebarDesktop" aria-label="Navegación">
        <SidebarPanel />
      </aside>
    </>
  );
}
