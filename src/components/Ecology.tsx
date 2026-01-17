// Nimbus Automata - Ecology Panel (Manual Catastrophes)

import { CATASTROPHES, type Catastrophe } from '../core/Catastrophe';

interface EcologyProps {
  onTriggerCatastrophe: (catastrophe: Catastrophe) => void;
  disabled?: boolean;
}

export function Ecology({ onTriggerCatastrophe, disabled }: EcologyProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-3">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-2">
        🌍 Ecología
      </h2>
      <p className="text-zinc-600 text-xs mb-2">Desencadenar desgracias:</p>
      <div className="grid grid-cols-3 gap-1.5">
        {CATASTROPHES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onTriggerCatastrophe(cat)}
            disabled={disabled}
            title={cat.description}
            className={`
              flex flex-col items-center gap-0.5 p-2 rounded text-xs
              transition-colors
              ${disabled 
                ? 'bg-zinc-800/50 text-zinc-700 cursor-not-allowed' 
                : 'bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-300'
              }
            `}
          >
            <span className="text-lg">{cat.emoji}</span>
            <span className="text-[10px] leading-tight">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
