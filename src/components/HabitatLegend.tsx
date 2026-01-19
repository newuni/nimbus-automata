// Nimbus Automata - Leyenda de Hábitats

import { HABITATS, HABITAT_LAYOUT } from '../core/Habitat';

export function HabitatLegend() {
  return (
    <div className="bg-zinc-900 rounded-lg p-3">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-2">
        🗺️ Hábitats
      </h2>

      {/* Lista con posiciones y características */}
      <div className="text-[10px] text-zinc-400 space-y-1 mt-1">
        {HABITAT_LAYOUT.map(({ habitat, label }) => {
          const h = HABITATS[habitat];
          // Formatear modificadores
          const mods: string[] = [];
          if (h.energyMultiplier !== 1) {
            const pct = Math.round((h.energyMultiplier - 1) * 100);
            mods.push(`⚡${pct > 0 ? '+' : ''}${pct}%`);
          }
          if (h.mutationMultiplier !== 1) {
            mods.push(`🧬×${h.mutationMultiplier}`);
          }
          if (h.survivalModifier !== 0) {
            mods.push(`🎯${h.survivalModifier > 0 ? '+' : ''}${h.survivalModifier}`);
          }
          if (h.birthModifier !== 0) {
            mods.push(`👶${h.birthModifier > 0 ? '+' : ''}${h.birthModifier}`);
          }
          
          return (
            <div key={habitat} className="border-b border-zinc-800 pb-1">
              <div className="flex justify-between">
                <span className="text-zinc-300">{h.emoji} {h.name}</span>
                <span className="text-zinc-600">{label}</span>
              </div>
              {mods.length > 0 && (
                <div className="text-zinc-500 text-[9px]">
                  {mods.join(' · ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mini leyenda de iconos */}
      <div className="mt-2 pt-1 border-t border-zinc-800 text-[9px] text-zinc-600">
        ⚡energía · 🧬mutación · 🎯supervivencia · 👶nacimiento
      </div>
    </div>
  );
}
