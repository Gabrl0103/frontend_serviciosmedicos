import React from 'react';
import { formatFechaCorta } from '../../utils/formatters';
import { mapExamForDisplay } from '../../utils/exams';
import { ValorIndicador } from './ValorIndicador';

function normalizeParam(p, index) {
  return {
    key: `${index}-${p?.codigo || p?.nombre || 'param'}`,
    nombre: p.nombre || p.parametro || `Parámetro ${index + 1}`,
    valor: p.valor ?? p.value ?? '—',
    unidad: p.unidad || p.unit || '',
    min: p.min ?? p.referenciaMin ?? p.minimo,
    max: p.max ?? p.referenciaMax ?? p.maximo,
  };
}

export function ResultadoCard({ examen }) {
  const mapped = mapExamForDisplay(examen);
  const fechaLabel = mapped.fecha ? formatFechaCorta(mapped.fecha) : '—';
  const abnormal = mapped.estado === 'anormal';
  const borderColor = abnormal ? 'var(--danger)' : 'var(--success)';
  const params = mapped.parametros.map((p, i) => normalizeParam(p, i));

  return (
    <div
      className="card"
      style={{
        padding: 20,
        marginBottom: 16,
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontFamily: 'Fraunces, serif' }}>
            {mapped.tipo}
          </h3>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {fechaLabel}
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '8px 14px',
            borderRadius: 8,
            color: abnormal ? 'var(--danger)' : 'var(--success)',
            background: abnormal ? 'rgba(217, 64, 64, 0.12)' : 'rgba(46, 158, 132, 0.12)',
          }}
        >
          {abnormal ? 'ANORMAL' : 'NORMAL'}
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 8,
        }}
      >
        {params.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sin parámetros detallados.</p>
        ) : (
          params.map((p, i) => (
            <ValorIndicador
              key={p.key}
              nombre={p.nombre}
              valor={p.valor}
              unidad={p.unidad}
              min={p.min}
              max={p.max}
            />
          ))
        )}
      </div>
    </div>
  );
}
