import React from 'react';
import { formatFechaCorta } from '../../utils/formatters';

function getMedicamentos(p) {
  const m = p.medicamentos || p.items || p.detalle || [];
  return Array.isArray(m) ? m : [];
}

export function TabPrescripciones({ prescripciones }) {
  const list = Array.isArray(prescripciones)
    ? [...prescripciones].sort(
        (a, b) =>
          new Date(b.fecha || b.fechaEmision) -
          new Date(a.fecha || a.fechaEmision)
      )
    : [];

  if (!list.length) {
    return (
      <p style={{ color: 'var(--text-secondary)' }}>No hay prescripciones.</p>
    );
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {list.map((p, i) => {
        const meds = getMedicamentos(p);
        const fecha = p.fecha || p.fechaEmision;
        return (
          <li key={p.id || i} className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {fecha ? formatFechaCorta(fecha) : '—'}
              </span>
              <span
                className="badge"
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}
              >
                {meds.length} medicamento{meds.length === 1 ? '' : 's'}
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '8px 6px' }}>Nombre</th>
                    <th style={{ padding: '8px 6px' }}>Dosis</th>
                    <th style={{ padding: '8px 6px' }}>Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {meds.map((row, j) => (
                    <tr key={row.id || j} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 6px' }}>{row.nombre || row.medicamento || '—'}</td>
                      <td style={{ padding: '8px 6px' }}>{row.dosis || row.dose || '—'}</td>
                      <td style={{ padding: '8px 6px' }}>{row.duracion || row.duration || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
