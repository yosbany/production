import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Cost } from '../../types/costs';
import { FormInput } from '../ui/FormInput';
import { formatCurrency } from '../../utils/format';

interface ProductCostSelectorProps {
  costs: Cost[];
  onSelectCost: (costId: string, quantity: number) => void;
  onCancel: () => void;
}

export function ProductCostSelector({ costs, onSelectCost, onCancel }: ProductCostSelectorProps) {
  const [selectedCostId, setSelectedCostId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCostId) {
      setError('Seleccione un costo');
      return;
    }

    if (quantity <= 0) {
      setError('La cantidad debe ser mayor que 0');
      return;
    }

    onSelectCost(selectedCostId, quantity);
  };

  const selectedCost = costs.find(c => c.id === selectedCostId);
  const total = selectedCost ? selectedCost.pricePerUnit * quantity : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border">
      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Costo"
          type="select"
          value={selectedCostId}
          onChange={(e) => setSelectedCostId(e.target.value)}
          required
          options={[
            { value: '', label: 'Seleccionar costo' },
            ...costs.map(cost => ({
              value: cost.id,
              label: `${cost.name} (${formatCurrency(cost.pricePerUnit)}/${cost.unit})`
            }))
          ]}
        />

        <FormInput
          label="Cantidad"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="0.01"
          step="0.01"
          required
          disabled={!selectedCostId}
        />
      </div>

      {selectedCost && (
        <div className="bg-gray-50 p-3 rounded flex justify-between items-center">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!selectedCostId || quantity <= 0}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </button>
      </div>
    </form>
  );
}