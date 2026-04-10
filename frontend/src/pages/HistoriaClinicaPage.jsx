import React, { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { TabConsultas } from '../components/HistoriaClinica/TabConsultas';
import { TabPrescripciones } from '../components/HistoriaClinica/TabPrescripciones';
import { TabLaboratorios } from '../components/HistoriaClinica/TabLaboratorios';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { getFullHistory } from '../services/historiaService';

const TABS = [
  { id: 'consultas', label: 'Consultas' },
  { id: 'prescripciones', label: 'Prescripciones' },
  { id: 'laboratorios', label: 'Laboratorios' },
];

export function HistoriaClinicaPage() {
  const { paciente } = useAuth();
  const [active, setActive] = useState('consultas');
  const fetchHistory = useCallback(
    () => getFullHistory(paciente.id),
    [paciente?.id]
  );
  const { data, loading, error, execute } = useApi(fetchHistory);

  useEffect(() => {
    if (paciente?.id) execute();
  }, [paciente?.id, execute]);

  const consultas = data?.consultas || [];
  const prescripciones = data?.prescripciones || [];
  const examenes = data?.examenes || [];

  return (
    <PageWrapper>
      <h1 style={{ fontFamily: 'Fraunces, serif', marginBottom: 24 }}>
        Mi Historia Clínica
      </h1>

      {error ? <div className="errorBanner">{error}</div> : null}

      {loading && !data ? (
        <div>
          <div className="skeleton" style={{ height: 44, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 120, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 120, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 120 }} />
        </div>
      ) : (
        <>
          <div className="tabs" role="tablist">
            {TABS.map((t) => {
              const count =
                t.id === 'consultas'
                  ? consultas.length
                  : t.id === 'prescripciones'
                    ? prescripciones.length
                    : examenes.length;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active === t.id}
                  className={`tab ${active === t.id ? 'tabActive' : ''}`}
                  onClick={() => setActive(t.id)}
                >
                  {t.label}
                  <span className="tabBadge">{count}</span>
                </button>
              );
            })}
          </div>
          {active === 'consultas' ? <TabConsultas consultas={consultas} /> : null}
          {active === 'prescripciones' ? (
            <TabPrescripciones prescripciones={prescripciones} />
          ) : null}
          {active === 'laboratorios' ? <TabLaboratorios examenes={examenes} /> : null}
        </>
      )}
    </PageWrapper>
  );
}
