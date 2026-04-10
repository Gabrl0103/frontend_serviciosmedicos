import { capitalizar } from './formatters';

/**
 * Exámenes más recientes por fecha.
 */
export function getRecentExams(examenes, limit = 3) {
  if (!Array.isArray(examenes)) return [];
  return [...examenes]
    .filter((e) => e?.fecha || e?.fechaResultado)
    .sort(
      (a, b) =>
        new Date(b.fecha || b.fechaResultado) -
        new Date(a.fecha || a.fechaResultado)
    )
    .slice(0, limit);
}

/**
 * Determina si el examen es anormal para resúmenes y badges.
 */
export function isExamAbnormal(exam) {
  const s = String(exam?.estado || '').toLowerCase();
  if (s === 'anormal' || s === 'alterado') return true;
  if (exam?.anormal === true) return true;
  if (exam?.resultadoNormal === false) return true;
  return false;
}

/**
 * Objeto unificado para ResultadoCard / resúmenes.
 */
export function mapExamForDisplay(raw) {
  const fecha = raw?.fecha || raw?.fechaResultado || raw?.createdAt;
  const tipo =
    raw?.tipo ||
    raw?.tipoExamen ||
    raw?.nombre ||
    raw?.codigo ||
    'Examen';
  const abnormal = isExamAbnormal(raw);
  const parametros =
    raw?.parametros ||
    raw?.valores ||
    raw?.resultados ||
    [];
  return {
    tipo: capitalizar(String(tipo).replace(/_/g, ' ')),
    fecha,
    estado: abnormal ? 'anormal' : 'normal',
    parametros: Array.isArray(parametros) ? parametros : [],
    raw,
  };
}
