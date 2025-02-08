import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { User, UserInput } from '../types/user';
import { ACCESS_CONFIG } from '../constants/firebase';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios
  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = Object.entries(snapshot.val())
          .filter(([_, data]: [string, any]) => data.role === 'producer')
          .map(([id, data]: [string, any]) => ({
            id,
            email: data.email,
            name: data.name,
            role: 'producer' as const,
            salaryCost: data.salaryCost
          }));
        setUsers(usersData);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Crear usuario
  const createUser = async (userData: UserInput) => {
    setError(null);
    try {
      // Verificar si el email ya existe
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const existingUsers = Object.values(snapshot.val()) as any[];
        if (existingUsers.some(user => user.email === userData.email)) {
          throw new Error('Este correo electrónico ya está registrado');
        }
      }

      // Generar un ID único para el usuario
      const newUserRef = ref(database, `users/${crypto.randomUUID()}`);
      
      // Guardar datos del usuario
      await set(newUserRef, {
        email: userData.email,
        name: userData.name,
        role: 'producer',
        salaryCost: userData.salaryCost
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear el usuario';
      setError(message);
      throw new Error(message);
    }
  };

  // Actualizar usuario
  const updateUser = async (userId: string, userData: UserInput) => {
    setError(null);
    try {
      // Verificar si el nuevo email ya existe (si cambió)
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const currentUser = snapshot.val()[userId];
        if (currentUser.email !== userData.email) {
          const existingUsers = Object.values(snapshot.val()) as any[];
          if (existingUsers.some(user => user.email === userData.email)) {
            throw new Error('Este correo electrónico ya está registrado');
          }
        }
      }

      const userRef = ref(database, `users/${userId}`);
      await set(userRef, {
        email: userData.email,
        name: userData.name,
        role: 'producer',
        salaryCost: userData.salaryCost
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el usuario';
      setError(message);
      throw new Error(message);
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser
  };
}