import React from 'react';
import { ResultadoCard } from '../Laboratorios/ResultadoCard';

export function TabLaboratorios({ examenes }) {
  const list = Array.isArray(examenes)
    ? [...examenes].sort(
        (a, b) =>
          new Date(b.fecha || b.fechaResultado) -
          new Date(a.fecha || a.fechaResultado)
      )
    : [];

  if (!list.length) {
    return (
      <p style={{ color: 'var(--text-secondary)' }}>No hay exámenes de laboratorio.</p>
    );
  }

  return (
    <div>
      {list.map((ex, i) => (
        <ResultadoCard key={ex.id || i} examen={ex} />
      ))}
    </div>
  );
}
