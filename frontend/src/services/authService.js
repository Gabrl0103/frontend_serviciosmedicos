import api from './api';

const LOGIN_MAP_KEY = 'clinica_login_map';

function readLoginMap() {
  try {
    const raw = localStorage.getItem(LOGIN_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLoginMap(map) {
  localStorage.setItem(LOGIN_MAP_KEY, JSON.stringify(map));
}

/**
 * Registro: POST /paciente. Guarda credenciales locales para login simulado.
 */
export async function registerPatient(payload) {
  const { data } = await api.post('/paciente', payload);
  const patient = normalizePatient(data);
  if (patient?.id != null && payload.documento && payload.password) {
    const map = readLoginMap();
    map[String(payload.documento).trim()] = {
      password: payload.password,
      patientId: patient.id,
    };
    writeLoginMap(map);
  }
  return patient;
}

/**
 * Normaliza distintas formas de respuesta del backend.
 */
export function normalizePatient(raw) {
  if (!raw) return null;
  if (raw.id != null) return raw;
  if (raw.data) return normalizePatient(raw.data);
  return raw;
}

/**
 * Refresca el paciente actual con GET /paciente (usa header X-Paciente-Id).
 */
export async function fetchCurrentPatient() {
  const { data } = await api.get('/paciente');
  return normalizePatient(data);
}

/**
 * Login simulado: valida documento+contraseña en mapa local, luego GET al backend.
 */
export async function loginWithDocumentAndPassword(documento, password) {
  const doc = String(documento || '').trim();
  const map = readLoginMap();
  const entry = map[doc];
  if (!entry || entry.password !== password) {
    const err = new Error('Documento o contraseña incorrectos');
    err.code = 'AUTH_FAILED';
    throw err;
  }
  const stub = {
    id: entry.patientId,
    documento: doc,
  };
  localStorage.setItem('paciente', JSON.stringify(stub));
  try {
    const fresh = await fetchCurrentPatient();
    localStorage.setItem('paciente', JSON.stringify(fresh));
    return fresh;
  } catch (e) {
    localStorage.removeItem('paciente');
    const err = new Error('Documento o contraseña incorrectos');
    err.code = 'AUTH_FAILED';
    err.cause = e;
    throw err;
  }
}

/**
 * Tras registro exitoso, persiste sesión sin segundo GET (opcional segundo GET en caller).
 */
export function persistPatientSession(patient) {
  if (patient) {
    localStorage.setItem('paciente', JSON.stringify(patient));
  }
}

export function clearPatientSession() {
  localStorage.removeItem('paciente');
}
