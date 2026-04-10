import React from 'react';
import { CitaCard } from '../Citas/CitaCard';

function EmptyCalendarIllustration() {
  return (
    <svg
      className="emptyIllustration"
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden
    >
      <rect x="20" y="15" width="80" height="70" rx="8" stroke="currentColor" strokeWidth="2" />
      <path d="M20 35h80" stroke="currentColor" strokeWidth="2" />
      <circle cx="45" cy="60" r="8" fill="currentColor" opacity="0.2" />
      <path d="M70 52l8 8 16-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ProximaCitaCard({ citas }) {
  const list = Array.isArray(citas) ? citas : [];
  return (
    <div className="card" style={{ padding: 24, minHeight: 200 }}>
      <h2 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'Fraunces, serif' }}>
        Próximas Citas
      </h2>
      {list.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '12px 0' }}>
          <EmptyCalendarIllustration />
          <p style={{ margin: 0, fontSize: 14 }}>
            No tienes citas próximas. Agenda una desde &quot;Agendar cita&quot;.
          </p>
        </div>
      ) : (
        list.map((c, i) => <CitaCard key={c?.id || i} cita={c} />)
      )}
    </div>
  );
}
