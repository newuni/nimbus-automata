// Nimbus Automata - Leyenda de Hábitats

import { HABITATS, HABITAT_LAYOUT } from '../core/Habitat';

export function HabitatLegend() {
  return (
    <div className="bg-zinc-900 rounded-lg p-3">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-2">
        🗺️ Hábitats
      </h2>
      
      {/* Mapa visual de cuadrantes */}
      <div className="grid grid-cols-3 gap-0.5 mb-2 text-[10px] aspect-[5/3]">
        {/* Fila superior */}
        <div 
          className="flex items-center justify-center rounded-tl border border-zinc-700"
          style={{ backgroundColor: `rgb(${HABITATS.frozen.bgColor[0] * 3}, ${HABITATS.frozen.bgColor[1] * 3}, ${HABITATS.frozen.bgColor[2] * 3})` }}
        >
          ❄️
        </div>
        <div className="flex items-center justify-center text-zinc-600">↑</div>
        <div 
          className="flex items-center justify-center rounded-tr border border-zinc-700"
          style={{ backgroundColor: `rgb(${HABITATS.radioactive.bgColor[0] * 3}, ${HABITATS.radioactive.bgColor[1] * 3}, ${HABITATS.radioactive.bgColor[2] * 3})` }}
        >
          ☢️
        </div>
        
        {/* Fila central */}
        <div className="flex items-center justify-center text-zinc-600">←</div>
        <div 
          className="flex items-center justify-center border border-zinc-600 rounded-full"
          style={{ backgroundColor: `rgb(${HABITATS.oasis.bgColor[0] * 3}, ${HABITATS.oasis.bgColor[1] * 3}, ${HABITATS.oasis.bgColor[2] * 3})` }}
        >
          💧
        </div>
        <div className="flex items-center justify-center text-zinc-600">→</div>
        
        {/* Fila inferior */}
        <div 
          className="flex items-center justify-center rounded-bl border border-zinc-700"
          style={{ backgroundColor: `rgb(${HABITATS.volcanic.bgColor[0] * 3}, ${HABITATS.volcanic.bgColor[1] * 3}, ${HABITATS.volcanic.bgColor[2] * 3})` }}
        >
          🌋
        </div>
        <div className="flex items-center justify-center text-zinc-600">↓</div>
        <div 
          className="flex items-center justify-center rounded-br border border-zinc-700"
          style={{ backgroundColor: `rgb(${HABITATS.desert.bgColor[0] * 3}, ${HABITATS.desert.bgColor[1] * 3}, ${HABITATS.desert.bgColor[2] * 3})` }}
        >
          🏜️
        </div>
      </div>

      {/* Lista con posiciones */}
      <div className="text-[10px] text-zinc-400 space-y-0.5">
        {HABITAT_LAYOUT.map(({ habitat, label }) => {
          const h = HABITATS[habitat];
          return (
            <div key={habitat} className="flex justify-between">
              <span>{h.emoji} {h.name}</span>
              <span className="text-zinc-500">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
