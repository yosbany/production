import { ref, query, orderByKey, startAt, endAt, get } from 'firebase/database';
import { database } from '../../lib/firebase';
import { getDateString } from '../dateUtils';

interface ProductionHistory {
  quantity: number;
  date: string;
  dayOfWeek: number;
}

// Factores de ajuste según diferentes criterios
const MONTH_PHASE_FACTORS = {
  early: 1.20,    // Inicio de mes (1-10): +20%
  mid: 1.0,       // Mitad de mes (11-20): normal
  late: 0.85      // Final de mes (21-31): -15%
} as const;

const SEASON_FACTORS = {
  low: 0.75,      // Temporada baja (enero-febrero): -25%
  vacation: 0.80, // Vacaciones estudiantiles: -20%
  regular: 1.0,   // Temporada regular: normal
  high: 1.30      // Temporada alta (diciembre): +30%
} as const;

const WEATHER_FACTORS = {
  rainy: 0.90,    // Día lluvioso: -10%
  normal: 1.0     // Día normal: normal
} as const;

// Determinar la fase del mes
function getMonthPhase(day: number): keyof typeof MONTH_PHASE_FACTORS {
  if (day <= 10) return 'early';
  if (day <= 20) return 'mid';
  return 'late';
}

// Determinar la temporada
function getSeason(date: Date): keyof typeof SEASON_FACTORS {
  const month = date.getMonth();
  
  // Temporada baja: enero y febrero
  if (month <= 1) return 'low';
  
  // Temporada alta: diciembre
  if (month === 11) return 'high';
  
  // Vacaciones estudiantiles: julio
  if (month === 6) return 'vacation';
  
  // Resto del año: temporada regular
  return 'regular';
}

async function getProductionHistory(
  productId: string,
  targetDate: Date,
  producerId: string
): Promise<ProductionHistory[]> {
  try {
    const startDate = new Date(targetDate);
    startDate.setMonth(startDate.getMonth() - 3);
    
    const startDateStr = getDateString(startDate);
    const endDateStr = getDateString(targetDate);
    
    console.log('🔍 Buscando historial de producción:');
    console.log(`   Producto: ${productId}`);
    console.log(`   Productor: ${producerId}`);
    console.log(`   Período: ${startDateStr} hasta ${endDateStr}`);
    
    const productionsRef = ref(database, 'productions');
    const historicQuery = query(
      productionsRef,
      orderByKey(),
      startAt(startDateStr),
      endAt(endDateStr)
    );

    const snapshot = await get(historicQuery);
    const history: ProductionHistory[] = [];

    if (snapshot.exists()) {
      const productions = snapshot.val();
      console.log('📊 Datos encontrados en la base:', productions);
      
      Object.entries(productions).forEach(([date, dateProductions]: [string, any]) => {
        console.log(`\n📅 Procesando fecha: ${date}`);
        
        const producerProduction = dateProductions[producerId];
        if (producerProduction) {
          console.log('   Encontrada producción del productor');
          
          if (producerProduction[productId]) {
            const production = producerProduction[productId];
            console.log('   Datos del producto:', production);
            
            if (production.quantity > 0 && production.completed) {
              const productionDate = new Date(date);
              history.push({
                quantity: production.quantity,
                date,
                dayOfWeek: productionDate.getUTCDay()
              });
              console.log('   ✅ Producción agregada al historial');
            } else {
              console.log('   ❌ Producción ignorada (cantidad 0 o no completada)');
            }
          } else {
            console.log('   ❌ Producto no encontrado en esta fecha');
          }
        } else {
          console.log('   ❌ Sin producción del productor en esta fecha');
        }
      });
      
      console.log('\n📈 Resumen del historial:');
      console.log(`   Total producciones encontradas: ${history.length}`);
      if (history.length > 0) {
        console.log('   Detalle de producciones:', history);
      }
    } else {
      console.log('❌ No se encontraron datos en el período especificado');
    }

    return history;
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    return [];
  }
}

function calculateHistoricalAverage(history: ProductionHistory[], targetDayOfWeek: number): number {
  console.log('\n📊 Calculando promedio histórico:');
  console.log(`   Día objetivo: ${targetDayOfWeek} (${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][targetDayOfWeek]})`);
  
  // Filtrar producciones del mismo día de la semana
  const sameDayProductions = history.filter(h => h.dayOfWeek === targetDayOfWeek);

  console.log(`   Producciones del mismo día: ${sameDayProductions.length}`);
  if (sameDayProductions.length > 0) {
    console.log('   Detalle:', sameDayProductions);
  }

  // Si no hay producciones del mismo día, usar promedio general
  if (sameDayProductions.length === 0) {
    if (history.length > 0) {
      // Calcular promedio general excluyendo valores atípicos
      const quantities = history.map(h => h.quantity);
      const mean = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
      const stdDev = Math.sqrt(
        quantities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / quantities.length
      );
      
      // Filtrar valores dentro de 2 desviaciones estándar
      const validQuantities = quantities.filter(q => 
        Math.abs(q - mean) <= 2 * stdDev
      );
      
      const average = Math.round(
        validQuantities.reduce((sum, q) => sum + q, 0) / validQuantities.length
      );
      
      console.log('   ℹ️ Usando promedio general (sin valores atípicos):', average);
      return average;
    }
    console.log('   ❌ Sin datos históricos');
    return 0;
  }

  // Calcular promedio para el día específico
  const total = sameDayProductions.reduce((sum, prod) => sum + prod.quantity, 0);
  const average = Math.round(total / sameDayProductions.length);
  console.log(`   ✅ Promedio calculado: ${average}`);
  return average;
}

export async function calculateOptimalQuantity(
  productId: string,
  producerId: string,
  targetDate: Date,
  isRainy: boolean = false
): Promise<number> {
  console.log('\n🎯 INICIANDO CÁLCULO DE CANTIDAD ÓPTIMA');
  console.log('----------------------------------------');
  console.log('Parámetros:');
  console.log(`   Producto: ${productId}`);
  console.log(`   Productor: ${producerId}`);
  console.log(`   Fecha: ${targetDate.toISOString()}`);
  console.log(`   Lluvia: ${isRainy ? 'Sí' : 'No'}`);
  
  try {
    // 1. Obtener histórico y calcular base
    const history = await getProductionHistory(productId, targetDate, producerId);
    const baseQuantity = calculateHistoricalAverage(history, targetDate.getUTCDay());
    
    if (baseQuantity === 0) {
      console.log('\n❌ No hay cantidad base para calcular');
      return 0;
    }

    console.log('\n🔄 Aplicando factores de ajuste:');
    
    // 2. Fase del mes
    const monthPhase = getMonthPhase(targetDate.getUTCDate());
    const monthPhaseFactor = MONTH_PHASE_FACTORS[monthPhase];
    console.log(`   Fase del mes: ${monthPhase} (factor: ${monthPhaseFactor})`);
    
    // 3. Temporada
    const season = getSeason(targetDate);
    const seasonFactor = SEASON_FACTORS[season];
    console.log(`   Temporada: ${season} (factor: ${seasonFactor})`);
    
    // 4. Clima
    const weatherFactor = isRainy ? WEATHER_FACTORS.rainy : WEATHER_FACTORS.normal;
    console.log(`   Clima: ${isRainy ? 'lluvioso' : 'normal'} (factor: ${weatherFactor})`);

    // Calcular cantidad final
    let adjustedQuantity = baseQuantity;
    console.log('\n📊 Cálculo paso a paso:');
    console.log(`   Cantidad base: ${adjustedQuantity}`);
    
    adjustedQuantity *= monthPhaseFactor;
    console.log(`   Después de ajuste por fase del mes: ${Math.round(adjustedQuantity)}`);
    
    adjustedQuantity *= seasonFactor;
    console.log(`   Después de ajuste por temporada: ${Math.round(adjustedQuantity)}`);
    
    adjustedQuantity *= weatherFactor;
    const finalQuantity = Math.round(adjustedQuantity);
    console.log(`   Cantidad final: ${finalQuantity}`);

    console.log('\n✅ Cálculo completado exitosamente');
    return finalQuantity;
  } catch (error) {
    console.error('\n❌ Error en el cálculo:', error);
    return 0;
  }
}

export function getQuantityAdjustments(
  baseQuantity: number,
  targetDate: Date,
  isRainy: boolean = false
): {
  base: number;
  monthPhase: number;
  season: number;
  weather: number;
  final: number;
} {
  const monthPhaseFactor = MONTH_PHASE_FACTORS[getMonthPhase(targetDate.getUTCDate())];
  const seasonFactor = SEASON_FACTORS[getSeason(targetDate)];
  const weatherFactor = isRainy ? WEATHER_FACTORS.rainy : WEATHER_FACTORS.normal;

  const afterMonthPhase = baseQuantity * monthPhaseFactor;
  const afterSeason = afterMonthPhase * seasonFactor;
  const final = Math.round(afterSeason * weatherFactor);

  return {
    base: baseQuantity,
    monthPhase: Math.round(afterMonthPhase),
    season: Math.round(afterSeason),
    weather: final,
    final
  };
}