import React from 'react';
import { formatFecha } from '../../utils/formatters';
import { normalizeAppointmentStatus } from '../../utils/appointments';

export function CitaCard({ cita }) {
  const medico =
    cita?.medicoNombre ||
    cita?.nombreMedico ||
    [cita?.medico?.nombre, cita?.medico?.apellido].filter(Boolean).join(' ') ||
    'Médico';
  const especialidad =
    cita?.especialidad ||
    cita?.medico?.especialidad ||
    '—';
  const fecha = cita?.fecha || cita?.fechaHora;
  const status = normalizeAppointmentStatus(cita);
  const badgeClass =
    status === 'completada'
      ? 'badgeDone'
      : status === 'cancelada'
        ? 'badgeCancelled'
        : 'badgePending';
  const label =
    status === 'completada'
      ? 'Completada'
      : status === 'cancelada'
        ? 'Cancelada'
        : 'Pendiente';

  return (
    <div
      className="card"
      style={{
        padding: 16,
        marginBottom: 12,
        borderLeft: '3px solid var(--primary)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 600 }}>{medico}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{especialidad}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
            {fecha ? formatFecha(fecha) : '—'}
          </div>
        </div>
        <span className={`badge ${badgeClass}`}>{label}</span>
      </div>
    </div>
  );
}
