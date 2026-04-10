import React from 'react';
import { getIniciales, capitalizar } from '../../utils/formatters';

export function SelectorMedico({ medicos, selectedId, onSelect, onBack }) {
  return (
    <div>
      <button type="button" className="btn btnGhost" style={{ marginBottom: 20 }} onClick={onBack}>
        Volver
      </button>
      <div className="specGrid">
        {medicos.map((m) => {
          const id = m.id ?? m.medicoId;
          const nombre =
            m.nombreCompleto ||
            [m.nombre, m.apellido].filter(Boolean).join(' ') ||
            'Médico';
          const esp = m.especialidad || '—';
          const active = selectedId === id;
          const initials = getIniciales(m.nombre, m.apellido);
          return (
            <button
              key={id}
              type="button"
              className="card"
              onClick={() => onSelect(m)}
              style={{
                padding: 20,
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                textAlign: 'left',
                cursor: 'pointer',
                border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: active ? 'var(--primary-light)' : 'var(--surface)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{nombre}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  {capitalizar(String(esp))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
