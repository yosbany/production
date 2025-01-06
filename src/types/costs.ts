export interface Cost {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  quantity?: number;
}

export interface ProductCost {
  costId: string;
  quantity: number;
}

export interface CostFormData {
  name: string;
  unit: string;
  pricePerUnit: number;
}