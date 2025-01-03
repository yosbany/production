export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU'
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  try {
    // If it's already a string in YYYY-MM-DD format, parse it directly
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      
      return new Intl.DateTimeFormat('es-UY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(year, month - 1, day));
    }

    // For other cases, create a date object
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    // Format using the date components directly to avoid timezone issues
    return new Intl.DateTimeFormat('es-UY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha no disponible';
  }
}