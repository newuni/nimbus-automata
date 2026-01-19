// Nimbus Automata - Canvas Renderer

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import type { World } from '../core/World';
import { HABITATS } from '../core/Habitat';

interface CanvasProps {
  world: World;
  cellSize?: number;
  showGrid?: boolean;
  onCellClick?: (x: number, y: number) => void;
  fullscreen?: boolean;
}

export interface CanvasHandle {
  takeSnapshot: () => void;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas({ 
  world, 
  cellSize = 6, 
  showGrid = false,
  onCellClick,
  fullscreen = false,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose takeSnapshot to parent
  useImperativeHandle(ref, () => ({
    takeSnapshot: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      link.download = `nimbus-automata-gen${world.generation}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }), [world.generation]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = world.width;
    const height = world.height;
    const habitatMap = world.habitatMap;

    // Clear canvas with base color
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw habitat background (batched by habitat type for performance)
    const habitatBatches = new Map<string, { x: number; y: number }[]>();
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const habitatId = habitatMap[y]?.[x] ?? 'temperate';
        if (!habitatBatches.has(habitatId)) {
          habitatBatches.set(habitatId, []);
        }
        habitatBatches.get(habitatId)!.push({ x, y });
      }
    }

    // Render each habitat type with distinct colors
    for (const [habitatId, cells] of habitatBatches) {
      const habitat = HABITATS[habitatId];
      const [r, g, b] = habitat?.bgColor ?? [10, 10, 10];
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      
      for (const { x, y } of cells) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

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

    // Draw habitat borders (where habitat changes)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const currentHabitat = habitatMap[y]?.[x];
        
        // Check right neighbor
        if (x < width - 1 && habitatMap[y]?.[x + 1] !== currentHabitat) {
          ctx.beginPath();
          ctx.moveTo((x + 1) * cellSize, y * cellSize);
          ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
          ctx.stroke();
        }
        
        // Check bottom neighbor
        if (y < height - 1 && habitatMap[y + 1]?.[x] !== currentHabitat) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, (y + 1) * cellSize);
          ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
          ctx.stroke();
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
    
    // Account for CSS scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / cellSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / cellSize);

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

  const canvasWidth = world.width * cellSize;
  const canvasHeight = world.height * cellSize;

  // Estilos para diferentes modos
  const getCanvasStyle = (): React.CSSProperties => {
    if (fullscreen) {
      return {
        imageRendering: 'pixelated',
        width: '100vw',
        height: '100dvh',
        maxWidth: '100vw',
        maxHeight: '100dvh',
        objectFit: 'contain',
        touchAction: 'none',
      };
    }
    return {
      imageRendering: 'pixelated',
      maxWidth: '100%',
      maxHeight: '100%',
      width: 'auto',
      height: 'auto',
    };
  };

  return (
    <div ref={containerRef} className={fullscreen ? '' : 'contents'}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
        className={fullscreen 
          ? "cursor-crosshair" 
          : "border border-zinc-800 rounded-lg cursor-crosshair max-w-full max-h-full"
        }
        style={getCanvasStyle()}
      />
    </div>
  );
});
