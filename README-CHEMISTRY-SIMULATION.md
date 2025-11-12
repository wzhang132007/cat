# Interactive Chemistry Simulation

A minimalist, interactive chemistry simulation featuring six transparent glass beakers with customizable solutions and dynamic reaction effects based on chemical combinations.

## Features

### Visual Design
- **Six transparent glass beakers** (labeled A through F) on a clean white lab table
- **Solution selection panel** with six different chemical types
- **Glassy surfaces** with realistic reflections and transparency effects
- **Balanced composition** with responsive layout
- **Soft, clean aesthetic** with professional scientific tone

### Available Solutions
1. **Acid** - Red liquid with acidic properties
2. **Base** - Blue liquid with alkaline properties
3. **Salt** - Green liquid representing ionic compounds
4. **Water** - Clear liquid as universal solvent
5. **Organic** - Yellow liquid representing organic compounds
6. **Indicator** - Purple liquid for pH detection

### Interaction Flow
1. **Select a Solution**: Click on any solution from the panel (Acid, Base, Salt, Water, Organic, Indicator)
   - Selected solution highlights with a blue glow

2. **Fill Beakers**: Click on empty beakers to fill them with the selected solution
   - Liquid pours in with animation (500ms)
   - Beaker displays the solution name and color
   - Solution selection auto-clears after filling

3. **Select Beakers to Mix**: Click on two filled beakers to select them for mixing
   - Selected beakers display a glowing blue indicator
   - Other beakers become disabled when two are selected

4. **Mix**: Click the "Mix Selected Beakers" button to trigger a reaction
   - Button is only enabled when exactly two filled beakers are selected
   - Reaction outcome depends on the solution combination

5. **Chemical Reactions**: Different solution combinations produce varied outcomes:
   - **Neutralization** (Acid + Base): Color change reaction
   - **Exothermic Reactions**: Energy burst with heat release
   - **Gas Evolution**: Vigorous energy burst effect
   - **Precipitation**: Color change with solid formation
   - **Phase Separation**: Calm reaction showing immiscibility
   - **Saponification** (Base + Organic): Soap formation with energy release
   - **Esterification** (Acid + Organic): Ester formation with color change
   - **Color Changes**: Indicator reactions showing pH changes
   - **No Reaction**: Subtle ripple effect

6. **Reset**: Clear all selections and empty all beakers to start fresh

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

1. Select a solution type (Acid, Base, Salt, Water, Organic, or Indicator)
2. Click empty beakers to fill them with the selected solution
3. Click two filled beakers to select them for mixing
4. Click "Mix Selected Beakers"
5. Watch the reaction based on the chemical combination
6. Click "Reset" to empty all beakers and start over

## Reaction Matrix

The simulation uses a reaction matrix to determine outcomes based on solution combinations:
- Each pair of solutions has 3 possible reactions that occur randomly
- Reactions range from vigorous (energy bursts) to calm (no reaction)
- Chemical realism is loosely followed for educational entertainment

## Design Philosophy

- **Minimalist**: Clean lines, no clutter
- **Scientific**: Professional tone, accurate visual language
- **Interactive**: Responsive feedback and clear states
- **Balanced**: Symmetrical composition, harmonious colors
- **Smooth**: Fluid animations with consistent timing
