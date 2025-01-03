import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatProductionTitle(producerName: string, date: Date): string {
  return `${producerName} - ${format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
}