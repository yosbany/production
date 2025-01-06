import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Cost } from '../../types/costs';
import { ProductCostList } from './ProductCostList';
import { ProductCostSelector } from './ProductCostSelector';

interface ProductCostManagerProps {
  costs: Cost[];
  productCosts: Cost[];
  onCostsChange: (costs: Cost[]) => void;
  disabled?: boolean;
}

export function ProductCostManager({ 
  costs,
  productCosts,
  onCostsChange,
  disabled = false
}: ProductCostManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCost = (costId: string, quantity: number) => {
    try {
      const cost = costs.find(c => c.id === costId);
      if (!cost) return;

      const newCosts = [...productCosts, { ...cost, quantity }];
      onCostsChange(newCosts);
      setIsAdding(false);
      setError(null);
    } catch (error) {
      setError('Error al agregar el costo');
    }
  };

  const handleRemoveCost = (costId: string) => {
    try {
      const newCosts = productCosts.filter(c => c.id !== costId);
      onCostsChange(newCosts);
      setError(null);
    } catch (error) {
      setError('Error al eliminar el costo');
    }
  };

  const handleUpdateQuantity = (costId: string, quantity: number) => {
    try {
      const newCosts = productCosts.map(c => 
        c.id === costId ? { ...c, quantity } : c
      );
      onCostsChange(newCosts);
      setError(null);
    } catch (error) {
      setError('Error al actualizar la cantidad');
    }
  };

  const availableCosts = costs.filter(
    cost => !productCosts.some(pc => pc.id === cost.id)
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Add Cost Button/Form */}
      {isAdding ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <ProductCostSelector
            costs={availableCosts}
            onSelectCost={handleAddCost}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          disabled={availableCosts.length === 0 || disabled}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Costo
        </button>
      )}

      {/* Product Costs List */}
      <ProductCostList 
        costs={productCosts}
        onRemove={handleRemoveCost}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}