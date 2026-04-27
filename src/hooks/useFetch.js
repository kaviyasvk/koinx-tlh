import { useState, useEffect } from 'react';
 
export function useFetch(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
 
    fetchFn()
      .then(result => { if (!cancelled) { setData(result); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message || 'Failed to load'); setLoading(false); } });
 
    return () => { cancelled = true; };
  }, []);
 
  return { data, loading, error };
}
 