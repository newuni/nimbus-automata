// Nimbus Automata - Core Types

export interface Genome {
  // Survival rules
  survivalMin: number;      // Min neighbors to survive (classic: 2)
  survivalMax: number;      // Max neighbors to survive (classic: 3)
  birthCount: number;       // Exact neighbors to be born (classic: 3)
  
  // Genetic traits
  mutationRate: number;     // 0-1, probability of mutation
  color: [number, number, number]; // RGB
  energy: number;           // Starting energy (lifespan)
  
  // Advanced traits
  aggressiveness: number;   // 0-1, chance to "steal" energy from neighbors
  resilience: number;       // 0-1, resistance to death
  
  // Behavioral traits (new)
  exploration: number;      // 0-1, tendency to spread vs stay compact
  cooperation: number;      // 0-1, share energy with similar colors
  predation: number;        // 0-1, attack/consume cells of opposite colors
}

// Resource particle on the map
export interface Resource {
  x: number;
  y: number;
  amount: number;           // Energy available
  type: 'food' | 'energy';
}

export interface Cell {
  alive: boolean;
  genome: Genome;
  age: number;
  currentEnergy: number;
  generation: number;
}

export interface WorldConfig {
  width: number;
  height: number;
  initialDensity: number;   // 0-1, percentage of cells alive at start
  tickRate: number;         // ms between generations
}

export interface WorldStats {
  generation: number;
  population: number;
  births: number;
  deaths: number;
  avgEnergy: number;
  avgMutationRate: number;
  dominantColor: [number, number, number];
}

export type WorldGrid = Cell[][];
