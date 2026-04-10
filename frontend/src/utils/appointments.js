/**
 * Próximas citas: desde hoy, orden ascendente por fecha.
 */
export function getUpcomingAppointments(citas, limit = 3) {
  if (!Array.isArray(citas)) return [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return [...citas]
    .filter((c) => c?.fecha && new Date(c.fecha) >= start)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(0, limit);
}

/**
 * Normaliza estado de cita para UI.
 */
export function normalizeAppointmentStatus(raw) {
  const s = String(raw?.estado || raw?.status || 'pendiente').toLowerCase();
  if (s.includes('complet')) return 'completada';
  if (s.includes('cancel')) return 'cancelada';
  return 'pendiente';
}
