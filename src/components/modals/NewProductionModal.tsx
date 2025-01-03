import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Producer } from '../../types/producer';
import { Product } from '../../types/product';
import DateSelector from '../DateSelector';
import { FormInput } from '../ui/FormInput';
import { ProductCard } from '../ProductCard';

interface NewProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    producerId: string;
    date: Date;
    productions: Record<string, { quantity: number; completed: boolean }>;
  }) => Promise<void>;
  producers: Producer[];
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

export function NewProductionModal({
  isOpen,
  onClose,
  onSubmit,
  producers,
  products,
  loading,
  error
}: NewProductionModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProducer, setSelectedProducer] = useState('');
  const [productions, setProductions] = useState<Record<string, { quantity: number; completed: boolean }>>({});

  useEffect(() => {
    if (selectedProducer) {
      // Initialize productions with desired quantities
      const initialProductions = products
        .filter(p => p.producerId === selectedProducer)
        .reduce((acc, product) => ({
          ...acc,
          [product.id]: {
            quantity: product.desiredQuantity || 0,
            completed: false
          }
        }), {});
      setProductions(initialProductions);
    }
  }, [selectedProducer, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProducer) return;

    await onSubmit({
      producerId: selectedProducer,
      date: selectedDate,
      productions
    });
  };

  const handleProductionChange = (productId: string, quantity: number, completed: boolean) => {
    setProductions(prev => ({
      ...prev,
      [productId]: { quantity, completed }
    }));
  };

  if (!isOpen) return null;

  const producerProducts = products.filter(p => p.producerId === selectedProducer);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Nueva Producción
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                label="Fecha de Producción"
              />

              <FormInput
                label="Productor"
                type="select"
                value={selectedProducer}
                onChange={(e) => setSelectedProducer(e.target.value)}
                required
                options={[
                  { value: '', label: 'Seleccionar Productor' },
                  ...producers.map(p => ({
                    value: p.id,
                    label: p.name
                  }))
                ]}
              />
            </div>

            {selectedProducer && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Productos Asignados</h4>
                {producerProducts.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {producerProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        initialQuantity={productions[product.id]?.quantity}
                        initialCompleted={productions[product.id]?.completed}
                        onChange={(quantity, completed) => 
                          handleProductionChange(product.id, quantity, completed)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Este productor no tiene productos asignados
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !selectedProducer || producerProducts.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Producción'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}