// Nimbus Automata - Rules Modal

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-emerald-400">
            🧬 Reglas de Nimbus Automata
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-cyan-400">
            🎮 Game of Life Clásico
          </h3>
          <div className="text-zinc-300 text-sm space-y-2">
            <p>En el GOL original de Conway, todas las células siguen las mismas reglas:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong>Supervivencia:</strong> Una célula viva con 2-3 vecinos sobrevive</li>
              <li><strong>Muerte:</strong> Con menos de 2 (soledad) o más de 3 (sobrepoblación) muere</li>
              <li><strong>Nacimiento:</strong> Una célula muerta con exactamente 3 vecinos nace</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-400">
            🧬 Modificación Genética
          </h3>
          <div className="text-zinc-300 text-sm space-y-2">
            <p><strong>Cada célula tiene su propio ADN</strong> que modifica las reglas:</p>
          </div>
          
          <div className="grid gap-3 text-sm">
            <GeneCard 
              name="survivalMin / survivalMax"
              classic="2-3"
              genetic="Variable por célula (1-5)"
              effect="Cada célula decide cuántos vecinos necesita para sobrevivir"
            />
            <GeneCard 
              name="birthCount"
              classic="3"
              genetic="Variable por célula (2-5)"
              effect="Los vecinos 'votan' con sus genes para decidir si nace una nueva célula"
            />
            <GeneCard 
              name="mutationRate"
              classic="N/A"
              genetic="0% - 20%"
              effect="Probabilidad de que un gen mute al reproducirse"
            />
            <GeneCard 
              name="color"
              classic="N/A"
              genetic="RGB heredable"
              effect="Los hijos heredan mezcla de colores de los padres"
            />
            <GeneCard 
              name="energy"
              classic="N/A"
              genetic="50-150"
              effect="Vida máxima. Se agota con el tiempo, muerte si llega a 0"
            />
            <GeneCard 
              name="aggressiveness"
              classic="N/A"
              genetic="0% - 30%"
              effect="Roba energía de vecinos vivos para sobrevivir más"
            />
            <GeneCard 
              name="resilience"
              classic="N/A"
              genetic="30% - 70%"
              effect="Probabilidad de resistir la muerte cuando debería morir"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-amber-400">
            🔄 Reproducción y Herencia
          </h3>
          <div className="text-zinc-300 text-sm space-y-2">
            <ol className="list-decimal list-inside space-y-2 text-zinc-400">
              <li>Cuando nace una célula, se eligen <strong>2 padres</strong> de los vecinos vivos</li>
              <li><strong>Crossover:</strong> El hijo recibe genes aleatorios de cada padre</li>
              <li><strong>Mutación:</strong> Cada gen puede mutar según la tasa de mutación</li>
              <li>El hijo hereda una <strong>mezcla de colores</strong> de los padres</li>
            </ol>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-red-400">
            🌋 Eventos Catastróficos
          </h3>
          <div className="text-zinc-300 text-sm space-y-2">
            <p>
              Cuando un color <strong>domina demasiado tiempo</strong> (150+ generaciones), 
              aumenta la probabilidad de una catástrofe que afecta principalmente al dominante.
            </p>
            <p className="text-zinc-400 text-xs">
              "Los imperios caen" — como en la historia real.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <CatastropheCard emoji="🦠" name="Plaga" effect="40% muerte en dominantes" />
            <CatastropheCard emoji="☄️" name="Meteorito" effect="Destruye zona circular" />
            <CatastropheCard emoji="🏜️" name="Sequía" effect="Drena 60% energía" />
            <CatastropheCard emoji="🚫" name="Infertilidad" effect="Dificulta reproducción" />
            <CatastropheCard emoji="☢️" name="Radiación" effect="Mutaciones extremas" />
            <CatastropheCard emoji="🥶" name="Era Glacial" effect="Mata a los débiles" />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-green-400">
            📊 Qué Observar
          </h3>
          <div className="text-zinc-300 text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><strong>Color dominante:</strong> Evoluciona según qué linajes sobreviven</li>
              <li><strong>Tasa de mutación:</strong> ¿Aumenta o disminuye con el tiempo?</li>
              <li><strong>Población:</strong> ¿Se estabiliza o hay ciclos de boom/extinción?</li>
              <li><strong>Zonas de color:</strong> Pueden formarse "especies" en diferentes áreas</li>
            </ul>
          </div>
        </section>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
}

function GeneCard({ 
  name, 
  classic, 
  genetic, 
  effect 
}: { 
  name: string; 
  classic: string; 
  genetic: string; 
  effect: string;
}) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3 space-y-1">
      <div className="font-mono text-emerald-400 text-xs">{name}</div>
      <div className="flex gap-4 text-xs">
        <span className="text-zinc-500">Clásico: <span className="text-zinc-400">{classic}</span></span>
        <span className="text-zinc-500">Genético: <span className="text-purple-400">{genetic}</span></span>
      </div>
      <div className="text-zinc-400 text-xs">{effect}</div>
    </div>
  );
}

function CatastropheCard({ emoji, name, effect }: { emoji: string; name: string; effect: string }) {
  return (
    <div className="bg-red-950/30 rounded p-2 flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      <div>
        <div className="text-red-300 font-medium">{name}</div>
        <div className="text-zinc-500 text-xs">{effect}</div>
      </div>
    </div>
  );
}
