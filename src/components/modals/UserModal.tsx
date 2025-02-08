import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User, UserInput } from '../../types/user';
import { FormInput } from '../ui/FormInput';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserInput) => Promise<void>;
  initialData?: User | null;
}

export function UserModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}: UserModalProps) {
  const [formData, setFormData] = useState<UserInput>({
    email: '',
    name: '',
    salaryCost: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
        salaryCost: initialData.salaryCost || 0
      });
    } else {
      setFormData({
        email: '',
        name: '',
        salaryCost: 0
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">
              {initialData ? 'Editar Productor' : 'Nuevo Productor'}
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
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <FormInput
              label="Salario por Día"
              type="number"
              value={formData.salaryCost}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                salaryCost: Number(e.target.value)
              }))}
              required
              min="0"
              helperText="Ingrese el salario diario del productor"
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
                {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}