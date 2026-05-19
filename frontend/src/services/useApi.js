import { useCallback, useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  }, []);

  return { request, loading, error };
};
