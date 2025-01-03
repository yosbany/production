export interface Product {
  id: string;
  name: string;
  unitsPerRecipe: number;
  fixedCost: number;
  salePrice: number;
}

export interface Production {
  id: string;
  date: string;
  producerId: string;
  products: {
    [productId: string]: {
      quantity: number;
      completed: boolean;
    }
  }
}

export interface User {
  id: string;
  email: string;
  role: 'producer' | 'admin';
}