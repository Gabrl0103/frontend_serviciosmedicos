/**
 * Genera horarios sugeridos si el backend no entrega disponibilidad.
 */
export function generateDefaultTimeSlots() {
  const slots = [];
  const now = new Date();
  for (let dayOffset = 0; dayOffset < 21 && slots.length < 28; dayOffset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + dayOffset);
    const dow = day.getDay();
    if (dow === 0 || dow === 6) continue;
    const hours = [9, 10, 11, 14, 15, 16];
    for (const h of hours) {
      for (const m of [0, 30]) {
        if (h === 16 && m === 30) continue;
        const t = new Date(day);
        t.setHours(h, m, 0, 0);
        if (t.getTime() <= now.getTime()) continue;
        slots.push(t.toISOString());
      }
    }
  }
  return slots.slice(0, 24);
}

/**
 * Si el médico trae slots en la respuesta, úsalos.
 */
export function getSlotsForDoctor(medico) {
  const fromApi =
    medico?.horariosDisponibles ||
    medico?.slots ||
    medico?.disponibilidad;
  if (Array.isArray(fromApi) && fromApi.length) return fromApi;
  return generateDefaultTimeSlots();
}
