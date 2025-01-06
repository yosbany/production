import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { formatCurrency } from '../../utils/format';

interface EditableCostRowProps {
  name: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  onSave: (quantity: number, pricePerUnit: number) => Promise<void>;
  onCancel: () => void;
}

export function EditableCostRow({
  name,
  unit,
  quantity,
  pricePerUnit,
  onSave,
  onCancel
}: EditableCostRowProps) {
  const [editedQuantity, setEditedQuantity] = useState(quantity);
  const [editedPrice, setEditedPrice] = useState(pricePerUnit);

  const handleSave = async () => {
    await onSave(editedQuantity, editedPrice);
  };

  const total = editedPrice * editedQuantity;

  return (
    <tr className="bg-indigo-50">
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-900">{name}</span>
        <span className="text-sm text-gray-500 ml-1">({unit})</span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <FormInput
          type="number"
          value={editedQuantity}
          onChange={(e) => setEditedQuantity(Number(e.target.value))}
          min="0.01"
          step="0.01"
          className="w-24 text-right"
        />
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <FormInput
          type="number"
          value={editedPrice}
          onChange={(e) => setEditedPrice(Number(e.target.value))}
          min="0.01"
          step="0.01"
          className="w-32 text-right"
        />
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
        {formatCurrency(total)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-700"
            title="Guardar cambios"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
            title="Cancelar edición"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}