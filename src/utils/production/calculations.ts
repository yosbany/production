import { ProductionListItem } from '../../types/production';
import { ProductDetails } from '../../types/productDetails';
import { validateProductionData } from './validation';

export function calculateProductionTotals(
  products: ProductDetails[],
  productions: Record<string, { quantity: number; completed: boolean }>
) {
  return products.reduce((totals, product) => {
    const prod = productions[product.id];
    if (!prod) return totals;

    const productCost = prod.quantity * product.cost;
    const productSales = prod.quantity * product.salePrice;

    return {
      totalCost: totals.totalCost + productCost,
      totalSales: totals.totalSales + productSales,
      completedCount: totals.completedCount + (prod.completed ? 1 : 0),
      totalItems: totals.totalItems + 1
    };
  }, {
    totalCost: 0,
    totalSales: 0,
    completedCount: 0,
    totalItems: 0
  });
}

export function calculatePerformance(netIncome: number, salaryCost: number): number {
  if (salaryCost === 0) return 0;
  return Math.round(((netIncome - salaryCost) / salaryCost) * 100);
}

export function updateProductionData(
  production: ProductionListItem,
  products: ProductDetails[],
  newProductions: Record<string, { quantity: number; completed: boolean }>
): ProductionListItem {
  // Validate data before processing
  const validationError = validateProductionData(production, products, newProductions);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const totals = calculateProductionTotals(products, newProductions);
    const netIncome = totals.totalSales - totals.totalCost;
    const completionPercentage = totals.totalItems > 0 
      ? Math.round((totals.completedCount / totals.totalItems) * 100) 
      : 0;

    return {
      ...production,
      productions: newProductions,
      totalCost: totals.totalCost,
      totalSales: totals.totalSales,
      netIncome,
      status: completionPercentage === 100 ? 'completed' : 'in-progress',
      completionPercentage,
      performance: calculatePerformance(netIncome, production.salaryCost)
    };
  } catch (error) {
    throw new Error('Error al actualizar los datos de producción: ' + (error as Error).message);
  }
}