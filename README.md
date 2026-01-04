# PlainViz

PlainViz is a **plain-text-first data visualization language and toolkit**.

It lets you describe charts as readable text — and render them programmatically.

**Supports:** Bar, Line, Pie, Area, Donut charts — with multi-series comparison
**Status:** early stage (APIs and syntax may change)

---

## 15-Second Example

```plainviz
Type: Bar
Title: Monthly Sales

Jan: 20
Feb: 45
Mar: 80
Apr: 60
```

**Renders to:**

![Monthly Sales Bar Chart](./assets/example-bar.svg)

---

## Multi-Series Comparison

Compare multiple data series with a simple comma-separated syntax:

```plainviz
Type: Bar
Title: Revenue Comparison
Legend: Alibaba, Tencent

Revenue: 100, 80
Profit: 30, 25
Growth: 15, 12
```

```plainviz
Type: Line
Title: Quarterly Trends
Legend: 2023, 2024

Q1: 100, 120
Q2: 110, 140
Q3: 130, 160
Q4: 150, 180
```

---

## Installation

```bash
# Core packages
npm install @plainviz/core @plainviz/render-svg

# For Markdown/Remark integration
npm install remark-plainviz
```

---

## Usage

### JavaScript / TypeScript

```ts
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const input = `
Type: Bar
Title: Sales

Q1: 100
Q2: 200
Q3: 150
`;

const result = parse(input);

if (result.ok) {
  const svg = render(result.ir);
  console.log(svg); // SVG string
}
```

### CLI

```bash
# Clone the repo, then:
node --import tsx scripts/render-svg.mjs examples/01-basic.pv > chart.svg
```

### Markdown (Remark Plugin)

```js
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkPlainViz from 'remark-plainviz';

const markdown = `
# Report

\`\`\`plainviz
Type: Bar
Title: Q1 Results

Product A: 500
Product B: 750
\`\`\`
`;

const result = await remark()
  .use(remarkPlainViz)
  .use(remarkHtml)
  .process(markdown);

// plainviz code blocks are replaced with SVG charts
```

---

## Syntax

### Single Series

```plainviz
Type: Bar              # Chart type: bar, line, pie, area, donut
Title: "Chart Title"   # Optional title
Subtitle: "Subtitle"   # Optional subtitle

# Data (label: value)
Product A: 500
Product B: $1,200      # $ and commas are auto-cleaned
Product C: 45%         # % is auto-cleaned
```

### Multi-Series

```plainviz
Type: Bar
Title: Company Comparison
Legend: Company A, Company B    # Define series names

Revenue: 100, 80                # Values separated by comma
Profit: 30, 25
Growth: 15%, 12%
```

**Features:**
- `Legend:` defines series names (defaults to "Series 1, Series 2" if omitted)
- Supports both English `,` and Chinese `，` commas
- Number formatting preserved (`$1,200` won't be split)

---

## Packages

| Package | Description |
|---------|-------------|
| [`@plainviz/core`](https://www.npmjs.com/package/@plainviz/core) | Parser and IR types |
| [`@plainviz/render-svg`](https://www.npmjs.com/package/@plainviz/render-svg) | SVG renderer |
| [`remark-plainviz`](https://www.npmjs.com/package/remark-plainviz) | Remark plugin for Markdown |

---

## Project Structure

```
plainviz/
├── packages/
│   ├── core/           # @plainviz/core
│   ├── render-svg/     # @plainviz/render-svg
│   └── remark-plainviz/
├── apps/
│   └── playground/     # Web playground (Vite + React)
├── examples/           # .pv example files
└── scripts/            # CLI tools
```

---

## Why Plain Text?

* Works naturally with **Git and diff**
* Easy to **read, write, and review**
* Survives copy/paste, chat tools, and documentation
* Makes **visual intent explicit**, not hidden in UI state

---

## Links

* npm: [@plainviz/core](https://www.npmjs.com/package/@plainviz/core)
* GitHub: [github.com/PlainViz/plainviz](https://github.com/PlainViz/plainviz)
* Website: [plainviz.com](https://plainviz.com)

---

## Contributing

* Issues and conceptual discussions are welcome
* Feedback on syntax and mental models is especially useful

---

## License

MIT
