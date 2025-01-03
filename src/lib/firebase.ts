import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './firebase/config';

let auth;
let database;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error(
    'Failed to initialize Firebase. Please check your configuration.'
  );
}

export { auth, database };