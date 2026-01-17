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

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex items-start">
          <Canvas
            ref={canvasRef}
            world={world}
            cellSize={5}
            onCellClick={toggleCell}
          />
        </div>

        <aside className="w-full lg:w-72 space-y-3">
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
          
          <Stats stats={stats} />
          
          <EventLog stats={stats} />
          
          <div className="bg-zinc-900 rounded-lg p-3 text-xs text-zinc-500 space-y-2">
            <h2 className="text-zinc-400 font-semibold uppercase tracking-wider text-xs">
              🧬 ¿Qué es esto?
            </h2>
            <p>
              Una versión evolucionada del <strong>Juego de la Vida</strong> donde 
              cada célula tiene su propio <strong>ADN</strong>.
            </p>
            <p>
              Los genes controlan las reglas de supervivencia, reproducción y 
              apariencia. Las células heredan y mutan genes de sus padres.
            </p>
            <p className="text-emerald-400/70">
              💡 Haz clic en "Ver Reglas" para entender cómo funciona.
            </p>
          </div>
        </aside>
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
