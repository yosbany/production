import { ref, get } from 'firebase/database';
import { database } from '../../lib/firebase';

export async function canDeleteCost(costId: string): Promise<boolean> {
  try {
    const productCostsRef = ref(database, 'productCosts');
    const snapshot = await get(productCostsRef);
    
    if (!snapshot.exists()) return true;
    
    const productCosts = snapshot.val();
    return !Object.values(productCosts).some((costs: any) => 
      costs.some((cost: any) => cost.costId === costId)
    );
  } catch (error) {
    console.error('Error checking cost usage:', error);
    return false;
  }
}

export function validateCostUpdate(newPrice: number): string | null {
  if (typeof newPrice !== 'number') {
    return 'El precio debe ser un número';
  }
  
  if (isNaN(newPrice)) {
    return 'El precio debe ser un número válido';
  }

  if (newPrice <= 0) {
    return 'El precio debe ser mayor que 0';
  }

  if (newPrice > 1000000) {
    return 'El precio es demasiado alto';
  }
  
  return null;
}

export function validateProductCosts(
  costs: { costId: string; quantity: number }[]
): string | null {
  if (!Array.isArray(costs)) {
    return 'Formato de costos inválido';
  }

  for (const cost of costs) {
    if (!cost.costId) {
      return 'ID de costo inválido';
    }

    if (typeof cost.quantity !== 'number') {
      return 'La cantidad debe ser un número';
    }
    
    if (isNaN(cost.quantity)) {
      return 'La cantidad debe ser un número válido';
    }

    if (cost.quantity <= 0) {
      return 'La cantidad debe ser mayor que 0';
    }

    if (cost.quantity > 10000) {
      return 'La cantidad es demasiado alta';
    }
  }
  
  return null;
}