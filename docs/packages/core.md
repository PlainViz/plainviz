# @plainviz/core

The core parser package for PlainViz. Parses PlainViz syntax into an Intermediate Representation (IR) that can be consumed by renderers.

## Installation

```bash
npm install @plainviz/core
```

## Basic Usage

```ts
import { parse } from '@plainviz/core';

const code = `
Type: Bar
Title: Sales

Q1: 100
Q2: 200
Q3: 150
`;

const result = parse(code);

if (result.ok) {
  console.log(result.ir);
  // {
  //   type: 'bar',
  //   title: 'Sales',
  //   labels: ['Q1', 'Q2', 'Q3'],
  //   values: [100, 200, 150]
  // }
} else {
  console.error(result.errors);
}
```

## API Reference

### `parse(input: string): ParseResult`

Parses a PlainViz string into an IR object.

**Parameters:**
- `input` - PlainViz code string

**Returns:** `ParseResult`

```ts
type ParseResult =
  | { ok: true; ir: PlainVizIR }
  | { ok: false; errors: ParseError[] };
```

## Type Definitions

### PlainVizIR

The Intermediate Representation of a parsed chart.

```ts
interface PlainVizIR {
  type: ChartType;
  title?: string;
  subtitle?: string;
  labels: string[];
  values: number[];
  series?: DataSeries[];
  meta?: {
    xAxis?: string;
    yAxis?: string;
    theme?: string;
    colors?: string[];
  };
}
```

### ChartType

```ts
type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut';
```

### DataSeries

For multi-series charts:

```ts
interface DataSeries {
  name: string;
  values: number[];
  color?: string;
}
```

### ParseError

```ts
interface ParseError {
  line: number;
  message: string;
  hint?: string;
  source?: string;
}
```

## Examples

### Single Series

```ts
import { parse } from '@plainviz/core';

const result = parse(`
Type: Pie
Title: Market Share

Apple: 45
Samsung: 30
Others: 25
`);

if (result.ok) {
  console.log(result.ir);
  // {
  //   type: 'pie',
  //   title: 'Market Share',
  //   labels: ['Apple', 'Samsung', 'Others'],
  //   values: [45, 30, 25]
  // }
}
```

### Multi-Series

```ts
import { parse } from '@plainviz/core';

const result = parse(`
Type: Bar
Title: Revenue Comparison
Legend: 2023, 2024

Q1: 100, 120
Q2: 150, 180
Q3: 200, 240
`);

if (result.ok) {
  console.log(result.ir.series);
  // [
  //   { name: '2023', values: [100, 150, 200] },
  //   { name: '2024', values: [120, 180, 240] }
  // ]
}
```

### Error Handling

```ts
import { parse } from '@plainviz/core';

const result = parse(`
Type: Bar

Invalid line without colon
Apples: fifty
`);

if (!result.ok) {
  result.errors.forEach(error => {
    console.log(`Line ${error.line}: ${error.message}`);
    if (error.hint) {
      console.log(`  Hint: ${error.hint}`);
    }
  });
  // Line 4: Missing ':' separator
  //   Hint: Each line should be "Label: Value", e.g., "Sales: 100"
  // Line 5: "fifty" is not a valid number
  //   Hint: Use a number like: Apples: 100
}
```

### With Number Formatting

```ts
import { parse } from '@plainviz/core';

const result = parse(`
Type: Bar

Revenue: $1,200
Growth: 45%
Users: 1,000,000
`);

if (result.ok) {
  console.log(result.ir.values);
  // [1200, 45, 1000000]
}
```

## Usage with Renderers

The IR output is designed to be consumed by renderers:

```ts
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const result = parse(code);

if (result.ok) {
  const svg = render(result.ir);
}
```

## TypeScript Support

The package includes full TypeScript definitions. Import types directly:

```ts
import type {
  PlainVizIR,
  ParseResult,
  ParseError,
  ChartType,
  DataSeries
} from '@plainviz/core';
```

## Related

- [@plainviz/render-svg](./render-svg.md) - SVG renderer
- [Syntax Reference](../syntax.md) - Complete syntax guide
