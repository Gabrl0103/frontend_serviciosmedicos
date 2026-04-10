import axios from 'axios';

const baseURL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080/api/clinica';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adjunta pacienteId desde localStorage si existe
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('paciente');
  const paciente = raw ? JSON.parse(raw) : null;
  if (paciente?.id != null) {
    config.headers['X-Paciente-Id'] = String(paciente.id);
  }
  return config;
});

export default api;
