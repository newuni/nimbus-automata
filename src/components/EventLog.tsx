// Nimbus Automata - Event Log (Color Dominance Tracker)

import { useState, useEffect, useRef } from 'react';
import type { WorldStats } from '../core/types';
import type { CatastropheEvent } from '../core/World';

type EventType = 'catastrophe' | 'dominance' | 'population' | 'milestone' | 'extinction';

interface Event {
  id: number;
  generation: number;
  message: string;
  color: [number, number, number];
  population: number;
  type: EventType;
}

interface EventLogProps {
  stats: WorldStats;
  lastCatastrophe: CatastropheEvent | null;
  maxEvents?: number;
}

function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]);
}

function colorName(color: [number, number, number]): string {
  const [r, g, b] = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  if (max - min < 40) {
    if (max > 180) return 'Blanco';
    if (max < 80) return 'Negro';
    return 'Gris';
  }
  
  if (r >= g && r >= b) {
    if (r - g < 30 && g > b + 30) return 'Amarillo';
    if (r - b < 30 && b > g + 30) return 'Magenta';
    return 'Rojo';
  }
  if (g >= r && g >= b) {
    if (g - r < 30 && r > b + 30) return 'Amarillo';
    if (g - b < 30 && b > r + 30) return 'Cian';
    return 'Verde';
  }
  if (b >= r && b >= g) {
    if (b - r < 30 && r > g + 30) return 'Magenta';
    if (b - g < 30 && g > r + 30) return 'Cian';
    return 'Azul';
  }
  
  return 'Color';
}

const FILTER_CONFIG: { type: EventType; emoji: string; label: string }[] = [
  { type: 'catastrophe', emoji: '🌋', label: 'Catástrofes' },
  { type: 'dominance', emoji: '👑', label: 'Dominancia' },
  { type: 'population', emoji: '📊', label: 'Población' },
  { type: 'milestone', emoji: '🏁', label: 'Hitos' },
  { type: 'extinction', emoji: '☠️', label: 'Extinción' },
];

export function EventLog({ stats, lastCatastrophe, maxEvents = 50 }: EventLogProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Set<EventType>>(new Set(['catastrophe', 'dominance', 'population', 'milestone', 'extinction']));
  const prevStats = useRef<WorldStats | null>(null);
  const eventId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (type: EventType) => {
    setFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!prevStats.current) {
      if (stats.population > 0) {
        setEvents([{
          id: eventId.current++,
          generation: stats.generation,
          message: `🏁 Inicio: ${colorName(stats.dominantColor)}`,
          color: stats.dominantColor,
          population: stats.population,
          type: 'milestone',
        }]);
      }
      prevStats.current = { ...stats };
      return;
    }

    const prev = prevStats.current;
    const newEvents: Event[] = [];

    // Detect significant color change (new dominant color)
    const colorChanged = colorDistance(stats.dominantColor, prev.dominantColor) > 60;
    
    if (colorChanged && stats.generation > 0) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `👑 ${colorName(stats.dominantColor)} domina`,
        color: stats.dominantColor,
        population: stats.population,
        type: 'dominance',
      });
    }

    // Population milestones (every 25% change)
    const popChange = Math.abs(stats.population - prev.population) / Math.max(prev.population, 1);
    if (popChange > 0.25 && stats.generation > 5) {
      const emoji = stats.population > prev.population ? '📈' : '📉';
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `${emoji} Población: ${stats.population}`,
        color: stats.dominantColor,
        population: stats.population,
        type: 'population',
      });
    }

    // Extinction
    if (stats.population === 0 && prev.population > 0) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: '☠️ Extinción total',
        color: [128, 128, 128],
        population: 0,
        type: 'extinction',
      });
    }

    // Generation milestones
    if (stats.generation > 0 && stats.generation % 200 === 0) {
      newEvents.push({
        id: eventId.current++,
        generation: stats.generation,
        message: `🏁 Gen ${stats.generation}`,
        color: stats.dominantColor,
        population: stats.population,
        type: 'milestone',
      });
    }

    if (newEvents.length > 0) {
      setEvents(prev => [...newEvents, ...prev].slice(0, maxEvents));
    }

    prevStats.current = { ...stats };
  }, [stats, maxEvents]);

  // Handle catastrophes
  const lastCatastropheId = useRef<number | null>(null);
  useEffect(() => {
    if (lastCatastrophe && lastCatastrophe.generation !== lastCatastropheId.current) {
      lastCatastropheId.current = lastCatastrophe.generation;
      const newEvent: Event = {
        id: eventId.current++,
        generation: lastCatastrophe.generation,
        message: `${lastCatastrophe.catastrophe.emoji} ${lastCatastrophe.catastrophe.name}: ${lastCatastrophe.affected}`,
        color: lastCatastrophe.dominantColor,
        population: stats.population,
        type: 'catastrophe',
      };
      setEvents(prev => [newEvent, ...prev].slice(0, maxEvents));
    }
  }, [lastCatastrophe, stats.population, maxEvents]);

  // Reset events when generation goes back to 0
  useEffect(() => {
    if (stats.generation === 0) {
      setEvents([]);
      prevStats.current = null;
      lastCatastropheId.current = null;
    }
  }, [stats.generation]);

  const filteredEvents = events.filter(e => filters.has(e.type));

  return (
    <div className="bg-zinc-900 rounded-lg p-3 h-40 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
          📜 Historia
        </h2>
        <div className="flex gap-1">
          {FILTER_CONFIG.map(({ type, emoji, label }) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              title={label}
              className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                filters.has(type) 
                  ? 'bg-zinc-700 text-white' 
                  : 'bg-zinc-800 text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div 
        ref={logRef}
        className="flex-1 overflow-y-auto space-y-1 text-xs font-mono"
      >
        {filteredEvents.length === 0 ? (
          <p className="text-zinc-600 italic">
            {events.length === 0 ? 'Esperando evolución...' : 'Sin eventos con filtros actuales'}
          </p>
        ) : (
          filteredEvents.map(event => (
            <div 
              key={event.id} 
              className={`flex items-center gap-2 ${event.type === 'catastrophe' ? 'bg-red-950/50 -mx-2 px-2 py-0.5 rounded' : ''}`}
            >
              <span className="text-zinc-600 w-8 text-right flex-shrink-0">{event.generation}</span>
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: `rgb(${event.color.join(',')})` }}
              />
              <span className={event.type === 'catastrophe' ? 'text-red-300' : 'text-zinc-300'}>
                {event.message}
              </span>
              <span className="text-zinc-600 ml-auto flex-shrink-0">{event.population}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
