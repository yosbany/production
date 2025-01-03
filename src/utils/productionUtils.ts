import { ref, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { ProductionListItem } from '../types/production';
import { calculateProductionCosts } from './calculations';

export async function fetchProductions(date: Date): Promise<ProductionListItem[]> {
  try {
    // Format date as YYYY-MM-DD for database key
    const dateString = date.toISOString().split('T')[0];
    
    // Get both productions and products data
    const [productionsSnapshot, productsSnapshot] = await Promise.all([
      get(ref(database, 'productions')),
      get(ref(database, 'products'))
    ]);

    // If no products exist, return empty array
    if (!productsSnapshot.exists()) {
      return [];
    }

    const products = productsSnapshot.val();
    const allProductions = productionsSnapshot.val() || {};

    // Get productions for the specific date
    const dateProductions = allProductions[dateString] || {};

    // Calculate costs and return the list
    return await calculateProductionCosts({ [dateString]: dateProductions }, products);
  } catch (error) {
    console.error('Error fetching productions:', error);
    throw new Error('No se pudieron cargar las producciones. Por favor, intente nuevamente.');
  }
}