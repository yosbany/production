import { ref, set, get } from 'firebase/database';
import { database } from './index';
import { ACCESS_CONFIG } from '../../constants/firebase';

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing database...');
    const usersRef = ref(database, ACCESS_CONFIG.PATHS.USERS);
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log('No users found, initializing with default users...');
      await set(usersRef, {
        "H7SO8td5D4Z23Kwqin7iNnynVEA3": {
          role: "admin",
          name: "Administrador",
          email: "nriodor@gmail.com",
          active: true
        },
        "afN5mMRjmsZtZp9WFwcOVH6FogC3": {
          role: "producer",
          name: "Panadería",
          email: "pana@gmail.com",
          active: true,
          salaryCost: 3000
        },
        "ZEOGDYJyVHMtRsJYhppH7U7BjVO2": {
          role: "producer",
          name: "Confitería - Rostisería",
          email: "confi.roti@gmail.com",
          active: true,
          salaryCost: 2800
        },
        "EfovFrnTriPbndBVgD8OIzVAT622": {
          role: "producer",
          name: "Sandwichería",
          email: "sandwicheria@gmail.com",
          active: true,
          salaryCost: 2700
        }
      });
      console.log('Database initialized with default users');
    } else {
      console.log('Database already initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}