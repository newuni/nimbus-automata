// Nimbus Automata - World Simulation

import type { Cell, WorldConfig, WorldGrid, WorldStats, Genome } from './types';
import { createRandomGenome, crossover, mutate, createDefaultGenome } from './Genome';
import { selectCatastrophe, type Catastrophe } from './Catastrophe';
import { type Preset } from './Presets';

// Helper functions
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomDelta(max: number): number {
  return (Math.random() * 2 - 1) * max;
}

const DEFAULT_CONFIG: WorldConfig = {
  width: 100,
  height: 100,
  initialDensity: 0.3,
  tickRate: 100,
};

export interface CatastropheEvent {
  generation: number;
  catastrophe: Catastrophe;
  affected: number;
  dominantColor: [number, number, number];
}

export class World {
  private grid: WorldGrid;
  private config: WorldConfig;
  private _generation: number = 0;
  private _stats: WorldStats;
  
  // Catastrophe tracking
  private _dominanceStreak: number = 0;
  private _lastDominantColor: [number, number, number] = [0, 0, 0];
  private _lastCatastrophe: CatastropheEvent | null = null;
  private _catastropheHistory: CatastropheEvent[] = [];

  constructor(config: Partial<WorldConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.grid = this.createEmptyGrid();
    this._stats = this.createEmptyStats();
  }

  private createEmptyGrid(): WorldGrid {
    const { width, height } = this.config;
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => this.createDeadCell())
    );
  }

  private createDeadCell(): Cell {
    return {
      alive: false,
      genome: createDefaultGenome(),
      age: 0,
      currentEnergy: 0,
      generation: 0,
    };
  }

  private createAliveCell(genome?: Genome): Cell {
    const g = genome ?? createRandomGenome();
    return {
      alive: true,
      genome: g,
      age: 0,
      currentEnergy: g.energy,
      generation: this._generation,
    };
  }

  private createEmptyStats(): WorldStats {
    return {
      generation: 0,
      population: 0,
      births: 0,
      deaths: 0,
      avgEnergy: 0,
      avgMutationRate: 0,
      dominantColor: [0, 255, 128],
    };
  }

  // Initialize world with random cells + color clusters (or preset)
  initialize(preset?: Preset): void {
    const { width, height, initialDensity } = this.config;
    this._generation = 0;
    
    // Reset catastrophe tracking
    this._dominanceStreak = 0;
    this._lastDominantColor = [0, 0, 0];
    this._lastCatastrophe = null;
    this._catastropheHistory = [];

    // Clear grid first
    this.grid = this.createEmptyGrid();

    // If preset provided and has cells, use it
    if (preset && preset.id !== 'random') {
      const presetCells = preset.generate(width, height, initialDensity);
      
      if (presetCells.length > 0) {
        for (const cell of presetCells) {
          if (cell.x >= 0 && cell.x < width && cell.y >= 0 && cell.y < height) {
            this.grid[cell.y][cell.x] = this.createAliveCell(cell.genome);
          }
        }
        this.updateStats();
        return;
      }
    }

    // Default: random clusters
    const NUM_CLUSTERS = 12 + Math.floor(Math.random() * 8);
    const CLUSTER_RADIUS = 8 + Math.floor(Math.random() * 6);
    
    const clusters: { x: number; y: number; genome: Genome }[] = [];
    for (let i = 0; i < NUM_CLUSTERS; i++) {
      clusters.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        genome: createRandomGenome(),
      });
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (Math.random() < initialDensity) {
          let nearestCluster: typeof clusters[0] | null = null;
          let nearestDist = Infinity;
          
          for (const cluster of clusters) {
            const dx = Math.min(Math.abs(x - cluster.x), width - Math.abs(x - cluster.x));
            const dy = Math.min(Math.abs(y - cluster.y), height - Math.abs(y - cluster.y));
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestCluster = cluster;
            }
          }
          
          const clusterInfluence = nearestCluster && nearestDist < CLUSTER_RADIUS
            ? Math.pow(1 - nearestDist / CLUSTER_RADIUS, 2)
            : 0;
          
          if (nearestCluster && Math.random() < clusterInfluence * 0.85) {
            const genome = { ...nearestCluster.genome };
            genome.color = [
              clamp(genome.color[0] + randomDelta(20), 0, 255),
              clamp(genome.color[1] + randomDelta(20), 0, 255),
              clamp(genome.color[2] + randomDelta(20), 0, 255),
            ] as [number, number, number];
            this.grid[y][x] = this.createAliveCell(genome);
          } else {
            this.grid[y][x] = this.createAliveCell();
          }
        } else {
          this.grid[y][x] = this.createDeadCell();
        }
      }
    }

    this.updateStats();
  }

  // Get neighbors of a cell
  private getNeighbors(x: number, y: number): Cell[] {
    const { width, height } = this.config;
    const neighbors: Cell[] = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        // Wrap around (toroidal world)
        const nx = (x + dx + width) % width;
        const ny = (y + dy + height) % height;

        neighbors.push(this.grid[ny][nx]);
      }
    }

    return neighbors;
  }

  // Compute next generation
  tick(): void {
    const { width, height } = this.config;
    const newGrid = this.createEmptyGrid();
    let births = 0;
    let deaths = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = this.grid[y][x];
        const neighbors = this.getNeighbors(x, y);
        const aliveNeighbors = neighbors.filter((n) => n.alive);
        const aliveCount = aliveNeighbors.length;

        if (cell.alive) {
          // Check survival based on genome
          const survives =
            aliveCount >= cell.genome.survivalMin &&
            aliveCount <= cell.genome.survivalMax;

          // Energy and resilience check
          const energyDepleted = cell.currentEnergy <= 0;
          const resistsDeath = Math.random() < cell.genome.resilience * 0.1;

          if (survives && !energyDepleted) {
            // Cell survives
            newGrid[y][x] = {
              ...cell,
              age: cell.age + 1,
              currentEnergy: cell.currentEnergy - 1 + (cell.genome.aggressiveness * aliveCount * 0.5),
            };
          } else if (resistsDeath && !energyDepleted) {
            // Cell resists death due to resilience
            newGrid[y][x] = {
              ...cell,
              age: cell.age + 1,
              currentEnergy: cell.currentEnergy - 2,
            };
          } else {
            // Cell dies
            newGrid[y][x] = this.createDeadCell();
            deaths++;
          }
        } else {
          // Dead cell - check for birth
          if (aliveNeighbors.length > 0) {
            // Use the most common birth count among neighbors
            const birthCounts = aliveNeighbors.map((n) => n.genome.birthCount);
            const avgBirthCount = Math.round(
              birthCounts.reduce((a, b) => a + b, 0) / birthCounts.length
            );

            if (aliveCount === avgBirthCount || aliveCount === 3) {
              // New cell is born! Pick parents and crossover
              const parents = aliveNeighbors
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);

              let childGenome: Genome;
              if (parents.length >= 2) {
                childGenome = mutate(crossover(parents[0].genome, parents[1].genome));
              } else {
                childGenome = mutate({ ...parents[0].genome });
              }

              newGrid[y][x] = this.createAliveCell(childGenome);
              births++;
            }
          }
        }
      }
    }

    this.grid = newGrid;
    this._generation++;
    this._stats.births = births;
    this._stats.deaths = deaths;
    this.updateStats();
    this.checkCatastrophe();
  }

  // Check if a catastrophe should occur
  private checkCatastrophe(): void {
    this._lastCatastrophe = null;
    
    // Check if dominant color changed
    const colorDist = Math.abs(this._stats.dominantColor[0] - this._lastDominantColor[0]) +
                      Math.abs(this._stats.dominantColor[1] - this._lastDominantColor[1]) +
                      Math.abs(this._stats.dominantColor[2] - this._lastDominantColor[2]);
    
    if (colorDist < 60) {
      // Same color still dominant
      this._dominanceStreak++;
    } else {
      // New dominant color
      this._dominanceStreak = 0;
      this._lastDominantColor = [...this._stats.dominantColor] as [number, number, number];
    }
    
    // Catastrophe probability increases with dominance streak
    // Starts at gen 150, increases every 100 gens of dominance
    if (this._dominanceStreak >= 150 && this._stats.population > 500) {
      const baseChance = 0.005; // 0.5% base chance per tick
      const streakBonus = Math.floor(this._dominanceStreak / 100) * 0.01; // +1% per 100 gens
      const chance = Math.min(0.1, baseChance + streakBonus); // Cap at 10%
      
      if (Math.random() < chance) {
        const catastrophe = selectCatastrophe();
        const affected = catastrophe.apply(this.grid, this._stats.dominantColor);
        
        this._lastCatastrophe = {
          generation: this._generation,
          catastrophe,
          affected,
          dominantColor: [...this._stats.dominantColor] as [number, number, number],
        };
        this._catastropheHistory.push(this._lastCatastrophe);
        
        // Reset streak after catastrophe
        this._dominanceStreak = 0;
        
        // Update stats after catastrophe
        this.updateStats();
      }
    }
  }

  private updateStats(): void {
    const { width, height } = this.config;
    let population = 0;
    let totalEnergy = 0;
    let totalMutationRate = 0;
    
    // Color buckets for finding dominant color (quantize to 64-unit buckets)
    const BUCKET_SIZE = 64;
    const colorBuckets = new Map<string, { count: number; sumR: number; sumG: number; sumB: number }>();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = this.grid[y][x];
        if (cell.alive) {
          population++;
          totalEnergy += cell.currentEnergy;
          totalMutationRate += cell.genome.mutationRate;
          
          // Quantize color to bucket
          const [r, g, b] = cell.genome.color;
          const bucketKey = `${Math.floor(r / BUCKET_SIZE)},${Math.floor(g / BUCKET_SIZE)},${Math.floor(b / BUCKET_SIZE)}`;
          
          const bucket = colorBuckets.get(bucketKey) || { count: 0, sumR: 0, sumG: 0, sumB: 0 };
          bucket.count++;
          bucket.sumR += r;
          bucket.sumG += g;
          bucket.sumB += b;
          colorBuckets.set(bucketKey, bucket);
        }
      }
    }

    this._stats.generation = this._generation;
    this._stats.population = population;

    if (population > 0) {
      this._stats.avgEnergy = totalEnergy / population;
      this._stats.avgMutationRate = totalMutationRate / population;
      
      // Find the most populated color bucket
      let maxBucket = { count: 0, sumR: 0, sumG: 0, sumB: 0 };
      for (const bucket of colorBuckets.values()) {
        if (bucket.count > maxBucket.count) {
          maxBucket = bucket;
        }
      }
      
      // Dominant color is the average within the most common bucket
      if (maxBucket.count > 0) {
        this._stats.dominantColor = [
          Math.round(maxBucket.sumR / maxBucket.count),
          Math.round(maxBucket.sumG / maxBucket.count),
          Math.round(maxBucket.sumB / maxBucket.count),
        ];
      }
    }
  }

  // Getters
  get generation(): number {
    return this._generation;
  }

  get stats(): WorldStats {
    return { ...this._stats };
  }

  get width(): number {
    return this.config.width;
  }

  get height(): number {
    return this.config.height;
  }

  // Catastrophe getters
  get lastCatastrophe(): CatastropheEvent | null {
    return this._lastCatastrophe;
  }

  get catastropheHistory(): CatastropheEvent[] {
    return [...this._catastropheHistory];
  }

  get dominanceStreak(): number {
    return this._dominanceStreak;
  }

  // Get cell at position
  getCell(x: number, y: number): Cell {
    return this.grid[y][x];
  }

  // Get entire grid (for rendering)
  getGrid(): WorldGrid {
    return this.grid;
  }

  // Set cell alive/dead (for user interaction)
  setCell(x: number, y: number, alive: boolean): void {
    if (alive) {
      this.grid[y][x] = this.createAliveCell();
    } else {
      this.grid[y][x] = this.createDeadCell();
    }
  }

  // Clear the world
  clear(): void {
    this.grid = this.createEmptyGrid();
    this._generation = 0;
    this._stats = this.createEmptyStats();
  }

  // Resize world
  resize(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;
    this.grid = this.createEmptyGrid();
    this._generation = 0;
  }

  // Manually trigger a catastrophe
  triggerCatastrophe(catastrophe: { apply: (grid: WorldGrid, dominantColor: [number, number, number]) => number; name: string; emoji: string; id: string; description: string }): CatastropheEvent {
    const affected = catastrophe.apply(this.grid, this._stats.dominantColor);
    
    const event: CatastropheEvent = {
      generation: this._generation,
      catastrophe,
      affected,
      dominantColor: [...this._stats.dominantColor] as [number, number, number],
    };
    
    this._lastCatastrophe = event;
    this._catastropheHistory.push(event);
    this.updateStats();
    
    return event;
  }
}
