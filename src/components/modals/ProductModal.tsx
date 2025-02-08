import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types/product';
import { Producer } from '../../types/producer';
import { FormInput } from '../ui/FormInput';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  initialData?: Product;
  loading?: boolean;
  producers: Producer[];
}

export function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  loading,
  producers
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    salePrice: 0,
    producerId: '',
    procedure: '',
    desiredQuantity: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        salePrice: initialData.salePrice,
        producerId: initialData.producerId,
        procedure: initialData.procedure || '',
        desiredQuantity: initialData.desiredQuantity || 0
      });
    } else {
      setFormData({
        name: '',
        salePrice: 0,
        producerId: '',
        procedure: '',
        desiredQuantity: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">
              {initialData ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-4 space-y-4">
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
              label="Precio de Venta"
              type="number"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: Number(e.target.value) }))}
              min="0"
              step="0.01"
              required
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

            <FormInput
              label="Productor Asignado"
              type="select"
              value={formData.producerId}
              onChange={(e) => setFormData(prev => ({ ...prev, producerId: e.target.value }))}
              required
              options={[
                { value: '', label: 'Seleccionar Productor' },
                ...producers.map(p => ({ 
                  value: p.id, 
                  label: p.name 
                }))
              ]}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-2 border-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}