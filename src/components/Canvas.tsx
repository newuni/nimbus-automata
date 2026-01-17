// Nimbus Automata - Canvas Renderer

import { useEffect, useRef, useCallback } from 'react';
import type { World } from '../core/World';

interface CanvasProps {
  world: World;
  cellSize?: number;
  showGrid?: boolean;
  onCellClick?: (x: number, y: number) => void;
}

export function Canvas({ 
  world, 
  cellSize = 6, 
  showGrid = false,
  onCellClick 
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = world.width;
    const height = world.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    const grid = world.getGrid();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = grid[y][x];
        if (cell.alive) {
          const [r, g, b] = cell.genome.color;
          // Fade based on energy
          const alpha = Math.max(0.3, cell.currentEnergy / cell.genome.energy);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }

    // Draw grid lines (optional)
    if (showGrid && cellSize > 3) {
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, height * cellSize);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(width * cellSize, y * cellSize);
        ctx.stroke();
      }
    }
  }, [world, cellSize, showGrid]);

  // Handle click to toggle cells
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCellClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x >= 0 && x < world.width && y >= 0 && y < world.height) {
      onCellClick(x, y);
    }
  }, [cellSize, world, onCellClick]);

  // Re-render when world changes
  useEffect(() => {
    render();
  }, [render, world.generation]);

  // Force re-render periodically to catch state changes
  useEffect(() => {
    const id = setInterval(render, 100);
    return () => clearInterval(id);
  }, [render]);

  // Initial render
  useEffect(() => {
    render();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      width={world.width * cellSize}
      height={world.height * cellSize}
      onClick={handleClick}
      className="border border-zinc-800 rounded-lg cursor-crosshair"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
