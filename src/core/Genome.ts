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
  return {
    survivalMin: Math.floor(Math.random() * 3) + 1,        // 1-3
    survivalMax: Math.floor(Math.random() * 4) + 2,        // 2-5
    birthCount: Math.floor(Math.random() * 4) + 2,         // 2-5
    mutationRate: Math.random() * 0.2,                      // 0-0.2
    color: [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ],
    energy: 50 + Math.floor(Math.random() * 100),          // 50-150
    aggressiveness: Math.random() * 0.3,                    // 0-0.3
    resilience: 0.3 + Math.random() * 0.4,                  // 0.3-0.7
  };
}

export function createDefaultGenome(): Genome {
  return { ...DEFAULT_GENOME };
}

// Crossover: combine two genomes (sexual reproduction)
export function crossover(parent1: Genome, parent2: Genome): Genome {
  return {
    survivalMin: Math.random() > 0.5 ? parent1.survivalMin : parent2.survivalMin,
    survivalMax: Math.random() > 0.5 ? parent1.survivalMax : parent2.survivalMax,
    birthCount: Math.random() > 0.5 ? parent1.birthCount : parent2.birthCount,
    mutationRate: (parent1.mutationRate + parent2.mutationRate) / 2,
    color: [
      Math.floor((parent1.color[0] + parent2.color[0]) / 2),
      Math.floor((parent1.color[1] + parent2.color[1]) / 2),
      Math.floor((parent1.color[2] + parent2.color[2]) / 2),
    ],
    energy: Math.floor((parent1.energy + parent2.energy) / 2),
    aggressiveness: (parent1.aggressiveness + parent2.aggressiveness) / 2,
    resilience: (parent1.resilience + parent2.resilience) / 2,
  };
}

// Mutation: randomly alter genes
export function mutate(genome: Genome): Genome {
  const mutated = { ...genome, color: [...genome.color] as [number, number, number] };
  
  if (Math.random() < genome.mutationRate) {
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
        // Mutate color
        const colorIdx = Math.floor(Math.random() * 3);
        mutated.color[colorIdx] = clamp(mutated.color[colorIdx] + randomDelta(30), 0, 255);
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
