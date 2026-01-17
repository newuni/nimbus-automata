// Nimbus Automata - Main App (Español)

import { useState, useRef } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { Canvas, type CanvasHandle } from './components/Canvas';
import { Stats } from './components/Stats';
import { Controls } from './components/Controls';
import { EventLog } from './components/EventLog';
import { RulesModal } from './components/RulesModal';

function App() {
  const [showRules, setShowRules] = useState(false);
  const canvasRef = useRef<CanvasHandle>(null);
  
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
  } = useSimulation({
    width: 200,
    height: 120,
    initialDensity: 0.25,
    initialSpeed: 15,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <header className="max-w-7xl mx-auto mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🐙 Nimbus Automata
        </h1>
        <p className="text-zinc-500 text-sm">
          Juego de la Vida con Evolución Genética
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Top row: Canvas + Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 overflow-x-auto">
            <Canvas
              ref={canvasRef}
              world={world}
              cellSize={5}
              onCellClick={toggleCell}
              responsive
            />
          </div>

          <aside className="w-full lg:w-56 space-y-3">
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
            />
            
            <div className="bg-zinc-900 rounded-lg p-3 text-xs text-zinc-500 space-y-2">
              <h2 className="text-zinc-400 font-semibold uppercase tracking-wider text-xs">
                🧬 ¿Qué es esto?
              </h2>
              <p>
                <strong>Juego de la Vida</strong> con evolución genética. 
                Cada célula tiene ADN único que hereda y muta.
              </p>
              <p className="text-emerald-400/70">
                💡 Clic en "Reglas" para más info.
              </p>
            </div>
          </aside>
        </div>

        {/* Bottom row: Stats + Event Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Stats stats={stats} />
          <EventLog stats={stats} lastCatastrophe={lastCatastrophe} />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-4 pt-4 border-t border-zinc-900 text-center text-zinc-600 text-xs space-y-1">
        <div>Hecho con 🐙 por Nimbus &amp; newuni</div>
        <div className="font-mono text-zinc-700">
          v{__COMMIT_HASH__.slice(0, 7)} • {new Date(__BUILD_TIME__).toLocaleDateString('es-ES')}
        </div>
      </footer>

      <RulesModal 
        isOpen={showRules} 
        onClose={() => setShowRules(false)} 
      />
    </div>
  );
}

export default App;
