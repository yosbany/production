export interface Product {
  id: string;
  name: string;
  unitsPerRecipe: number;
  fixedCost: number;
  salePrice: number;
  producerId: string;
  desiredQuantity: number; // New field
}

export interface ProductAssignment {
  productId: string;
  producerId: string;
  assignedAt: string;
}