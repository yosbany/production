import { ProductDetails } from '../../types/productDetails';
import { ProductionListItem } from '../../types/production';
import { ref, get } from 'firebase/database';
import { database } from '../../lib/firebase';

export async function checkDuplicateProduction(date: string, producerId: string): Promise<boolean> {
  try {
    const productionRef = ref(database, `productions/${date}/${producerId}`);
    const snapshot = await get(productionRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking for duplicate production:', error);
    return false;
  }
}

export function validateProductionData(
  production: ProductionListItem | null,
  products: ProductDetails[],
  newProductions: Record<string, { quantity: number; completed: boolean }>
): string | null {
  // Check if products exist
  if (!products.length) {
    return 'No hay productos disponibles';
  }

  // Validate productions data
  for (const [productId, data] of Object.entries(newProductions)) {
    if (typeof data.quantity !== 'number' || data.quantity < 0) {
      return `Cantidad inválida para el producto ${productId}`;
    }
    if (typeof data.completed !== 'boolean') {
      return `Estado de completado inválido para el producto ${productId}`;
    }
  }

  return null;
}