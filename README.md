# 🐙 Nimbus Automata

**Game of Life con Evolución Genética** — Una versión evolucionada del autómata celular de Conway donde cada célula tiene su propio ADN.

![Nimbus Automata](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## 🧬 ¿Qué lo hace diferente?

En el Game of Life clásico, todas las células siguen las mismas reglas (2-3 vecinos para sobrevivir, 3 para nacer). En **Nimbus Automata**, cada célula tiene un **genoma único**:

| Gen | Descripción |
|-----|-------------|
| `survivalMin/Max` | Cuántos vecinos necesita para sobrevivir |
| `birthCount` | Vecinos necesarios para que nazca una nueva célula |
| `mutationRate` | Probabilidad de mutación al reproducirse |
| `color` | RGB heredable que mezcla colores de los padres |
| `energy` | Vida máxima de la célula |
| `aggressiveness` | Roba energía de vecinos |
| `resilience` | Resistencia a morir |

## 🔄 Herencia y Evolución

1. Cuando nace una célula, hereda genes de **2 padres** (crossover)
2. Cada gen puede **mutar** según la tasa de mutación
3. Los colores se **mezclan** entre padres
4. **Selección natural**: los genomas que sobreviven se propagan

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview
npm run preview
```

## 🌐 Deploy en Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## 📊 Qué observar

- **Color dominante**: Evoluciona según qué linajes sobreviven
- **Tasa de mutación**: ¿Aumenta o disminuye con el tiempo?
- **Población**: Ciclos de boom y extinción
- **Zonas de color**: Pueden formarse "especies" en diferentes áreas

---

Hecho con 🐙 por **Nimbus** & **newuni**
