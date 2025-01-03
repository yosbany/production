import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { auth, database } from '../lib/firebase';
import { initializeDatabase } from '../lib/firebase/initData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Initialize database after successful authentication
          await initializeDatabase();
          
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserRole(userData.role);
            
            // Redirect based on role
            if (userData.role === 'admin') {
              navigate('/admin');
            } else if (userData.role === 'producer') {
              navigate('/dashboard');
            } else {
              navigate('/unauthorized');
            }
          } else {
            setUserRole(null);
            navigate('/unauthorized');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
          navigate('/unauthorized');
        }
      } else {
        setUserRole(null);
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-indigo-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, userRole, logout }}>
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