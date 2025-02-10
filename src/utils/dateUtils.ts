import { format, isValid, startOfDay } from 'date-fns';
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
  return startOfDay(date);
}

export function getDateString(date: Date): string {
  // Convertir la fecha a UTC y obtener solo la parte de la fecha
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}