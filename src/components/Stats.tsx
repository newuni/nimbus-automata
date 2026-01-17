// Nimbus Automata - Stats Panel (Español)

import type { WorldStats } from '../core/types';

interface StatsProps {
  stats: WorldStats;
}

export function Stats({ stats }: StatsProps) {
  const colorStyle = {
    backgroundColor: `rgb(${stats.dominantColor.join(',')})`,
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-3 space-y-2 font-mono text-sm">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
        📊 Estadísticas
      </h2>
      
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Generación" value={stats.generation.toLocaleString()} />
        <Stat label="Población" value={stats.population.toLocaleString()} />
        <Stat label="Nacimientos" value={`+${stats.births}`} className="text-green-400" />
        <Stat label="Muertes" value={`-${stats.deaths}`} className="text-red-400" />
        <Stat label="Energía media" value={stats.avgEnergy.toFixed(1)} />
        <Stat label="Tasa mutación" value={`${(stats.avgMutationRate * 100).toFixed(1)}%`} />
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
        <span className="text-zinc-500 text-xs">Color dominante</span>
        <div 
          className="w-5 h-5 rounded border border-zinc-700"
          style={colorStyle}
        />
        <span className="text-zinc-400 text-xs font-mono">
          ({stats.dominantColor.join(', ')})
        </span>
      </div>
    </div>
  );
}

function Stat({ 
  label, 
  value, 
  className = 'text-zinc-100' 
}: { 
  label: string; 
  value: string; 
  className?: string;
}) {
  return (
    <div>
      <div className="text-zinc-500 text-xs">{label}</div>
      <div className={className}>{value}</div>
    </div>
  );
}
