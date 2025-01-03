import React, { useState } from 'react';
import { Product } from '../../types/product';
import { FormInput } from '../ui/FormInput';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  loading?: boolean;
}

export function ProductForm({ onSubmit, loading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    unitsPerRecipe: 0,
    fixedCost: 0,
    salePrice: 0,
    desiredQuantity: 0,
    producerId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', unitsPerRecipe: 0, fixedCost: 0, salePrice: 0, desiredQuantity: 0, producerId: '' });
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
        label="Unidades por Receta"
        type="number"
        value={formData.unitsPerRecipe}
        onChange={(e) => setFormData(prev => ({ ...prev, unitsPerRecipe: Number(e.target.value) }))}
        required
        min="1"
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
        label="Costo Fijo (UYU)"
        type="number"
        value={formData.fixedCost}
        onChange={(e) => setFormData(prev => ({ ...prev, fixedCost: Number(e.target.value) }))}
        required
        min="0"
        step="0.01"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Crear Producto'}
      </button>
    </form>
  );
}