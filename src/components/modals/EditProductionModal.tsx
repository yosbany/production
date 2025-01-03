import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ProductionListItem } from '../../types/production';
import { ProductDetails } from '../../types/productDetails';
import { ProductCard } from '../ProductCard';
import { formatDate } from '../../utils/format';
import { updateProductionData } from '../../utils/production/calculations';

interface EditProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  production: ProductionListItem;
  products: ProductDetails[];
  onSave: (production: ProductionListItem) => Promise<void>;
}

export function EditProductionModal({
  isOpen,
  onClose,
  production,
  products,
  onSave
}: EditProductionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productions, setProductions] = useState<Record<string, { quantity: number; completed: boolean }>>(
    production.productions || {}
  );

  const handleProductionChange = (productId: string, quantity: number, completed: boolean) => {
    setProductions(prev => ({
      ...prev,
      [productId]: { quantity, completed }
    }));
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedProduction = updateProductionData(production, products, productions);
      await onSave(updatedProduction);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar la producción');
      console.error('Error updating production:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Producción
              </h3>
              <p className="text-sm text-gray-500">
                {production.producerName} - {formatDate(production.date)}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  initialQuantity={productions[product.id]?.quantity || 0}
                  initialCompleted={productions[product.id]?.completed || false}
                  onChange={(quantity, completed) => 
                    handleProductionChange(product.id, quantity, completed)
                  }
                />
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}