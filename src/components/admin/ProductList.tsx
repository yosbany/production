import React, { useState } from 'react';
import { Product } from '../../types/product';
import { Producer } from '../../types/producer';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { Pencil, Trash2 } from 'lucide-react';
import { CostManagementModal } from '../costs/CostManagementModal';

interface ProductListProps {
  products: Product[];
  producers: Producer[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductList({ 
  products, 
  producers,
  onEdit, 
  onDelete
}: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getProducerName = (producerId: string) => {
    return producers.find(p => p.id === producerId)?.name || 'Sin asignar';
  };

  const calculateGrossMargin = (salePrice: number, cost: number): number => {
    if (salePrice === 0) return 0;
    return ((salePrice - cost) / salePrice) * 100;
  };

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Venta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margen Bruto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const grossMargin = calculateGrossMargin(product.salePrice, product.fixedCost);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      {formatCurrency(product.fixedCost)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(product.salePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${grossMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(grossMargin)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getProducerName(product.producerId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <CostManagementModal
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          salePrice={selectedProduct.salePrice}
        />
      )}
    </>
  );
}