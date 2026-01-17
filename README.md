# 🐙 Nimbus Automata

**Game of Life con Evolución Genética** — Una versión evolucionada del autómata celular de Conway donde cada célula tiene su propio ADN.

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://nimbus-automata.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/nimbus-automata/deploy-status)](https://nimbus-automata.netlify.app/)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## 🎮 Demo

**👉 [nimbus-automata.netlify.app](https://nimbus-automata.netlify.app/)**

## ✨ Características

- 🧬 **Genética real**: Cada célula tiene ADN único con 7 genes diferentes
- 🔄 **Herencia**: Los hijos heredan genes de 2 padres mediante crossover
- 🎲 **Mutaciones**: Los genes pueden mutar al reproducirse
- 🎨 **Colores evolutivos**: Los colores se heredan y mezclan visualmente
- ⚡ **Energía**: Las células tienen vida limitada y pueden robar energía
- 📊 **Estadísticas en tiempo real**: Población, nacimientos, muertes, color dominante
- 🖱️ **Interactivo**: Haz clic para crear/destruir células
- 📱 **Responsive**: Funciona en desktop y móvil

## 🧬 ¿Qué lo hace diferente?

### Game of Life Clásico (Conway)
Todas las células siguen las **mismas reglas**:
- Supervivencia: 2-3 vecinos
- Nacimiento: exactamente 3 vecinos

### Nimbus Automata (Genético)
Cada célula tiene su **propio genoma**:

| Gen | Clásico | Genético | Efecto |
|-----|---------|----------|--------|
| `survivalMin` | 2 | 1-4 | Mínimo de vecinos para sobrevivir |
| `survivalMax` | 3 | 2-6 | Máximo de vecinos para sobrevivir |
| `birthCount` | 3 | 2-5 | Vecinos necesarios para nacer |
| `mutationRate` | — | 0-20% | Probabilidad de mutación |
| `color` | — | RGB | Color heredable (se mezcla) |
| `energy` | ∞ | 50-150 | Vida máxima |
| `aggressiveness` | — | 0-30% | Roba energía de vecinos |
| `resilience` | — | 30-70% | Resistencia a morir |

## 🔄 Ciclo de Vida

```
┌─────────────────────────────────────────────────────┐
│  NACIMIENTO                                         │
│  ├─ Se eligen 2 padres de los vecinos vivos        │
│  ├─ Crossover: genes aleatorios de cada padre      │
│  └─ Mutación: cada gen puede mutar                 │
├─────────────────────────────────────────────────────┤
│  VIDA                                               │
│  ├─ Cada tick consume 1 energía                    │
│  ├─ Agresividad roba energía de vecinos            │
│  └─ Color visible con opacidad según energía       │
├─────────────────────────────────────────────────────┤
│  MUERTE                                             │
│  ├─ Muy pocos vecinos (< survivalMin)              │
│  ├─ Demasiados vecinos (> survivalMax)             │
│  ├─ Energía agotada                                │
│  └─ Resiliencia puede salvar temporalmente         │
└─────────────────────────────────────────────────────┘
```

## 📊 Qué Observar

- **🎨 Color dominante**: Evoluciona según qué linajes sobreviven mejor
- **📈 Tasa de mutación**: ¿Las poblaciones estables tienen menos mutación?
- **💥 Ciclos**: Observa patrones de boom y extinción
- **🗺️ Especiación**: Pueden formarse "especies" con colores distintos en diferentes zonas

## 🚀 Desarrollo Local

```bash
# Clonar
git clone https://github.com/newuni/nimbus-automata.git
cd nimbus-automata

# Instalar dependencias
npm install

# Desarrollo (hot reload)
npm run dev

# Build producción
npm run build

# Preview del build
npm run preview
```

## 🏗️ Tech Stack

- **React 19** — UI declarativa
- **TypeScript 5** — Tipado estático
- **Vite 7** — Build ultrarrápido
- **Tailwind CSS 4** — Estilos utility-first
- **Canvas API** — Renderizado de alta performance

## 📁 Estructura

```
src/
├── core/           # Lógica del juego
│   ├── types.ts    # Tipos TypeScript
│   ├── Genome.ts   # Crossover, mutación, fitness
│   └── World.ts    # Simulación y grid
├── components/     # UI React
│   ├── Canvas.tsx  # Renderizado del grid
│   ├── Controls.tsx
│   ├── Stats.tsx
│   └── RulesModal.tsx
├── hooks/
│   └── useSimulation.ts  # Estado y lógica de simulación
└── App.tsx         # Componente principal
```

## 🌐 Deploy

El proyecto incluye `netlify.toml` para deploy automático:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Cualquier push a `main` despliega automáticamente.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Algunas ideas:

- [ ] Modo sandbox con reglas personalizables
- [ ] Guardar/cargar estados
- [ ] Patrones predefinidos (gliders, etc.)
- [ ] Gráficas de evolución temporal
- [ ] Web Workers para mejor performance
- [ ] Modo "especies" con territorios

## 📄 Licencia

MIT © [newuni](https://github.com/newuni)

---

<p align="center">
  Hecho con 🐙 por <strong>Nimbus</strong> & <strong>newuni</strong>
</p>
