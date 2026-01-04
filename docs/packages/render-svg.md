# @plainviz/render-svg

SVG renderer for PlainViz. Converts PlainViz IR into SVG strings.

## Installation

```bash
npm install @plainviz/render-svg
```

**Note:** This package requires `@plainviz/core` for parsing:

```bash
npm install @plainviz/core @plainviz/render-svg
```

## Basic Usage

```ts
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const result = parse(`
Type: Bar
Title: Sales

Q1: 100
Q2: 200
Q3: 150
`);

if (result.ok) {
  const svg = render(result.ir);
  console.log(svg); // SVG string
}
```

## API Reference

### `render(ir: PlainVizIR, options?: RenderOptions): string`

Renders a PlainViz IR to an SVG string.

**Parameters:**
- `ir` - PlainViz IR object from the parser
- `options` - Optional render configuration

**Returns:** SVG string

### RenderOptions

```ts
interface RenderOptions {
  width?: number;           // Chart width in pixels (default: 500)
  height?: number;          // Chart height in pixels (default: 300)
  padding?: number;         // Padding around chart (default: 60)
  colors?: string[];        // Custom color palette
  backgroundColor?: string; // Background color (default: '#1e1e2e')
  textColor?: string;       // Text color (default: '#cdd6f4')
  gridColor?: string;       // Grid line color (default: '#313244')
}
```

### Chart-Specific Renderers

You can also use chart-specific render functions:

```ts
import {
  renderBarChart,
  renderLineChart,
  renderPieChart,
  renderAreaChart,
  renderDonutChart
} from '@plainviz/render-svg';
```

Each function has the same signature as `render()`.

## Examples

### Default Rendering

```ts
const svg = render(result.ir);
// Uses default dark theme (Catppuccin Mocha)
```

### Custom Dimensions

```ts
const svg = render(result.ir, {
  width: 800,
  height: 400,
});
```

### Light Theme

```ts
const svg = render(result.ir, {
  backgroundColor: '#ffffff',
  textColor: '#1e1e2e',
  gridColor: '#e0e0e0',
});
```

### Custom Colors

```ts
const svg = render(result.ir, {
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
});
```

### Full Customization

```ts
const svg = render(result.ir, {
  width: 600,
  height: 350,
  padding: 40,
  colors: ['#3498db', '#e74c3c', '#2ecc71'],
  backgroundColor: '#f8f9fa',
  textColor: '#2c3e50',
  gridColor: '#dee2e6',
});
```

## Default Color Palette

The default color palette uses Catppuccin Mocha colors:

```ts
const DEFAULT_COLORS = [
  '#89b4fa', // Blue
  '#a6e3a1', // Green
  '#f9e2af', // Yellow
  '#f38ba8', // Red
  '#cba6f7', // Mauve
  '#fab387', // Peach
];
```

## Save to File (Node.js)

```ts
import { writeFileSync } from 'fs';
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const result = parse(`
Type: Line
Title: Monthly Traffic

Jan: 1000
Feb: 1500
Mar: 2000
`);

if (result.ok) {
  const svg = render(result.ir);
  writeFileSync('chart.svg', svg);
}
```

## Use in Browser

```ts
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const result = parse(code);

if (result.ok) {
  const svg = render(result.ir);
  document.getElementById('chart').innerHTML = svg;
}
```

## Use in React

```tsx
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

function Chart({ code }: { code: string }) {
  const result = parse(code);

  if (!result.ok) {
    return <div>Error: {result.errors[0].message}</div>;
  }

  const svg = render(result.ir);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

## SVG Output

The renderer produces clean, valid SVG:

- Uses `viewBox` for responsive scaling
- System font stack for cross-platform compatibility
- Accessible text labels
- No external dependencies

Example output structure:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" style="background-color: #1e1e2e;">
  <text>Title</text>
  <!-- Chart elements -->
</svg>
```

## TypeScript Support

Full TypeScript definitions included:

```ts
import type { RenderOptions } from '@plainviz/render-svg';
import type { PlainVizIR } from '@plainviz/core';

const options: RenderOptions = {
  width: 600,
  height: 400,
};

function renderChart(ir: PlainVizIR): string {
  return render(ir, options);
}
```

## Related

- [@plainviz/core](./core.md) - Parser
- [Chart Types](../chart-types.md) - All supported chart types
