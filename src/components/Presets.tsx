// Nimbus Automata - Preset Selector

import { PRESETS, type Preset } from '../core/Presets';

interface PresetsProps {
  onSelect: (preset: Preset) => void;
}

export function PresetsSelector({ onSelect }: PresetsProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-3">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-2">
        🎨 Patrón Inicial
      </h2>
      <div className="grid grid-cols-4 gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            title={preset.description}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded text-xs
              transition-colors bg-zinc-800 hover:bg-emerald-900/50 
              text-zinc-400 hover:text-emerald-300"
          >
            <span className="text-base">{preset.emoji}</span>
            <span className="text-[9px] leading-tight truncate w-full text-center">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
