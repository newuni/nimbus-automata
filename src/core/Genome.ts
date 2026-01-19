// Nimbus Automata - Genetic Engine

import type { Genome } from './types';

// Classic Game of Life defaults
const DEFAULT_GENOME: Genome = {
  survivalMin: 2,
  survivalMax: 3,
  birthCount: 3,
  mutationRate: 0.05,
  color: [0, 255, 128],
  energy: 100,
  aggressiveness: 0,
  resilience: 0.5,
};

export function createRandomGenome(): Genome {
  // Create more saturated initial colors (one channel dominant)
  const dominant = Math.floor(Math.random() * 3);
  const color: [number, number, number] = [
    dominant === 0 ? 180 + Math.floor(Math.random() * 75) : Math.floor(Math.random() * 120),
    dominant === 1 ? 180 + Math.floor(Math.random() * 75) : Math.floor(Math.random() * 120),
    dominant === 2 ? 180 + Math.floor(Math.random() * 75) : Math.floor(Math.random() * 120),
  ];

  return {
    survivalMin: Math.floor(Math.random() * 3) + 1,        // 1-3
    survivalMax: Math.floor(Math.random() * 4) + 2,        // 2-5
    birthCount: Math.floor(Math.random() * 4) + 2,         // 2-5
    mutationRate: Math.random() * 0.2,                      // 0-0.2
    color,
    energy: 50 + Math.floor(Math.random() * 100),          // 50-150
    aggressiveness: Math.random() * 0.3,                    // 0-0.3
    resilience: 0.3 + Math.random() * 0.4,                  // 0.3-0.7
  };
}

export function createDefaultGenome(): Genome {
  return { ...DEFAULT_GENOME };
}

// Calculate color similarity (0 = identical, 1 = opposite)
function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  const dr = Math.abs(c1[0] - c2[0]);
  const dg = Math.abs(c1[1] - c2[1]);
  const db = Math.abs(c1[2] - c2[2]);
  return (dr + dg + db) / (255 * 3);
}

// Make a color more saturated/pure
function saturateColor(color: [number, number, number]): [number, number, number] {
  const max = Math.max(...color);
  const min = Math.min(...color);
  
  // Boost the dominant channel, reduce others
  return color.map(c => {
    if (c === max) return Math.min(255, c + 40);
    if (c === min) return Math.max(0, c - 40);
    return c;
  }) as [number, number, number];
}

// Crossover: combine two genomes (sexual reproduction)
export function crossover(parent1: Genome, parent2: Genome): Genome {
  const similarity = 1 - colorDistance(parent1.color, parent2.color);
  
  // Determine color inheritance strategy
  let childColor: [number, number, number];
  const roll = Math.random();
  
  if (roll < 0.3) {
    // 30%: Dominant inheritance - take one parent's color entirely
    childColor = Math.random() > 0.5 
      ? [...parent1.color] as [number, number, number]
      : [...parent2.color] as [number, number, number];
  } else if (roll < 0.5 && similarity > 0.7) {
    // 20% (if similar parents): Purify - make color more saturated
    const avgColor: [number, number, number] = [
      Math.floor((parent1.color[0] + parent2.color[0]) / 2),
      Math.floor((parent1.color[1] + parent2.color[1]) / 2),
      Math.floor((parent1.color[2] + parent2.color[2]) / 2),
    ];
    childColor = saturateColor(avgColor);
  } else if (roll < 0.55) {
    // 5%: Random pure color mutation (new "species")
    const dominant = Math.floor(Math.random() * 3);
    childColor = [
      dominant === 0 ? 200 + Math.floor(Math.random() * 55) : Math.floor(Math.random() * 100),
      dominant === 1 ? 200 + Math.floor(Math.random() * 55) : Math.floor(Math.random() * 100),
      dominant === 2 ? 200 + Math.floor(Math.random() * 55) : Math.floor(Math.random() * 100),
    ];
  } else {
    // 45%: Traditional blend (but with slight bias toward stronger parent)
    const bias = 0.3 + Math.random() * 0.4; // 0.3-0.7 instead of always 0.5
    childColor = [
      Math.floor(parent1.color[0] * bias + parent2.color[0] * (1 - bias)),
      Math.floor(parent1.color[1] * bias + parent2.color[1] * (1 - bias)),
      Math.floor(parent1.color[2] * bias + parent2.color[2] * (1 - bias)),
    ];
  }

  return {
    survivalMin: Math.random() > 0.5 ? parent1.survivalMin : parent2.survivalMin,
    survivalMax: Math.random() > 0.5 ? parent1.survivalMax : parent2.survivalMax,
    birthCount: Math.random() > 0.5 ? parent1.birthCount : parent2.birthCount,
    mutationRate: (parent1.mutationRate + parent2.mutationRate) / 2,
    color: childColor,
    energy: Math.floor((parent1.energy + parent2.energy) / 2),
    aggressiveness: (parent1.aggressiveness + parent2.aggressiveness) / 2,
    resilience: (parent1.resilience + parent2.resilience) / 2,
  };
}

// Mutation: randomly alter genes (mutationMultiplier from habitat)
export function mutate(genome: Genome, mutationMultiplier: number = 1.0): Genome {
  const mutated = { ...genome, color: [...genome.color] as [number, number, number] };
  
  // Tasa de mutación ajustada por el hábitat
  const effectiveMutationRate = Math.min(1, genome.mutationRate * mutationMultiplier);
  
  if (Math.random() < effectiveMutationRate) {
    // Pick a random gene to mutate
    const gene = Math.floor(Math.random() * 8);
    
    switch (gene) {
      case 0:
        mutated.survivalMin = clamp(mutated.survivalMin + randomDelta(1), 0, 8);
        break;
      case 1:
        mutated.survivalMax = clamp(mutated.survivalMax + randomDelta(1), 0, 8);
        break;
      case 2:
        mutated.birthCount = clamp(mutated.birthCount + randomDelta(1), 1, 8);
        break;
      case 3:
        mutated.mutationRate = clamp(mutated.mutationRate + randomDelta(0.05), 0, 1);
        break;
      case 4:
        // Mutate color - sometimes dramatically
        if (Math.random() < 0.3) {
          // 30% chance: dramatic mutation toward a pure color
          const dominant = Math.floor(Math.random() * 3);
          mutated.color[dominant] = clamp(mutated.color[dominant] + 50 + Math.random() * 50, 0, 255);
          // Reduce other channels
          for (let i = 0; i < 3; i++) {
            if (i !== dominant) {
              mutated.color[i] = clamp(mutated.color[i] - 30, 0, 255);
            }
          }
        } else {
          // 70%: small mutation
          const colorIdx = Math.floor(Math.random() * 3);
          mutated.color[colorIdx] = clamp(mutated.color[colorIdx] + randomDelta(30), 0, 255);
        }
        break;
      case 5:
        mutated.energy = clamp(mutated.energy + randomDelta(20), 10, 500);
        break;
      case 6:
        mutated.aggressiveness = clamp(mutated.aggressiveness + randomDelta(0.1), 0, 1);
        break;
      case 7:
        mutated.resilience = clamp(mutated.resilience + randomDelta(0.1), 0, 1);
        break;
    }
  }
  
  return mutated;
}

// Helper: random delta (positive or negative)
function randomDelta(max: number): number {
  return (Math.random() * 2 - 1) * max;
}

// Helper: clamp value to range
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Calculate fitness score (for stats)
export function fitness(genome: Genome): number {
  // Balance between survival and reproduction potential
  const survivalRange = genome.survivalMax - genome.survivalMin + 1;
  const energyScore = genome.energy / 100;
  const resilienceScore = genome.resilience;
  
  return (survivalRange * 10 + energyScore * 50 + resilienceScore * 40) / 100;
}
