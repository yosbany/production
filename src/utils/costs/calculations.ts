import { ref, get } from 'firebase/database';
import { database } from '../../lib/firebase';
import { Cost } from '../../types/costs';

export async function calculateTotalCost(costs: Cost[]): Promise<number> {
  return costs.reduce((total, cost) => {
    return total + (cost.pricePerUnit * (cost.quantity || 0));
  }, 0);
}

export async function getProductsUsingCost(costId: string): Promise<string[]> {
  try {
    const productCostsRef = ref(database, 'productCosts');
    const snapshot = await get(productCostsRef);
    
    if (!snapshot.exists()) return [];
    
    const productCosts = snapshot.val();
    return Object.entries(productCosts)
      .filter(([_, costs]: [string, any]) => 
        costs.some((cost: any) => cost.costId === costId)
      )
      .map(([productId]) => productId);
  } catch (error) {
    console.error('Error getting products using cost:', error);
    return [];
  }
}

export async function recalculateProductCosts(
  productId: string, 
  costs: Cost[]
): Promise<number> {
  try {
    const productCostsRef = ref(database, `productCosts/${productId}`);
    const snapshot = await get(productCostsRef);
    
    if (!snapshot.exists()) return 0;
    
    const productCosts = snapshot.val();
    return productCosts.reduce((total: number, pc: any) => {
      const cost = costs.find(c => c.id === pc.costId);
      return total + (cost ? cost.pricePerUnit * pc.quantity : 0);
    }, 0);
  } catch (error) {
    console.error('Error recalculating product costs:', error);
    throw new Error('Error al recalcular los costos del producto');
  }
}