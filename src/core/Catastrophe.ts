// Nimbus Automata - Catastrophic Events

import type { WorldGrid } from './types';

export interface Catastrophe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  apply: (grid: WorldGrid, dominantColor: [number, number, number]) => number; // Returns affected count
}

// Check if a color is similar to the dominant (within threshold)
function isColorSimilar(
  color: [number, number, number], 
  dominant: [number, number, number], 
  threshold = 80
): boolean {
  const dist = Math.abs(color[0] - dominant[0]) + 
               Math.abs(color[1] - dominant[1]) + 
               Math.abs(color[2] - dominant[2]);
  return dist < threshold;
}

export const CATASTROPHES: Catastrophe[] = [
  {
    id: 'plague',
    name: 'Plaga',
    emoji: '🦠',
    description: 'Una enfermedad ataca al color dominante',
    apply: (grid, dominantColor) => {
      let affected = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.alive && isColorSimilar(cell.genome.color, dominantColor)) {
            // 40% chance of death
            if (Math.random() < 0.4) {
              cell.alive = false;
              cell.currentEnergy = 0;
              affected++;
            }
          }
        }
      }
      return affected;
    },
  },
  {
    id: 'meteor',
    name: 'Meteorito',
    emoji: '☄️',
    description: 'Impacto devastador en zona aleatoria',
    apply: (grid, _dominantColor) => {
      let affected = 0;
      const height = grid.length;
      const width = grid[0].length;
      
      // Random impact zone
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * height);
      const radius = 15 + Math.floor(Math.random() * 10); // 15-25 radius
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = Math.min(Math.abs(x - cx), width - Math.abs(x - cx));
          const dy = Math.min(Math.abs(y - cy), height - Math.abs(y - cy));
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < radius && grid[y][x].alive) {
            grid[y][x].alive = false;
            grid[y][x].currentEnergy = 0;
            affected++;
          }
        }
      }
      return affected;
    },
  },
  {
    id: 'drought',
    name: 'Sequía',
    emoji: '🏜️',
    description: 'Escasez de recursos reduce energía del dominante',
    apply: (grid, dominantColor) => {
      let affected = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.alive && isColorSimilar(cell.genome.color, dominantColor)) {
            // Drain 60% energy
            cell.currentEnergy = Math.floor(cell.currentEnergy * 0.4);
            if (cell.currentEnergy <= 0) {
              cell.alive = false;
            }
            affected++;
          }
        }
      }
      return affected;
    },
  },
  {
    id: 'infertility',
    name: 'Infertilidad',
    emoji: '🚫',
    description: 'El dominante pierde capacidad reproductiva',
    apply: (grid, dominantColor) => {
      let affected = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.alive && isColorSimilar(cell.genome.color, dominantColor)) {
            // Worsen birth conditions
            cell.genome.birthCount = Math.min(8, cell.genome.birthCount + 2);
            cell.genome.survivalMin = Math.max(1, cell.genome.survivalMin - 1);
            affected++;
          }
        }
      }
      return affected;
    },
  },
  {
    id: 'mutation_burst',
    name: 'Radiación',
    emoji: '☢️',
    description: 'Mutaciones extremas en el dominante',
    apply: (grid, dominantColor) => {
      let affected = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.alive && isColorSimilar(cell.genome.color, dominantColor)) {
            // Scramble genes
            cell.genome.mutationRate = Math.min(1, cell.genome.mutationRate + 0.3);
            cell.genome.color = [
              Math.floor(Math.random() * 256),
              Math.floor(Math.random() * 256),
              Math.floor(Math.random() * 256),
            ];
            affected++;
          }
        }
      }
      return affected;
    },
  },
  {
    id: 'ice_age',
    name: 'Era Glacial',
    emoji: '🥶',
    description: 'Frío extremo mata a los más débiles',
    apply: (grid, dominantColor) => {
      let affected = 0;
      for (const row of grid) {
        for (const cell of row) {
          if (cell.alive && isColorSimilar(cell.genome.color, dominantColor)) {
            // Kill cells with low resilience
            if (cell.genome.resilience < 0.5 || cell.currentEnergy < 30) {
              cell.alive = false;
              cell.currentEnergy = 0;
              affected++;
            }
          }
        }
      }
      return affected;
    },
  },
];

// Select a random catastrophe
export function selectCatastrophe(): Catastrophe {
  return CATASTROPHES[Math.floor(Math.random() * CATASTROPHES.length)];
}
