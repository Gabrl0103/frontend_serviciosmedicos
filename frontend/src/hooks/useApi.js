import { useState, useCallback } from 'react';

const NETWORK_MSG =
  'No se pudo conectar con el servidor. Verifica que el backend esté activo.';

function getErrorMessage(error) {
  if (!error) return NETWORK_MSG;
  if (error.response?.data?.mensaje) return error.response.data.mensaje;
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return NETWORK_MSG;
  }
  return error.message || NETWORK_MSG;
}

/**
 * Hook reutilizable para llamadas async (loading / error / data).
 */
export function useApi(fn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        const payload = result?.data !== undefined ? result.data : result;
        setData(payload);
        return payload;
      } catch (e) {
        const msg = getErrorMessage(e);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { data, loading, error, execute };
}
