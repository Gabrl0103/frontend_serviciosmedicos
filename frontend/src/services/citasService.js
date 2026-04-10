import api from './api';

/**
 * GET /medicos?especialidad=X
 */
export async function getMedicos(especialidad) {
  const params = {};
  if (especialidad) params.especialidad = especialidad;
  const { data } = await api.get('/medicos', { params });
  return Array.isArray(data) ? data : data?.medicos || data?.content || [];
}

/**
 * POST /cita — agenda cita del paciente.
 */
export async function scheduleAppointment(body) {
  const { data } = await api.post('/cita', body);
  return data;
}
