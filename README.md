# PlainViz

**Plain-text-first data visualization language and toolkit.**

Describe charts as readable text — render them programmatically.

```plainviz
Type: Bar
Title: Monthly Sales

Jan: 20
Feb: 45
Mar: 80
Apr: 60
```

![Monthly Sales Bar Chart](./assets/example-bar.svg)

## Features

- **Chart Types:** Bar, Line, Pie, Area, Donut
- **Multi-series:** Compare multiple data series with comma-separated syntax
- **Flexible Input:** Supports `$1,200`, `45%`, `1,000,000` formatting
- **Multiple Ways to Use:** npm packages, Cloud API, Playground, Markdown plugin

## Quick Start

### Option 1: Playground (No Install)

Try it online at [plainviz.com](https://plainviz.com)

### Option 2: Cloud API (No Install)

```
https://api.plainviz.com/api/render?code=Type:Bar%0AApples:50%0AOranges:30
```

### Option 3: npm Packages

```bash
npm install @plainviz/core @plainviz/render-svg
```

```ts
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const result = parse(`
Type: Bar
Title: Sales

Q1: 100
Q2: 200
`);

if (result.ok) {
  const svg = render(result.ir);
}
```

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](./docs/getting-started.md) | Quick start guide |
| [Syntax Reference](./docs/syntax.md) | Complete syntax guide |
| [Chart Types](./docs/chart-types.md) | All chart types explained |
| [Playground Guide](./docs/playground.md) | Web editor usage |
| [@plainviz/core](./docs/packages/core.md) | Core parser API |
| [@plainviz/render-svg](./docs/packages/render-svg.md) | SVG renderer API |
| [Remark Plugin](./docs/integrations/remark.md) | Markdown integration |
| [Cloud API](./docs/cloud-api.md) | HTTP API reference |
| [Examples](./docs/examples.md) | More examples |

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@plainviz/core](https://www.npmjs.com/package/@plainviz/core) | 0.2.0 | Parser and IR types |
| [@plainviz/render-svg](https://www.npmjs.com/package/@plainviz/render-svg) | 0.2.0 | SVG renderer |
| [remark-plainviz](https://www.npmjs.com/package/remark-plainviz) | 0.1.1 | Remark plugin |

## Why Plain Text?

- Works naturally with **Git and diff**
- Easy to **read, write, and review**
- Survives copy/paste, chat tools, and documentation
- Makes **visual intent explicit**, not hidden in UI state

## Links

- Website: [plainviz.com](https://plainviz.com)
- API: [api.plainviz.com](https://api.plainviz.com/api)
- npm: [@plainviz/core](https://www.npmjs.com/package/@plainviz/core)
- GitHub: [github.com/plainviz/plainviz](https://github.com/plainviz/plainviz)

## Contributing

Issues and conceptual discussions are welcome. Feedback on syntax and mental models is especially useful.

## License

MIT
