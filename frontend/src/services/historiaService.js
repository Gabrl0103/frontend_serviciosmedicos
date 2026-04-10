import api from './api';

/**
 * GET /historia/:pacienteId — devuelve historia, prescripciones y exámenes.
 */
export async function getFullHistory(patientId) {
  const { data } = await api.get(`/historia/${patientId}`);
  return normalizeHistory(data);
}

/**
 * Adapta respuestas del backend a la forma esperada por la UI.
 */
export function normalizeHistory(raw) {
  if (Array.isArray(raw)) {
    return { consultas: raw, prescripciones: [], examenes: [], citas: [] };
  }
  if (!raw || typeof raw !== 'object') {
    return { consultas: [], prescripciones: [], examenes: [], citas: [] };
  }
  const consultas =
    raw.historia ||
    raw.consultas ||
    raw.consultaList ||
    [];
  const prescripciones = raw.prescripciones || raw.prescripcionList || [];
  const examenes = raw.examenes || raw.examenList || raw.laboratorios || [];
  const citas = raw.citas || raw.citaList || [];
  return {
    consultas: Array.isArray(consultas) ? consultas : [],
    prescripciones: Array.isArray(prescripciones) ? prescripciones : [],
    examenes: Array.isArray(examenes) ? examenes : [],
    citas: Array.isArray(citas) ? citas : [],
  };
}
