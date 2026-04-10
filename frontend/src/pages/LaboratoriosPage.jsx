import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ResultadoCard } from '../components/Laboratorios/ResultadoCard';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { getFullHistory } from '../services/historiaService';
import { requestExams } from '../services/laboratorioService';
import { mapExamForDisplay } from '../utils/exams';

const EXAM_TYPES = [
  {
    id: 'HEMOGRAMA',
    title: 'Hemograma',
    description: 'Recuento de glóbulos rojos, blancos y plaquetas.',
  },
  {
    id: 'GLICEMIA',
    title: 'Glicemia',
    description: 'Medición de glucosa en sangre en ayunas.',
  },
  {
    id: 'PERFIL_LIPIDICO',
    title: 'Perfil Lipídico',
    description: 'Colesterol total, HDL, LDL y triglicéridos.',
  },
];

function extractExamsFromResponse(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.examenes)) return res.examenes;
  if (res.examen) return [res.examen];
  return [res];
}

function groupExamsByType(examenes) {
  const map = {};
  (examenes || []).forEach((ex) => {
    const m = mapExamForDisplay(ex);
    const key = m.tipo || 'Otros';
    if (!map[key]) map[key] = [];
    map[key].push(ex);
  });
  return map;
}

export function LaboratoriosPage() {
  const { paciente } = useAuth();
  const [selected, setSelected] = useState(() => new Set());
  const [submitting, setSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState('');
  const [justRequested, setJustRequested] = useState([]);

  const fetchHistory = useCallback(
    () => getFullHistory(paciente.id),
    [paciente?.id]
  );
  const { data, loading, error, execute } = useApi(fetchHistory);

  useEffect(() => {
    if (paciente?.id) execute();
  }, [paciente?.id, execute]);

  const allExams = useMemo(() => {
    const fromHistory = data?.examenes || [];
    const merged = [...justRequested, ...fromHistory];
    const seen = new Set();
    return merged.filter((e) => {
      const id = e?.id ?? `${e?.tipo}-${e?.fecha}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [data?.examenes, justRequested]);

  const grouped = useMemo(() => groupExamsByType(allExams), [allExams]);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleRequest() {
    if (!paciente?.id || selected.size === 0) return;
    setInlineError('');
    setSubmitting(true);
    try {
      const body = {
        pacienteId: paciente.id,
        examenes: [...selected],
      };
      const res = await requestExams(body);
      const list = extractExamsFromResponse(res);
      setJustRequested((prev) => [...list, ...prev]);
      setSelected(new Set());
      execute();
    } catch (e) {
      const msg =
        e.response?.data?.mensaje ||
        (e.message === 'Network Error' || e.code === 'ERR_NETWORK'
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
          : e.message);
      setInlineError(msg || 'No se pudo solicitar los exámenes.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <h1 style={{ fontFamily: 'Fraunces, serif', marginBottom: 24 }}>
        Solicitar Exámenes
      </h1>

      {error ? <div className="errorBanner">{error}</div> : null}
      {inlineError ? <div className="errorBanner">{inlineError}</div> : null}

      <div className="specGrid" style={{ marginBottom: 28 }}>
        {EXAM_TYPES.map((t) => {
          const isOn = selected.has(t.id);
          return (
            <label
              key={t.id}
              className="card"
              style={{
                padding: 20,
                cursor: 'pointer',
                border: isOn ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isOn ? 'var(--primary-light)' : 'var(--surface)',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => toggle(t.id)}
                  style={{ marginTop: 4, width: 18, height: 18 }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{t.title}</div>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>
                    {t.description}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {justRequested.length > 0 ? (
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, marginBottom: 16 }}>
            Resultados de la última solicitud
          </h2>
          {justRequested.map((ex, i) => (
            <ResultadoCard key={ex?.id || `new-${i}`} examen={ex} />
          ))}
        </section>
      ) : null}

      <button
        type="button"
        className="btn btnPrimary"
        disabled={selected.size === 0 || submitting}
        onClick={handleRequest}
        style={{ marginBottom: 40 }}
      >
        {submitting ? (
          <>
            <span className="spinner" aria-hidden />
            Solicitando…
          </>
        ) : (
          'Solicitar seleccionados'
        )}
      </button>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, marginBottom: 16 }}>
        Historial de exámenes
      </h2>

      {loading && !data ? (
        <div className="skeleton" style={{ height: 160 }} />
      ) : Object.keys(grouped).length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Aún no hay exámenes registrados.</p>
      ) : (
        Object.entries(grouped).map(([tipo, items]) => (
          <section key={tipo} style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontSize: 16,
                marginBottom: 12,
                color: 'var(--primary)',
                fontFamily: 'Fraunces, serif',
              }}
            >
              {tipo}
            </h3>
            {items.map((ex, i) => (
              <ResultadoCard key={ex?.id || `${tipo}-${i}`} examen={ex} />
            ))}
          </section>
        ))
      )}
    </PageWrapper>
  );
}
