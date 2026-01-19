// Nimbus Automata - Main App (Español)

import { useState, useRef, useEffect } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { Canvas, type CanvasHandle } from './components/Canvas';
import { Stats } from './components/Stats';
import { Controls } from './components/Controls';
import { EventLog } from './components/EventLog';
import { RulesModal } from './components/RulesModal';
import { Ecology } from './components/Ecology';
import { PresetsSelector } from './components/Presets';
import { HabitatLegend } from './components/HabitatLegend';

function App() {
  const [showRules, setShowRules] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const canvasRef = useRef<CanvasHandle>(null);

  // ESC para salir del modo Zen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);
  
  const {
    world,
    stats,
    isRunning,
    speed,
    lastCatastrophe,
    step,
    togglePlayPause,
    reset,
    clear,
    toggleCell,
    setSpeed,
    triggerCatastrophe,
  } = useSimulation({
    width: 200,
    height: 120,
    initialDensity: 0.25,
    initialSpeed: 15,
  });

  // Modo Zen: canvas fullscreen (optimizado para móviles)
  if (isZenMode) {
    return (
      <div 
        className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center overflow-hidden touch-none"
        style={{ 
          height: '100dvh', // Dynamic viewport height para móviles
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <Canvas
          ref={canvasRef}
          world={world}
          cellSize={6}
          onCellClick={toggleCell}
          fullscreen
        />
        
        {/* Controles flotantes en modo Zen - más grandes para touch */}
        <div 
          className="fixed top-4 right-4 flex gap-3 opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <button
            onClick={togglePlayPause}
            className="p-4 sm:p-3 bg-zinc-800/90 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl backdrop-blur text-xl sm:text-lg select-none"
            title={isRunning ? 'Pausar' : 'Iniciar'}
          >
            {isRunning ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => setIsZenMode(false)}
            className="p-4 sm:p-3 bg-zinc-800/90 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl backdrop-blur text-xl sm:text-lg select-none"
            title="Salir (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Stats minimalista */}
        <div 
          className="fixed left-4 text-zinc-500 text-xs sm:text-sm font-mono opacity-50 select-none"
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          Gen {stats.generation} • {stats.population} células
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Header compacto */}
      <header className="shrink-0 px-3 py-2 border-b border-zinc-900">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              🐙 Nimbus Automata
            </h1>
          </div>
          <div className="text-zinc-600 text-xs font-mono">
            v{__COMMIT_HASH__.slice(0, 7)}
          </div>
        </div>
      </header>

      {/* Main content - flex-1 para ocupar todo el espacio */}
      <main className="flex-1 min-h-0 p-2 sm:p-3">
        <div className="h-full max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-3">
          
          {/* Canvas - ocupa todo el espacio restante */}
          <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center bg-zinc-900/30 rounded-lg p-2">
            <Canvas
              ref={canvasRef}
              world={world}
              cellSize={5}
              onCellClick={toggleCell}
            />
          </div>

          {/* Sidebar derecha - scroll independiente */}
          <aside className="xl:w-72 shrink-0 flex flex-col gap-2 xl:overflow-y-auto xl:max-h-full">
            {/* Controles principales */}
            <Controls
              isRunning={isRunning}
              speed={speed}
              onPlayPause={togglePlayPause}
              onStep={step}
              onReset={reset}
              onClear={clear}
              onSpeedChange={setSpeed}
              onShowRules={() => setShowRules(true)}
              onSnapshot={() => canvasRef.current?.takeSnapshot()}
              onZenMode={() => setIsZenMode(true)}
            />
            
            {/* Stats */}
            <Stats stats={stats} />

            {/* Grid 2 columnas en móvil, 1 en desktop */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
              <Ecology 
                onTriggerCatastrophe={triggerCatastrophe}
                disabled={stats.population === 0}
              />
              <HabitatLegend />
            </div>
            
            {/* Presets */}
            <PresetsSelector onSelect={(preset) => reset(preset)} />
            
            {/* Event Log */}
            <EventLog stats={stats} lastCatastrophe={lastCatastrophe} />
          </aside>
        </div>
      </main>

      <RulesModal 
        isOpen={showRules} 
        onClose={() => setShowRules(false)} 
      />
    </div>
  );
}

export default App;
