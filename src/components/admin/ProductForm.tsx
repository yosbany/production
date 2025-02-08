import React, { useState } from 'react';
import { Product } from '../../types/product';
import { FormInput } from '../ui/FormInput';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  loading?: boolean;
  initialData?: Product;
}

export function ProductForm({ onSubmit, loading, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: initialData?.name || '',
    salePrice: initialData?.salePrice || 0,
    producerId: initialData?.producerId || '',
    procedure: initialData?.procedure || '',
    desiredQuantity: initialData?.desiredQuantity || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Nombre del Producto"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <FormInput
        label="Cantidad Deseada"
        type="number"
        value={formData.desiredQuantity}
        onChange={(e) => setFormData(prev => ({ ...prev, desiredQuantity: Number(e.target.value) }))}
        required
        min="0"
      />

      <FormInput
        label="Precio de Venta (UYU)"
        type="number"
        value={formData.salePrice}
        onChange={(e) => setFormData(prev => ({ ...prev, salePrice: Number(e.target.value) }))}
        required
        min="0"
        step="0.01"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Procedimiento de Elaboración
        </label>
        <textarea
          value={formData.procedure}
          onChange={(e) => setFormData(prev => ({ ...prev, procedure: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describa el procedimiento de elaboración..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </form>
  );
}