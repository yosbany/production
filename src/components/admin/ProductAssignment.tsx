import React, { useState } from 'react';
import { Producer } from '../../types/producer';
import { Product } from '../../types/product';

interface ProductAssignmentProps {
  products: Product[];
  producers: Producer[];
  onAssign: (productId: string, producerId: string) => Promise<void>;
  loading?: boolean;
}

export function ProductAssignment({ products, producers, onAssign, loading }: ProductAssignmentProps) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProducer, setSelectedProducer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && selectedProducer) {
      await onAssign(selectedProduct, selectedProducer);
      setSelectedProduct('');
      setSelectedProducer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">
          Producto
        </label>
        <select
          id="product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccionar Producto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="producer" className="block text-sm font-medium text-gray-700">
          Productor
        </label>
        <select
          id="producer"
          value={selectedProducer}
          onChange={(e) => setSelectedProducer(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccionar Productor</option>
          {producers.map((producer) => (
            <option key={producer.id} value={producer.id}>
              {producer.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !selectedProduct || !selectedProducer}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Asignando...' : 'Asignar Producto'}
      </button>
    </form>
  );
}