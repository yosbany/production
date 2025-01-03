import React from 'react';
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

const defaultFormData: Omit<Product, 'id'> = {
  name: '',
  unitsPerRecipe: 0,
  fixedCost: 0,
  salePrice: 0,
  producerId: ''
};

export function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  loading,
  producers
}: ProductModalProps) {
  const [formData, setFormData] = React.useState<Omit<Product, 'id'>>(defaultFormData);

  React.useEffect(() => {
    // Reset form when modal opens/closes
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          unitsPerRecipe: initialData.unitsPerRecipe,
          fixedCost: initialData.fixedCost,
          salePrice: initialData.salePrice,
          producerId: initialData.producerId
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">
              {initialData ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
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