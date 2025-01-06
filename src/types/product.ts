export interface Product {
  id: string;
  name: string;
  fixedCost: number;
  salePrice: number;
  producerId: string;
  procedure?: string;
}