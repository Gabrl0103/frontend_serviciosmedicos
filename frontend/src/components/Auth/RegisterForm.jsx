import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  registerPatient,
  persistPatientSession,
  fetchCurrentPatient,
} from '../../services/authService';

function parseFieldErrors(data) {
  if (!data || typeof data !== 'object') return {};
  if (data.errores && typeof data.errores === 'object') return data.errores;
  if (data.errors && typeof data.errors === 'object') return data.errors;
  if (Array.isArray(data.fieldErrors)) {
    return Object.fromEntries(
      data.fieldErrors.map((fe) => [fe.field || fe.campo, fe.defaultMessage || fe.mensaje])
    );
  }
  return {};
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [alergias, setAlergias] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [loading, setLoading] = useState(false);

  function addAllergy() {
    const t = allergyInput.trim();
    if (!t) return;
    if (!alergias.includes(t)) setAlergias([...alergias, t]);
    setAllergyInput('');
  }

  function removeAllergy(item) {
    setAlergias(alergias.filter((a) => a !== item));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setBannerError('');
    setLoading(true);
    const payload = {
      nombre,
      apellido,
      documento,
      email,
      password,
      alergias,
    };
    try {
      const created = await registerPatient(payload);
      persistPatientSession(created);
      let sessionPatient = created;
      try {
        sessionPatient = await fetchCurrentPatient();
      } catch {
        /* usar objeto de registro si GET falla */
      }
      login(sessionPatient || created);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.response?.status === 400) {
        const data = err.response.data;
        const fe = parseFieldErrors(data);
        if (Object.keys(fe).length) setFieldErrors(fe);
        if (data?.mensaje) setBannerError(data.mensaje);
        else if (!Object.keys(fe).length) {
          setBannerError(
            data?.message || 'No se pudo completar el registro. Revisa los datos.'
          );
        }
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setBannerError(
          'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
        );
      } else {
        setBannerError(err.response?.data?.mensaje || err.message || 'Error al registrar.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {bannerError ? (
        <div className="errorBanner" role="alert">
          {bannerError}
        </div>
      ) : null}
      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <label className="labelText" htmlFor="reg-nombre">Nombre</label>
          <input
            id="reg-nombre"
            className="input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          {fieldErrors.nombre ? (
            <div className="fieldError">{String(fieldErrors.nombre)}</div>
          ) : null}
        </div>
        <div>
          <label className="labelText" htmlFor="reg-apellido">Apellido</label>
          <input
            id="reg-apellido"
            className="input"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          {fieldErrors.apellido ? (
            <div className="fieldError">{String(fieldErrors.apellido)}</div>
          ) : null}
        </div>
        <div>
          <label className="labelText" htmlFor="reg-documento">Documento</label>
          <input
            id="reg-documento"
            className="input"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            required
          />
          {fieldErrors.documento ? (
            <div className="fieldError">{String(fieldErrors.documento)}</div>
          ) : null}
        </div>
        <div>
          <label className="labelText" htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email ? (
            <div className="fieldError">{String(fieldErrors.email)}</div>
          ) : null}
        </div>
        <div>
          <label className="labelText" htmlFor="reg-password">Contraseña</label>
          <input
            id="reg-password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password ? (
            <div className="fieldError">{String(fieldErrors.password)}</div>
          ) : null}
        </div>
        <div>
          <span className="labelText">Alergias</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input
              className="input"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              placeholder="Ej. Penicilina"
            />
            <button type="button" className="btn btnGhost" onClick={addAllergy}>
              Agregar
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {alergias.map((a) => (
              <button
                key={a}
                type="button"
                className="badge"
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => removeAllergy(a)}
                title="Quitar"
              >
                {a} ×
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="btn btnPrimary"
        style={{ width: '100%', marginTop: 22, minHeight: 44 }}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" aria-hidden />
            Registrando…
          </>
        ) : (
          'Crear cuenta'
        )}
      </button>
      <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--text-secondary)', fontSize: 14 }}>
        ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
      </p>
    </form>
  );
}
