import api from './api';

/**
 * POST /laboratorio — solicita exámenes para el paciente.
 */
export async function requestExams(body) {
  const { data } = await api.post('/laboratorio', body);
  return data;
}
