import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDisplayDate(date: Date): string {
  if (!isValid(date)) return '';
  return format(date, 'dd/MM/yyyy');
}

export function formatInputDate(date: Date): string {
  if (!isValid(date)) return '';
  return format(date, 'yyyy-MM-dd');
}

export function formatFullDate(date: Date): string {
  if (!isValid(date)) return '';
  return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatTimestamp(date: Date): string {
  if (!isValid(date)) return '';
  return format(date, "d 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es });
}

export function parseInputDate(dateString: string): Date {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date;
}