// Nimbus Automata - Sistema de Hábitats/Biomas

export interface Habitat {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // Modificadores
  energyMultiplier: number;      // Multiplicador de energía base
  mutationMultiplier: number;    // Multiplicador de tasa de mutación
  survivalModifier: number;      // Ajuste a reglas de supervivencia (-1, 0, +1)
  birthModifier: number;         // Ajuste a reglas de nacimiento
  // Visual
  bgLuminosity: number;          // 0-255, luminosidad del fondo
}

// Definición de hábitats
// bgColor: RGB para fondo sutil pero distinguible
export const HABITATS: Record<string, Habitat & { bgColor: [number, number, number] }> = {
  temperate: {
    id: 'temperate',
    name: 'Templado',
    emoji: '🌿',
    description: 'Condiciones equilibradas, reglas estándar',
    energyMultiplier: 1.0,
    mutationMultiplier: 1.0,
    survivalModifier: 0,
    birthModifier: 0,
    bgLuminosity: 10,
    bgColor: [12, 18, 12], // Verde muy oscuro
  },
  oasis: {
    id: 'oasis',
    name: 'Oasis',
    emoji: '💧',
    description: 'Abundante energía, baja mutación',
    energyMultiplier: 1.5,
    mutationMultiplier: 0.5,
    survivalModifier: 0,
    birthModifier: 0,
    bgLuminosity: 18,
    bgColor: [12, 18, 25], // Azul muy oscuro
  },
  desert: {
    id: 'desert',
    name: 'Desierto',
    emoji: '🏜️',
    description: 'Poca energía, alta presión selectiva',
    energyMultiplier: 0.6,
    mutationMultiplier: 1.2,
    survivalModifier: -1,
    birthModifier: 0,
    bgLuminosity: 6,
    bgColor: [20, 15, 8], // Marrón/naranja muy oscuro
  },
  radioactive: {
    id: 'radioactive',
    name: 'Radiactivo',
    emoji: '☢️',
    description: 'Mutación extrema, energía moderada',
    energyMultiplier: 0.8,
    mutationMultiplier: 3.0,
    survivalModifier: 0,
    birthModifier: 0,
    bgLuminosity: 12,
    bgColor: [20, 22, 8], // Verde radioactivo oscuro
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcánico',
    emoji: '🌋',
    description: 'Alta energía pero inestable',
    energyMultiplier: 1.8,
    mutationMultiplier: 1.5,
    survivalModifier: 1,
    birthModifier: 1,
    bgLuminosity: 8,
    bgColor: [25, 10, 8], // Rojo muy oscuro
  },
  frozen: {
    id: 'frozen',
    name: 'Glacial',
    emoji: '❄️',
    description: 'Metabolismo lento, alta resiliencia',
    energyMultiplier: 0.7,
    mutationMultiplier: 0.3,
    survivalModifier: -1,
    birthModifier: -1,
    bgLuminosity: 20,
    bgColor: [18, 22, 28], // Azul hielo oscuro
  },
};

export type HabitatId = keyof typeof HABITATS;
export type HabitatMap = HabitatId[][];

// Layout fijo de hábitats por cuadrantes
// Posiciones: centro + 4 esquinas
export const HABITAT_LAYOUT: { position: string; habitat: HabitatId; label: string }[] = [
  { position: 'center', habitat: 'oasis', label: 'Centro' },
  { position: 'top-left', habitat: 'frozen', label: '↖ Arriba-Izq' },
  { position: 'top-right', habitat: 'radioactive', label: '↗ Arriba-Der' },
  { position: 'bottom-left', habitat: 'volcanic', label: '↙ Abajo-Izq' },
  { position: 'bottom-right', habitat: 'desert', label: '↘ Abajo-Der' },
];

// Genera un mapa de hábitats con zonas fijas por cuadrantes
export function generateHabitatMap(
  width: number, 
  height: number, 
  _style: 'zones' | 'gradient' | 'random' = 'zones'
): HabitatMap {
  const map: HabitatMap = Array.from({ length: height }, () => 
    Array(width).fill('temperate')
  );
  
  const centerX = width / 2;
  const centerY = height / 2;
  const centerRadius = Math.min(width, height) * 0.22; // Radio del centro
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Distancia al centro
      const dx = x - centerX;
      const dy = y - centerY;
      const distToCenter = Math.sqrt(dx * dx + dy * dy);
      
      if (distToCenter < centerRadius) {
        // Centro: Oasis
        map[y][x] = 'oasis';
      } else {
        // Determinar cuadrante
        const inTop = y < centerY;
        const inLeft = x < centerX;
        
        if (inTop && inLeft) {
          map[y][x] = 'frozen';      // ↖ Arriba-Izquierda
        } else if (inTop && !inLeft) {
          map[y][x] = 'radioactive'; // ↗ Arriba-Derecha
        } else if (!inTop && inLeft) {
          map[y][x] = 'volcanic';    // ↙ Abajo-Izquierda
        } else {
          map[y][x] = 'desert';      // ↘ Abajo-Derecha
        }
      }
    }
  }
  
  return map;
}

// Obtener el hábitat en una posición
export function getHabitatAt(map: HabitatMap, x: number, y: number): Habitat {
  const id = map[y]?.[x] ?? 'temperate';
  return HABITATS[id];
}
