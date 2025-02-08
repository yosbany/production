import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './config';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export auth and database instances
export const auth = getAuth(app);
export const database = getDatabase(app);

// Function to validate database access
export function validateDatabaseAccess(user: { uid: string } | null): boolean {
  if (!user) {
    throw new Error('Database access requires authentication');
  }
  return true;
}