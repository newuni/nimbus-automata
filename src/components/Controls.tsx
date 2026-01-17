// Nimbus Automata - Controls (Español)

interface ControlsProps {
  isRunning: boolean;
  speed: number;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onClear: () => void;
  onSpeedChange: (speed: number) => void;
  onShowRules: () => void;
}

export function Controls({
  isRunning,
  speed,
  onPlayPause,
  onStep,
  onReset,
  onClear,
  onSpeedChange,
  onShowRules,
}: ControlsProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-3 space-y-3">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
        🎮 Controles
      </h2>

      <div className="flex gap-2">
        <Button onClick={onPlayPause} primary>
          {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </Button>
        <Button onClick={onStep} disabled={isRunning}>
          ⏭ Paso
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={onReset}>🔄 Reiniciar</Button>
        <Button onClick={onClear}>🗑 Limpiar</Button>
      </div>

      <div className="space-y-1">
        <label className="text-zinc-500 text-xs flex justify-between">
          <span>Velocidad</span>
          <span>{speed} gen/s</span>
        </label>
        <input
          type="range"
          min="1"
          max="60"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      <Button onClick={onShowRules} className="w-full">
        📖 Ver Reglas
      </Button>
    </div>
  );
}

function Button({
  children,
  onClick,
  disabled = false,
  primary = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  className?: string;
}) {
  const baseClasses = 'px-3 py-2 rounded text-sm font-medium transition-colors flex-1';
  const primaryClasses = primary
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${primaryClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
