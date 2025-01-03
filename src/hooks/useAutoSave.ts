import { useRef, useCallback } from 'react';

interface AutoSaveConfig {
  onSave: (value: number) => void;
  delay?: number;
}

export function useAutoSave({ onSave, delay = 30000 }: AutoSaveConfig) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const clearAutoSaveTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const setupAutoSave = useCallback((value: number) => {
    clearAutoSaveTimeout();
    timeoutRef.current = setTimeout(() => {
      onSave(value);
    }, delay);
  }, [onSave, delay]);

  return {
    setupAutoSave,
    clearAutoSaveTimeout
  };
}