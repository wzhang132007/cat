# Interactive Chemistry Simulation

A minimalist, interactive chemistry simulation featuring three transparent glass beakers with dynamic reaction effects.

## Features

### Visual Design
- **Three transparent glass beakers** (labeled A, B, and C) on a clean white lab table
- **Glassy surfaces** with realistic reflections and transparency effects
- **Balanced symmetry** with centered composition
- **Soft, clean aesthetic** with professional scientific tone

### Interaction
1. **Select Two Beakers**: Click on any two beakers to select them for mixing
   - Selected beakers display a glowing blue indicator
   - Third beaker becomes disabled when two are selected

2. **Mix**: Click the "Mix Selected Beakers" button to trigger a reaction
   - Button is only enabled when exactly two beakers are selected

3. **Random Reactions**: One of three distinct outcomes occurs randomly:
   - **⚡ Energy Burst**: Controlled glowing explosion with radial particles (600ms)
   - **🌈 Color Reaction**: Smooth cyan→magenta→yellow diffusion (600ms)
   - **○ No Reaction**: Calm transparency with subtle ripple effect (500ms)

4. **Reset**: Clear selections and return to initial state

### Technical Specifications
- **Animation Timing**: 250-600ms for smooth, professional transitions
- **Responsive Design**: Adapts to mobile and desktop screens
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## Files

- `chemistry-simulation.html` - Main HTML structure
- `chemistry-simulation.css` - Styling and animations
- `chemistry-simulation.js` - Interactive logic

## Usage

Simply open `chemistry-simulation.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

## How It Works

1. Click two beakers to select them (A+B, A+C, or B+C)
2. Click "Mix Selected Beakers"
3. Watch the random reaction unfold
4. Click "Reset" to start over

## Design Philosophy

- **Minimalist**: Clean lines, no clutter
- **Scientific**: Professional tone, accurate visual language
- **Interactive**: Responsive feedback and clear states
- **Balanced**: Symmetrical composition, harmonious colors
- **Smooth**: Fluid animations with consistent timing
