import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginWithDocumentAndPassword } from '../../services/authService';

export function LoginForm() {
  const { login } = useAuth();
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const patient = await loginWithDocumentAndPassword(documento, password);
      login(patient);
    } catch (err) {
      if (err.code === 'AUTH_FAILED') {
        setError('Documento o contraseña incorrectos');
      } else if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError(
          'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
        );
      } else {
        setError(err.message || 'No se pudo iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error ? <div className="errorBanner" role="alert">{error}</div> : null}
      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="login-documento"
          style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: 14 }}
        >
          Documento
        </label>
        <input
          id="login-documento"
          className="input"
          type="text"
          autoComplete="username"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="login-password"
          style={{ display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: 14 }}
        >
          Contraseña
        </label>
        <input
          id="login-password"
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btnPrimary"
        style={{ width: '100%', minHeight: 44 }}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" aria-hidden />
            Ingresando…
          </>
        ) : (
          'Ingresar'
        )}
      </button>
      <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
        ¿No tienes cuenta?{' '}
        <Link to="/registro">Regístrate</Link>
      </p>
    </form>
  );
}
