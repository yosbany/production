import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { Producer } from '../types/producer';

export function useProductAssignments() {
  const [assignments, setAssignments] = useState<Record<string, Producer[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignmentsRef = ref(database, 'productAssignments');
    const usersRef = ref(database, 'users');
    
    const unsubscribe = onValue(assignmentsRef, async (assignmentsSnapshot) => {
      const usersSnapshot = await onValue(usersRef, (usersSnapshot) => {
        const assignments = assignmentsSnapshot.val() || {};
        const users = usersSnapshot.val() || {};
        
        const productAssignments: Record<string, Producer[]> = {};
        
        // Process assignments and match with users
        Object.entries(assignments).forEach(([productId, productAssignments]: [string, any]) => {
          const assignedProducers = Object.keys(productAssignments)
            .map(userId => {
              const user = users[userId];
              if (user && user.role === 'producer') {
                return {
                  id: userId,
                  name: user.name,
                  role: user.role as 'producer'
                };
              }
              return null;
            })
            .filter((producer): producer is Producer => producer !== null);

          if (assignedProducers.length > 0) {
            productAssignments[productId] = assignedProducers;
          }
        });
        
        setAssignments(productAssignments);
        setLoading(false);
      });

      return () => {
        usersSnapshot();
      };
    });

    return () => unsubscribe();
  }, []);

  return { assignments, loading };
}