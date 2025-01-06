import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Cost, CostFormData } from '../../types/costs';
import { FormInput } from '../ui/FormInput';

interface CostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CostFormData) => Promise<void>;
  initialData?: Cost | null;
}

export function CostModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: CostModalProps) {
  const [formData, setFormData] = useState<CostFormData>({
    name: '',
    unit: '',
    pricePerUnit: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        unit: initialData.unit,
        pricePerUnit: initialData.pricePerUnit
      });
    } else {
      setFormData({
        name: '',
        unit: '',
        pricePerUnit: 0
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar el costo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {initialData ? 'Editar Costo' : 'Nuevo Costo'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <FormInput
              label="Nombre del Costo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <FormInput
              label="Unidad de Medida"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              required
            />

            <FormInput
              label="Precio por Unidad"
              type="number"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: Number(e.target.value) }))}
              min="0.01"
              step="0.01"
              required
            />

            <div className="flex justify-end space-x-3 pt-4">
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
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}