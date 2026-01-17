// Nimbus Automata - Event Log

import { useState, useEffect, useRef } from 'react';
import type { WorldStats } from '../core/types';

interface Event {
  id: number;
  generation: number;
  message: string;
  type: 'birth' | 'death' | 'mutation' | 'extinction' | 'boom' | 'info';
}

interface EventLogProps {
  stats: WorldStats;
  maxEvents?: number;
}

export function EventLog({ stats, maxEvents = 50 }: EventLogProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const prevStats = useRef<WorldStats | null>(null);
  const eventId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!prevStats.current) {
      prevStats.current = stats;
      return;
    }

    const prev = prevStats.current;
    const newEvents: Event[] = [];

    // Detect significant events
    if (stats.births > 50) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `🎉 Baby boom! ${stats.births} nacimientos`,
        type: 'boom',
      });
    }

    if (stats.deaths > 50) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `💀 Extinción masiva: ${stats.deaths} muertes`,
        type: 'extinction',
      });
    }

    // Population milestones
    if (stats.population > 0 && prev.population === 0) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: '🌱 ¡La vida emerge!',
        type: 'birth',
      });
    }

    if (stats.population === 0 && prev.population > 0) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: '☠️ Extinción total',
        type: 'extinction',
      });
    }

    // Color evolution
    const colorDiff = Math.abs(stats.dominantColor[0] - prev.dominantColor[0]) +
                      Math.abs(stats.dominantColor[1] - prev.dominantColor[1]) +
                      Math.abs(stats.dominantColor[2] - prev.dominantColor[2]);
    if (colorDiff > 30 && stats.generation > 10) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `🎨 Evolución de color: rgb(${stats.dominantColor.join(', ')})`,
        type: 'mutation',
      });
    }

    // Mutation rate changes
    const mutDiff = Math.abs(stats.avgMutationRate - prev.avgMutationRate);
    if (mutDiff > 0.02) {
      const direction = stats.avgMutationRate > prev.avgMutationRate ? '📈' : '📉';
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `${direction} Tasa de mutación: ${(stats.avgMutationRate * 100).toFixed(1)}%`,
        type: 'mutation',
      });
    }

    // Generation milestones
    if (stats.generation > 0 && stats.generation % 100 === 0) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `🏁 Generación ${stats.generation} alcanzada`,
        type: 'info',
      });
    }

    if (newEvents.length > 0) {
      setEvents(prev => [...newEvents, ...prev].slice(0, maxEvents));
    }

    prevStats.current = { ...stats };
  }, [stats, maxEvents]);

  // Auto-scroll
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [events]);

  const typeColors: Record<Event['type'], string> = {
    birth: 'text-green-400',
    death: 'text-red-400',
    mutation: 'text-purple-400',
    extinction: 'text-orange-400',
    boom: 'text-cyan-400',
    info: 'text-zinc-400',
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-3 h-48 flex flex-col">
      <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-2">
        📜 Eventos
      </h2>
      <div 
        ref={logRef}
        className="flex-1 overflow-y-auto space-y-1 text-xs font-mono"
      >
        {events.length === 0 ? (
          <p className="text-zinc-600 italic">Esperando eventos...</p>
        ) : (
          events.map(event => (
            <div key={event.id} className={typeColors[event.type]}>
              <span className="text-zinc-600">[{event.generation}]</span>{' '}
              {event.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
