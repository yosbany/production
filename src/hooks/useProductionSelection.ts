import { useState, useCallback, useEffect, useRef } from 'react';
import { useProduction } from './useProduction';

export function useProductionSelection(date: Date) {
  const { productions, saveProduction } = useProduction(date);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const isInitializedRef = useRef(false);
  const lastSavedStateRef = useRef<Record<string, boolean>>({});

  // Initialize selections from existing productions
  useEffect(() => {
    if (!productions || isInitializedRef.current) return;
    
    const initialSelections = new Set(
      Object.entries(productions)
        .filter(([_, data]) => data.selected)
        .map(([id]) => id)
    );

    // Guardar el estado inicial para comparaciones
    lastSavedStateRef.current = Object.entries(productions).reduce((acc, [id, data]) => {
      acc[id] = Boolean(data.selected);
      return acc;
    }, {} as Record<string, boolean>);

    setSelectedProducts(initialSelections);
    isInitializedRef.current = true;
  }, [productions]);

  // Reset initialization flag when date changes
  useEffect(() => {
    isInitializedRef.current = false;
    lastSavedStateRef.current = {};
  }, [date]);

  const toggleProductSelection = useCallback(async (productId: string) => {
    if (!isInitializedRef.current) return;

    const isCurrentlySelected = selectedProducts.has(productId);
    const currentProduction = productions[productId] || {
      quantity: 0,
      completed: false,
      selected: false
    };

    // Verificar si el estado realmente cambió
    if (lastSavedStateRef.current[productId] === !isCurrentlySelected) {
      console.log('Estado ya actualizado en Firebase, ignorando toggle');
      return;
    }

    // Actualizar el estado local primero para UI responsiva
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (isCurrentlySelected) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    try {
      // Preparar la actualización para Firebase
      const updatedProductions = { ...productions };
      
      if (isCurrentlySelected) {
        // Si estamos deseleccionando, resetear a cero
        updatedProductions[productId] = {
          quantity: 0,
          completed: false,
          selected: false
        };
      } else {
        updatedProductions[productId] = {
          ...currentProduction,
          selected: true
        };
      }

      // Actualizar Firebase
      await saveProduction(updatedProductions);

      // Actualizar el estado de referencia
      lastSavedStateRef.current[productId] = !isCurrentlySelected;
    } catch (error) {
      console.error('Error toggling product selection:', error);
      // Revertir el estado local en caso de error
      setSelectedProducts(prev => {
        const next = new Set(prev);
        if (isCurrentlySelected) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    }
  }, [productions, saveProduction, selectedProducts]);

  return {
    selectedProducts,
    toggleProductSelection,
    isSelected: useCallback((productId: string) => selectedProducts.has(productId), [selectedProducts])
  };
}