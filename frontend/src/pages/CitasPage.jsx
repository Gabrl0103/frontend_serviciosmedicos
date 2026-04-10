import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { SelectorEspecialidad } from '../components/Citas/SelectorEspecialidad';
import { SelectorMedico } from '../components/Citas/SelectorMedico';
import { SelectorHorario } from '../components/Citas/SelectorHorario';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { getMedicos, scheduleAppointment } from '../services/citasService';
import { getSlotsForDoctor } from '../utils/slots';

export function CitasPage() {
  const { paciente } = useAuth();
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadMedicos = useCallback(() => getMedicos(), []);
  const { data: allDoctors, loading, error, execute } = useApi(loadMedicos);

  useEffect(() => {
    execute();
  }, [execute]);

  const specialties = useMemo(() => {
    const list = Array.isArray(allDoctors) ? allDoctors : [];
    const set = new Set();
    list.forEach((m) => {
      if (m?.especialidad) set.add(String(m.especialidad).trim());
    });
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [allDoctors]);

  const filteredDoctors = useMemo(() => {
    if (!specialty) return [];
    const list = Array.isArray(allDoctors) ? allDoctors : [];
    return list.filter(
      (m) => String(m.especialidad || '').toLowerCase() === specialty.toLowerCase()
    );
  }, [allDoctors, specialty]);

  const slots = useMemo(
    () => (selectedDoctor ? getSlotsForDoctor(selectedDoctor) : []),
    [selectedDoctor]
  );

  async function handleConfirm() {
    if (!selectedSlot || !specialty || !paciente?.id) return;
    setActionError('');
    setConfirming(true);
    try {
      await scheduleAppointment({
        pacienteId: paciente.id,
        especialidad: specialty,
        fecha: selectedSlot,
        medicoId: selectedDoctor?.id ?? selectedDoctor?.medicoId,
      });
      setSuccess(true);
    } catch (e) {
      const msg =
        e.response?.data?.mensaje ||
        (e.message === 'Network Error' || e.code === 'ERR_NETWORK'
          ? 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
          : e.message);
      setActionError(msg || 'No se pudo agendar la cita.');
    } finally {
      setConfirming(false);
    }
  }

  function resetFlow() {
    setStep(1);
    setSpecialty('');
    setSelectedDoctor(null);
    setSelectedSlot('');
    setSuccess(false);
    setActionError('');
  }

  return (
    <PageWrapper>
      <h1 style={{ fontFamily: 'Fraunces, serif', marginBottom: 24 }}>Agendar Cita</h1>

      {error ? <div className="errorBanner">{error}</div> : null}
      {actionError ? <div className="errorBanner">{actionError}</div> : null}

      {success ? (
        <div className="successToast">
          <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Cita agendada correctamente</p>
          <Link to="/dashboard" className="btn btnPrimary" style={{ textDecoration: 'none' }}>
            Volver al dashboard
          </Link>
        </div>
      ) : (
        <>
          <div className="stepper" aria-label="Pasos">
            <div className={`stepperStep ${step === 1 ? 'active' : ''}`}>
              <span className="stepperDot">1</span>
              Especialidad
            </div>
            <div className="stepperLine" aria-hidden />
            <div className={`stepperStep ${step === 2 ? 'active' : ''}`}>
              <span className="stepperDot">2</span>
              Médico
            </div>
            <div className="stepperLine" aria-hidden />
            <div className={`stepperStep ${step === 3 ? 'active' : ''}`}>
              <span className="stepperDot">3</span>
              Horario
            </div>
          </div>

          {loading && !allDoctors ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : null}

          {step === 1 && !loading ? (
            specialties.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>
                No hay especialidades disponibles. Verifica que el backend devuelva médicos con
                especialidad.
              </p>
            ) : (
              <SelectorEspecialidad
                specialties={specialties}
                selected={specialty}
                onSelect={(s) => {
                  setSpecialty(s);
                  setStep(2);
                }}
              />
            )
          ) : null}

          {step === 2 ? (
            filteredDoctors.length === 0 ? (
              <div>
                <button type="button" className="btn btnGhost" style={{ marginBottom: 16 }} onClick={() => setStep(1)}>
                  Volver
                </button>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No hay médicos para esta especialidad.
                </p>
              </div>
            ) : (
              <SelectorMedico
                medicos={filteredDoctors}
                selectedId={selectedDoctor?.id ?? selectedDoctor?.medicoId}
                onSelect={(m) => {
                  setSelectedDoctor(m);
                  setSelectedSlot('');
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            )
          ) : null}

          {step === 3 && selectedDoctor ? (
            <SelectorHorario
              slots={slots}
              selectedIso={selectedSlot}
              onSelect={setSelectedSlot}
              onBack={() => setStep(2)}
              onConfirm={handleConfirm}
              confirming={confirming}
            />
          ) : null}

          {success ? null : (
            <p style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: 14 }}>
              <button type="button" className="btn btnGhost" onClick={resetFlow}>
                Reiniciar flujo
              </button>
            </p>
          )}
        </>
      )}
    </PageWrapper>
  );
}
