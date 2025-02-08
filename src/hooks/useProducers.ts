import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Producer } from '../types/producer';
import { ACCESS_CONFIG } from '../constants/firebase';

export function useProducers() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersRef = ref(database, ACCESS_CONFIG.PATHS.USERS);
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const producersData = Object.entries(snapshot.val())
            .filter(([_, data]: [string, any]) => data.role === 'producer')
            .map(([id, data]: [string, any]) => ({
              id,
              name: data.name,
              role: 'producer' as const,
              salaryCost: data.salaryCost || 0
            }));
          setProducers(producersData);
        } else {
          setProducers([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productores');
        console.error('Error loading producers:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { producers, loading, error };
}