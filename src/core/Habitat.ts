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

// Genera un mapa de hábitats usando ruido/zonas
export function generateHabitatMap(
  width: number, 
  height: number, 
  style: 'zones' | 'gradient' | 'random' = 'zones'
): HabitatMap {
  const map: HabitatMap = [];
  
  if (style === 'zones') {
    // Dividir en zonas grandes con transiciones
    const zones = generateZones(width, height);
    return zones;
  } else if (style === 'gradient') {
    // Gradiente de arriba a abajo
    const habitatOrder: HabitatId[] = ['frozen', 'temperate', 'oasis', 'desert', 'volcanic'];
    for (let y = 0; y < height; y++) {
      const row: HabitatId[] = [];
      const idx = Math.floor((y / height) * habitatOrder.length);
      const habitat = habitatOrder[Math.min(idx, habitatOrder.length - 1)];
      for (let x = 0; x < width; x++) {
        row.push(habitat);
      }
      map.push(row);
    }
    return map;
  } else {
    // Random por celda (caótico)
    const ids = Object.keys(HABITATS) as HabitatId[];
    for (let y = 0; y < height; y++) {
      const row: HabitatId[] = [];
      for (let x = 0; x < width; x++) {
        row.push(ids[Math.floor(Math.random() * ids.length)]);
      }
      map.push(row);
    }
    return map;
  }
}

// Genera zonas usando centros y Voronoi simplificado
function generateZones(width: number, height: number): HabitatMap {
  const map: HabitatMap = Array.from({ length: height }, () => 
    Array(width).fill('temperate')
  );
  
  const habitatIds = Object.keys(HABITATS) as HabitatId[];
  
  // Crear centros de zona (excluyendo radioactive del centro)
  const numZones = 5 + Math.floor(Math.random() * 3);
  const centers: { x: number; y: number; habitat: HabitatId }[] = [];
  
  // Centro siempre es oasis o temperate
  centers.push({
    x: Math.floor(width / 2) + Math.floor(Math.random() * 20 - 10),
    y: Math.floor(height / 2) + Math.floor(Math.random() * 10 - 5),
    habitat: Math.random() > 0.5 ? 'oasis' : 'temperate',
  });
  
  // Otras zonas distribuidas
  for (let i = 1; i < numZones; i++) {
    centers.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      habitat: habitatIds[Math.floor(Math.random() * habitatIds.length)],
    });
  }
  
  // Asignar cada celda al centro más cercano (Voronoi)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minDist = Infinity;
      let nearest: HabitatId = 'temperate';
      
      for (const center of centers) {
        // Distancia toroidal
        const dx = Math.min(Math.abs(x - center.x), width - Math.abs(x - center.x));
        const dy = Math.min(Math.abs(y - center.y), height - Math.abs(y - center.y));
        const dist = dx * dx + dy * dy;
        
        if (dist < minDist) {
          minDist = dist;
          nearest = center.habitat;
        }
      }
      
      map[y][x] = nearest;
    }
  }
  
  return map;
}

// Obtener el hábitat en una posición
export function getHabitatAt(map: HabitatMap, x: number, y: number): Habitat {
  const id = map[y]?.[x] ?? 'temperate';
  return HABITATS[id];
}
