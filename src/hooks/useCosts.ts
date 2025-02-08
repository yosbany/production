import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { ACCESS_CONFIG } from '../constants/firebase';

export function useCosts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(ref(database, ACCESS_CONFIG.PATHS.PRODUCTS), () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    loading,
    error
  };
}