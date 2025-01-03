import { ref, set, get } from 'firebase/database';
import { database } from './index';

const DEFAULT_USERS = {
  "H7SO8td5D4Z23Kwqin7iNnynVEA3": {
    role: "admin",
    name: "Administrador"
  },
  "afN5mMRjmsZtZp9WFwcOVH6FogC3": {
    role: "producer",
    name: "Panadería",
    salaryCost: 3000
  },
  "ZEOGDYJyVHMtRsJYhppH7U7BjVO2": {
    role: "producer",
    name: "Confitería - Rostisería",
    salaryCost: 2800
  },
  "EfovFrnTriPbndBVgD8OIzVAT622": {
    role: "producer",
    name: "Sandwichería",
    salaryCost: 2700
  }
};

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log('No users found, initializing with default data...');
      await set(usersRef, DEFAULT_USERS);
      console.log('Database initialized with default users');
    } else {
      console.log('Users already exist in database');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}