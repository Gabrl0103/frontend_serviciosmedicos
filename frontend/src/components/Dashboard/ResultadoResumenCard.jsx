import React from 'react';
import { formatFechaCorta } from '../../utils/formatters';
import { mapExamForDisplay } from '../../utils/exams';

function EmptyLabIllustration() {
  return (
    <svg
      className="emptyIllustration"
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden
    >
      <path
        d="M50 10h20v18l18 50a10 10 0 01-10 10H42a10 10 0 01-10-10l18-50V10z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M50 10h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ResultadoResumenCard({ examenes }) {
  const list = Array.isArray(examenes) ? examenes.map(mapExamForDisplay) : [];
  return (
    <div className="card" style={{ padding: 24, minHeight: 200 }}>
      <h2 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'Fraunces, serif' }}>
        Últimos Resultados
      </h2>
      {list.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <EmptyLabIllustration />
          <p style={{ margin: 0, fontSize: 14 }}>
            Aún no hay resultados de laboratorio en tu historia.
          </p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {list.map((ex, i) => (
            <li
              key={ex.raw?.id || i}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{ex.tipo}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {ex.fecha ? formatFechaCorta(ex.fecha) : '—'}
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: ex.estado === 'anormal' ? 'var(--danger)' : 'var(--success)',
                }}
              >
                {ex.estado === 'anormal' ? 'Anormal' : 'Normal'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
