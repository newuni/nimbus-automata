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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-2 sm:p-4">
      <header className="max-w-[1800px] mx-auto mb-2 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🐙 Nimbus Automata
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm">
          Juego de la Vida con Evolución Genética
        </p>
      </header>

      <main className="max-w-[1800px] mx-auto">
        {/* Desktop: Canvas izquierda, todo lo demás derecha */}
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4">
          {/* Canvas - ocupa todo el espacio disponible */}
          <div className="flex-1 min-w-0">
            <Canvas
              ref={canvasRef}
              world={world}
              cellSize={5}
              onCellClick={toggleCell}
              responsive
            />
          </div>

          {/* Sidebar derecha - en desktop es una columna, en móvil fluye normal */}
          <aside className="w-full xl:w-72 flex flex-col gap-3">
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
            
            {/* Stats compactos */}
            <Stats stats={stats} />

            {/* Grid 2 columnas para Ecología y Hábitats */}
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
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

      <footer className="max-w-[1800px] mx-auto mt-3 pt-3 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        <span>🐙 Nimbus & newuni</span>
        <span className="mx-2">•</span>
        <span className="font-mono text-zinc-700">
          v{__COMMIT_HASH__.slice(0, 7)}
        </span>
      </footer>

      <RulesModal 
        isOpen={showRules} 
        onClose={() => setShowRules(false)} 
      />
    </div>
  );
}

export default App;
