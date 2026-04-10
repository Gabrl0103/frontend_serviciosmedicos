import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('paciente');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id != null) setPaciente(parsed);
    } catch {
      localStorage.removeItem('paciente');
    }
  }, []);

  const login = useCallback((patientData) => {
    setPaciente(patientData);
    localStorage.setItem('paciente', JSON.stringify(patientData));
  }, []);

  const logout = useCallback(() => {
    setPaciente(null);
    localStorage.removeItem('paciente');
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      paciente,
      login,
      logout,
      isAuthenticated: Boolean(paciente?.id),
    }),
    [paciente, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
