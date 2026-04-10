import React from 'react';
import { formatFecha } from '../../utils/formatters';

export function TabConsultas({ consultas }) {
  const list = Array.isArray(consultas)
    ? [...consultas].sort(
        (a, b) =>
          new Date(b.fecha || b.fechaConsulta) -
          new Date(a.fecha || a.fechaConsulta)
      )
    : [];

  if (!list.length) {
    return (
      <p style={{ color: 'var(--text-secondary)' }}>No hay consultas registradas.</p>
    );
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {list.map((c, i) => {
        const fecha = c.fecha || c.fechaConsulta;
        const diagnostico = c.diagnostico || c.diagnosis || 'Sin diagnóstico';
        const medico =
          c.medicoNombre ||
          [c.medico?.nombre, c.medico?.apellido].filter(Boolean).join(' ') ||
          'Médico';
        const notas = c.notas || c.observaciones || '';
        return (
          <li
            key={c.id || i}
            className="card"
            style={{
              padding: 18,
              marginBottom: 14,
              borderLeft: '3px solid var(--primary)',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
              {fecha ? formatFecha(fecha) : '—'}
            </div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{diagnostico}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{medico}</div>
            {notas ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
                {notas}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
