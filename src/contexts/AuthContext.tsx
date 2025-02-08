import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { auth, database } from '../lib/firebase';
import { ACCESS_CONFIG } from '../constants/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  producerId: string | null;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [producerId, setProducerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(true);
      
      if (user) {
        try {
          // Check if admin
          if (user.email === ACCESS_CONFIG.ADMIN_EMAIL) {
            setUserRole('admin');
            setProducerId(null);
            navigate('/admin');
          } else {
            // Look for producer with matching email
            const usersRef = ref(database, ACCESS_CONFIG.PATHS.USERS);
            const snapshot = await get(usersRef);
            
            if (snapshot.exists()) {
              const users = snapshot.val();
              const producer = Object.entries(users).find(
                ([_, data]: [string, any]) => data.email === user.email && data.role === 'producer'
              );

              if (producer) {
                const [id, data] = producer;
                setUserRole('producer');
                setProducerId(id);
                navigate('/dashboard');
              } else {
                throw new Error('Usuario no autorizado');
              }
            } else {
              throw new Error('Error al cargar datos de usuario');
            }
          }
          setError(null);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error de autenticación';
          console.error('Error setting up user:', message);
          setError(message);
          setUserRole(null);
          setProducerId(null);
          await signOut(auth);
          navigate('/login');
        }
      } else {
        setUserRole(null);
        setProducerId(null);
        setError(null);
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      setProducerId(null);
      setError(null);
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      console.error('Error during logout:', message);
      setError(message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userRole, 
      producerId,
      error, 
      logout 
    }}>
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 border-b border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}