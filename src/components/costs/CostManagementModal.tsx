import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCosts } from '../../hooks/useCosts';
import { useProductCosts } from '../../hooks/useProductCosts';
import { ProductCostManager } from './ProductCostManager';
import { ProductCostSummary } from './ProductCostSummary';
import { Cost } from '../../types/costs';

interface CostManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  salePrice: number;
  onCostsUpdated?: (totalCost: number) => void;
}

export function CostManagementModal({
  isOpen,
  onClose,
  productId,
  productName,
  salePrice,
  onCostsUpdated
}: CostManagementModalProps) {
  const { costs, loading: costsLoading } = useCosts();
  const { productCosts, updateCosts, error } = useProductCosts(productId);
  const [saving, setSaving] = useState(false);

  const handleCostsChange = async (newCosts: Cost[]) => {
    setSaving(true);
    try {
      await updateCosts(newCosts);
      
      const totalCost = newCosts.reduce((sum, cost) => 
        sum + (cost.pricePerUnit * (cost.quantity || 0)), 0);
      
      onCostsUpdated?.(totalCost);
    } catch (error) {
      console.error('Error updating costs:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Costos del Producto
              </h3>
              <p className="text-sm text-gray-500">{productName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <ProductCostSummary costs={productCosts} salePrice={salePrice} />

            {costsLoading ? (
              <div className="text-center py-4">Cargando costos...</div>
            ) : (
              <ProductCostManager
                costs={costs}
                productCosts={productCosts}
                onCostsChange={handleCostsChange}
                disabled={saving}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}