export interface Producer {
  id: string;
  name: string;
  role: 'producer';
  salaryCost: number; // Costo de salario por día
}

export interface ProducerProduction {
  producerId: string;
  producerName: string;
  date: string;
  products: {
    [productId: string]: {
      quantity: number;
      completed: boolean;
    }
  };
  salaryCost: number;
}