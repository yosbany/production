export interface Product {
  id: string;
  name: string;
  salePrice: number;
  producerId: string;
  procedure?: string;
  desiredQuantity?: number;
}

export interface ProductInput extends Omit<Product, 'id'> {
  name: string;
  salePrice: number;
  producerId: string;
  procedure?: string;
  desiredQuantity?: number;
}