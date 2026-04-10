import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ProximaCitaCard } from '../components/Dashboard/ProximaCitaCard';
import { ResultadoResumenCard } from '../components/Dashboard/ResultadoResumenCard';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { getFullHistory } from '../services/historiaService';
import { formatFecha } from '../utils/formatters';
import { getUpcomingAppointments } from '../utils/appointments';
import { getRecentExams } from '../utils/exams';

export function DashboardPage() {
  const { paciente } = useAuth();
  const fetchHistory = useCallback(
    () => getFullHistory(paciente.id),
    [paciente?.id]
  );
  const { data, loading, error, execute } = useApi(fetchHistory);

  useEffect(() => {
    if (paciente?.id) execute();
  }, [paciente?.id, execute]);

  const citasNext = getUpcomingAppointments(data?.citas || [], 3);
  const examsRecent = getRecentExams(data?.examenes || [], 3);

  const greetingName = paciente?.nombre || 'Paciente';
  const todayLabel = formatFecha(new Date().toISOString());

  return (
    <PageWrapper>
      <h1 style={{ fontSize: 28, fontFamily: 'Fraunces, serif', marginBottom: 8 }}>
        Buen día, {greetingName}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>{todayLabel}</p>

      {error ? <div className="errorBanner" role="alert">{error}</div> : null}

      {loading && !data ? (
        <div className="grid2">
          <div className="skeleton" style={{ height: 220 }} />
          <div className="skeleton" style={{ height: 220 }} />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            <Link to="/citas" className="btn btnPrimary" style={{ textDecoration: 'none' }}>
              Agendar cita
            </Link>
            <Link to="/laboratorios" className="btn btnGhost" style={{ textDecoration: 'none' }}>
              Solicitar exámenes
            </Link>
          </div>
          <div className="grid2">
            <ProximaCitaCard citas={citasNext} />
            <ResultadoResumenCard examenes={examsRecent} />
          </div>
        </>
      )}
    </PageWrapper>
  );
}
