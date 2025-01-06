import React, { useState } from 'react';
import { CostFormData } from '../../types/costs';
import { FormInput } from '../ui/FormInput';

interface CostFormProps {
  onSubmit: (data: CostFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CostFormData>;
}

export function CostForm({ onSubmit, onCancel, initialData }: CostFormProps) {
  const [formData, setFormData] = useState<CostFormData>({
    name: initialData?.name || '',
    unit: initialData?.unit || '',
    pricePerUnit: initialData?.pricePerUnit || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nombre del Costo"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
        placeholder="Ej: Harina, Azúcar, etc."
      />

      <FormInput
        label="Unidad de Medida"
        value={formData.unit}
        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
        required
        placeholder="Ej: kg, litros, unidades"
      />

      <FormInput
        label="Precio por Unidad"
        type="number"
        value={formData.pricePerUnit}
        onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: Number(e.target.value) }))}
        required
        min="0"
        step="0.01"
        placeholder="0.00"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}