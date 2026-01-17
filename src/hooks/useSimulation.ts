// Nimbus Automata - Simulation Hook

import { useState, useCallback, useRef, useEffect } from 'react';
import { World } from '../core/World';
import type { WorldStats, WorldConfig } from '../core/types';

interface UseSimulationOptions extends Partial<WorldConfig> {
  initialSpeed?: number;
}

export function useSimulation(options: UseSimulationOptions = {}) {
  const { initialSpeed = 10, ...worldConfig } = options;
  
  const [world] = useState(() => new World(worldConfig));
  const [generation, setGeneration] = useState(0);
  const [stats, setStats] = useState<WorldStats>(world.stats);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  
  const intervalRef = useRef<number | null>(null);

  // Initialize world on mount
  useEffect(() => {
    world.initialize();
    setStats(world.stats);
    setGeneration(world.generation);
  }, [world]);

  // Step forward one generation
  const step = useCallback(() => {
    world.tick();
    setStats(world.stats);
    setGeneration(world.generation);
  }, [world]);

  // Start/stop simulation
  const play = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      play();
    }
  }, [isRunning, play, pause]);

  // Handle interval updates
  useEffect(() => {
    if (isRunning) {
      const ms = Math.max(16, 1000 / speed);
      intervalRef.current = window.setInterval(() => {
        step();
      }, ms);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, step]);

  // Reset to random initial state
  const reset = useCallback(() => {
    setIsRunning(false);
    world.initialize();
    setStats(world.stats);
    setGeneration(world.generation);
  }, [world]);

  // Clear the world
  const clear = useCallback(() => {
    setIsRunning(false);
    world.clear();
    setStats(world.stats);
    setGeneration(world.generation);
  }, [world]);

  // Toggle cell
  const toggleCell = useCallback((x: number, y: number) => {
    const cell = world.getCell(x, y);
    world.setCell(x, y, !cell.alive);
    setStats(world.stats);
  }, [world]);

  return {
    world,
    generation,
    stats,
    isRunning,
    speed,
    step,
    play,
    pause,
    togglePlayPause,
    reset,
    clear,
    toggleCell,
    setSpeed,
  };
}
