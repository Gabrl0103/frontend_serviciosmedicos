import api from './api';

/**
 * POST /prescripcion — crea prescripción (si el backend lo expone).
 */
export async function createPrescription(body) {
  const { data } = await api.post('/prescripcion', body);
  return data;
}
