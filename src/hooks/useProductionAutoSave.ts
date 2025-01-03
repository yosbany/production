import { useRef, useCallback } from 'react';

interface AutoSaveConfig {
  onSave: () => void;
  delay?: number;
}

export function useProductionAutoSave({ onSave, delay = 30000 }: AutoSaveConfig) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const clearAutoSaveTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const setupAutoSave = useCallback(() => {
    clearAutoSaveTimeout();
    timeoutRef.current = setTimeout(() => {
      onSave();
    }, delay);
  }, [onSave, delay]);

  return {
    setupAutoSave,
    clearAutoSaveTimeout
  };
}