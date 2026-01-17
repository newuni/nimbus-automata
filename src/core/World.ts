// Nimbus Automata - World Simulation

import type { Cell, WorldConfig, WorldGrid, WorldStats, Genome } from './types';
import { createRandomGenome, crossover, mutate, createDefaultGenome } from './Genome';

const DEFAULT_CONFIG: WorldConfig = {
  width: 100,
  height: 100,
  initialDensity: 0.3,
  tickRate: 100,
};

export class World {
  private grid: WorldGrid;
  private config: WorldConfig;
  private _generation: number = 0;
  private _stats: WorldStats;

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

  // Initialize world with random cells
  initialize(): void {
    const { width, height, initialDensity } = this.config;
    this._generation = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (Math.random() < initialDensity) {
          this.grid[y][x] = this.createAliveCell();
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
  }

  private updateStats(): void {
    const { width, height } = this.config;
    let population = 0;
    let totalEnergy = 0;
    let totalMutationRate = 0;
    const colorSum = [0, 0, 0];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = this.grid[y][x];
        if (cell.alive) {
          population++;
          totalEnergy += cell.currentEnergy;
          totalMutationRate += cell.genome.mutationRate;
          colorSum[0] += cell.genome.color[0];
          colorSum[1] += cell.genome.color[1];
          colorSum[2] += cell.genome.color[2];
        }
      }
    }

    this._stats.generation = this._generation;
    this._stats.population = population;

    if (population > 0) {
      this._stats.avgEnergy = totalEnergy / population;
      this._stats.avgMutationRate = totalMutationRate / population;
      this._stats.dominantColor = [
        Math.round(colorSum[0] / population),
        Math.round(colorSum[1] / population),
        Math.round(colorSum[2] / population),
      ];
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
}
