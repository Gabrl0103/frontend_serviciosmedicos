import React from 'react';
import { formatFecha } from '../../utils/formatters';

export function SelectorHorario({
  slots,
  selectedIso,
  onSelect,
  onBack,
  onConfirm,
  confirming,
}) {
  return (
    <div>
      <button type="button" className="btn btnGhost" style={{ marginBottom: 20 }} onClick={onBack}>
        Volver
      </button>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {slots.map((iso) => {
          const active = selectedIso === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              className="badge"
              style={{
                padding: '10px 14px',
                fontSize: 14,
                cursor: 'pointer',
                border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: active ? 'var(--primary-light)' : 'var(--surface)',
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              {formatFecha(iso)}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="btn btnPrimary"
        disabled={!selectedIso || confirming}
        onClick={onConfirm}
      >
        {confirming ? (
          <>
            <span className="spinner" aria-hidden />
            Confirmando…
          </>
        ) : (
          'Confirmar cita'
        )}
      </button>
    </div>
  );
}
