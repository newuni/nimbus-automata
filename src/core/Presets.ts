// Nimbus Automata - Initial Pattern Presets

import type { Genome } from './types';
import { createRandomGenome } from './Genome';

export interface Preset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  generate: (width: number, height: number, density: number) => PresetCell[];
}

export interface PresetCell {
  x: number;
  y: number;
  genome: Genome;
}

// Helper to create a genome with a specific color
function genomeWithColor(r: number, g: number, b: number): Genome {
  const g_ = createRandomGenome();
  g_.color = [r, g, b];
  return g_;
}

// Colors for different groups
const COLORS: [number, number, number][] = [
  [255, 60, 60],    // Red
  [60, 255, 60],    // Green
  [60, 60, 255],    // Blue
  [255, 255, 60],   // Yellow
  [255, 60, 255],   // Magenta
  [60, 255, 255],   // Cyan
  [255, 160, 60],   // Orange
  [160, 60, 255],   // Purple
];

export const PRESETS: Preset[] = [
  {
    id: 'random',
    name: 'Aleatorio',
    emoji: '🎲',
    description: 'Clusters aleatorios (por defecto)',
    generate: () => [], // Empty = use default random initialization
  },
  {
    id: 'cross',
    name: 'Cruz',
    emoji: '✚',
    description: '4 colores en forma de cruz',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const cx = width / 2;
      const cy = height / 2;
      const armWidth = height / 6;
      const armLength = Math.min(width, height) * 0.4;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          const dx = x - cx;
          const dy = y - cy;
          
          // Top arm
          if (dy < 0 && Math.abs(dy) < armLength && Math.abs(dx) < armWidth) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[0]) });
          }
          // Bottom arm
          else if (dy > 0 && Math.abs(dy) < armLength && Math.abs(dx) < armWidth) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[1]) });
          }
          // Left arm
          else if (dx < 0 && Math.abs(dx) < armLength && Math.abs(dy) < armWidth) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[2]) });
          }
          // Right arm
          else if (dx > 0 && Math.abs(dx) < armLength && Math.abs(dy) < armWidth) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[3]) });
          }
        }
      }
      return cells;
    },
  },
  {
    id: 'circles',
    name: 'Círculos',
    emoji: '◎',
    description: 'Múltiples círculos de diferentes colores',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const numCircles = 6;
      const radius = Math.min(width, height) / 8;
      
      const centers = [
        { x: width * 0.25, y: height * 0.3 },
        { x: width * 0.75, y: height * 0.3 },
        { x: width * 0.5, y: height * 0.5 },
        { x: width * 0.25, y: height * 0.7 },
        { x: width * 0.75, y: height * 0.7 },
        { x: width * 0.5, y: height * 0.85 },
      ];

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          for (let i = 0; i < numCircles; i++) {
            const dx = x - centers[i].x;
            const dy = y - centers[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < radius) {
              cells.push({ x, y, genome: genomeWithColor(...COLORS[i]) });
              break;
            }
          }
        }
      }
      return cells;
    },
  },
  {
    id: 'ring',
    name: 'Anillo',
    emoji: '◯',
    description: 'Un gran anillo con gradiente de color',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const cx = width / 2;
      const cy = height / 2;
      const outerRadius = Math.min(width, height) * 0.4;
      const innerRadius = outerRadius * 0.5;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist >= innerRadius && dist <= outerRadius) {
            // Color based on angle
            const angle = Math.atan2(dy, dx);
            const colorIdx = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * COLORS.length);
            cells.push({ x, y, genome: genomeWithColor(...COLORS[colorIdx % COLORS.length]) });
          }
        }
      }
      return cells;
    },
  },
  {
    id: 'triangles',
    name: 'Triángulos',
    emoji: '△',
    description: '3 triángulos de colores enfrentados',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height) * 0.35;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          // Top triangle
          if (y < cy && Math.abs(x - cx) < (cy - y) * 0.8 && y > cy - size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[0]) });
          }
          // Bottom-left triangle
          else if (y > cy && x < cx && (x - (cx - size * 0.8)) > (y - cy) * -0.8 && x > cx - size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[1]) });
          }
          // Bottom-right triangle
          else if (y > cy && x > cx && ((cx + size * 0.8) - x) > (y - cy) * -0.8 && x < cx + size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[2]) });
          }
        }
      }
      return cells;
    },
  },
  {
    id: 'corners',
    name: 'Esquinas',
    emoji: '◰',
    description: '4 colores en las esquinas',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const size = Math.min(width, height) * 0.3;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          // Top-left
          if (x < size && y < size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[0]) });
          }
          // Top-right
          else if (x > width - size && y < size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[1]) });
          }
          // Bottom-left
          else if (x < size && y > height - size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[2]) });
          }
          // Bottom-right
          else if (x > width - size && y > height - size) {
            cells.push({ x, y, genome: genomeWithColor(...COLORS[3]) });
          }
        }
      }
      return cells;
    },
  },
  {
    id: 'stripes',
    name: 'Franjas',
    emoji: '▤',
    description: 'Franjas verticales de colores',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const numStripes = 5;
      const stripeWidth = width / numStripes;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          const stripeIdx = Math.floor(x / stripeWidth);
          cells.push({ x, y, genome: genomeWithColor(...COLORS[stripeIdx % COLORS.length]) });
        }
      }
      return cells;
    },
  },
  {
    id: 'checkerboard',
    name: 'Ajedrez',
    emoji: '▦',
    description: 'Patrón de ajedrez con 2 colores',
    generate: (width, height, density) => {
      const cells: PresetCell[] = [];
      const cellSize = 15;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.random() > density) continue;
          
          const cellX = Math.floor(x / cellSize);
          const cellY = Math.floor(y / cellSize);
          const isEven = (cellX + cellY) % 2 === 0;
          
          cells.push({ x, y, genome: genomeWithColor(...COLORS[isEven ? 0 : 2]) });
        }
      }
      return cells;
    },
  },
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find(p => p.id === id);
}
