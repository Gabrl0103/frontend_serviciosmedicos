import React from 'react';

function IconCheck() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 12l4 4 8-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCross() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ValorIndicador({ nombre, valor, unidad, min, max }) {
  const lo = Number(min);
  const hi = Number(max);
  const num = Number(String(valor).replace(',', '.'));
  const hasRange = !Number.isNaN(lo) && !Number.isNaN(hi) && hi > lo;
  const outOfRange =
    hasRange && !Number.isNaN(num) && (num < lo || num > hi);
  const color = outOfRange ? 'var(--danger)' : 'var(--success)';
  let pct = 50;
  if (hasRange && !Number.isNaN(num)) {
    pct = ((num - lo) / (hi - lo)) * 100;
    pct = Math.min(100, Math.max(0, pct));
  } else if (!hasRange) {
    pct = 100;
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          marginBottom: 4,
        }}
      >
        {nombre}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 20,
          fontWeight: 700,
          color,
        }}
      >
        {valor}
        {unidad ? (
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {unidad}
          </span>
        ) : null}
        <span aria-hidden style={{ display: 'flex' }}>
          {outOfRange ? <IconCross /> : <IconCheck />}
        </span>
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 4,
          background: 'var(--border)',
          marginTop: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {hasRange ? (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          Ref: {lo} – {hi} {unidad || ''}
        </div>
      ) : null}
    </div>
  );
}
