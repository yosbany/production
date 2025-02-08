import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database, validateDatabaseAccess } from '../lib/firebase';

export function useDatabase() {
  const { user, logout } = useAuth();

  useEffect(() => {
    try {
      if (user) {
        validateDatabaseAccess(user);
      }
    } catch (error) {
      console.error('Database access error:', error);
      logout();
    }
  }, [user, logout]);

  return {
    database,
    isAuthorized: user ? validateDatabaseAccess(user) : false
  };
}