// Nimbus Automata - Leyenda de Hábitats

import { HABITATS } from '../core/Habitat';

export function HabitatLegend() {
  const habitats = Object.values(HABITATS);

  return (
    <div className="bg-zinc-900 rounded-lg p-3">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-2">
        🗺️ Hábitats
      </h2>
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {habitats.map((h) => (
          <div 
            key={h.id} 
            className="flex items-center gap-1.5 px-1.5 py-1 rounded"
            style={{ backgroundColor: `rgb(${h.bgLuminosity}, ${h.bgLuminosity}, ${Math.floor(h.bgLuminosity * 1.1)})` }}
          >
            <span>{h.emoji}</span>
            <span className="text-zinc-300 truncate">{h.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-zinc-800 text-zinc-500 text-[10px] space-y-0.5">
        <div>💧 Oasis: +50% energía, -50% mutación</div>
        <div>🏜️ Desierto: -40% energía, presión alta</div>
        <div>☢️ Radiactivo: mutación x3</div>
        <div>🌋 Volcánico: +80% energía, inestable</div>
        <div>❄️ Glacial: lento pero resiliente</div>
      </div>
    </div>
  );
}
