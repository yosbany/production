import { useMemo } from 'react';
import { Production } from '../types/production';

export function useCompletionPercentage(productions: Record<string, Production>) {
  return useMemo(() => {
    const productionEntries = Object.values(productions);
    if (productionEntries.length === 0) return 0;

    const completedCount = productionEntries.filter(p => p.completed).length;
    return Math.round((completedCount / productionEntries.length) * 100);
  }, [productions]);
}