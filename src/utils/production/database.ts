import { ref, set, get } from 'firebase/database';
import { database } from '../../lib/firebase';
import { Production } from '../../types/production';
import { getDateString } from '../dateUtils';

export async function saveProductionData(
  date: Date, 
  userId: string, 
  productions: Record<string, Production>
): Promise<Record<string, Production>> {
  const dateString = getDateString(date);
  const productionRef = ref(database, `productions/${dateString}/${userId}`);

  // Asegurarse de que solo guardamos productos con cantidad o seleccionados
  const filteredProductions = Object.entries(productions).reduce((acc, [id, prod]) => {
    if (prod.quantity > 0 || prod.selected) {
      acc[id] = {
        quantity: prod.quantity || 0,
        completed: Boolean(prod.completed),
        selected: Boolean(prod.selected)
      };
    }
    return acc;
  }, {} as Record<string, Production>);

  // Siempre guardar, incluso si está vacío
  await set(productionRef, filteredProductions);
  return filteredProductions;
}