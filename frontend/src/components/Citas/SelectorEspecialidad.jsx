import React from 'react';
import { capitalizar } from '../../utils/formatters';

function IconStethoscope() {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4v6a6 6 0 0012 0V4M9 4v6M15 4v6M8 20h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SelectorEspecialidad({ specialties, selected, onSelect }) {
  return (
    <div className="specGrid">
      {specialties.map((spec) => {
        const active = selected === spec;
        return (
          <button
            key={spec}
            type="button"
            onClick={() => onSelect(spec)}
            className="card"
            style={{
              padding: 20,
              textAlign: 'left',
              cursor: 'pointer',
              border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: active ? 'var(--primary-light)' : 'var(--surface)',
            }}
          >
            <div style={{ color: 'var(--primary)', marginBottom: 10 }}>
              <IconStethoscope />
            </div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {capitalizar(spec)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
