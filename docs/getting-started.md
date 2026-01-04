# Getting Started

PlainViz lets you create charts using simple, readable text. This guide covers the three main ways to use PlainViz.

## Choose Your Method

| Method | Best For | Install Required |
|--------|----------|------------------|
| [Playground](#playground) | Quick exploration, sharing | No |
| [Cloud API](#cloud-api) | Embedding in docs, websites | No |
| [npm Packages](#npm-packages) | Integration in apps | Yes |

---

## Playground

The easiest way to try PlainViz. No installation required.

1. Go to [plainviz.com](https://plainviz.com)
2. Edit the code in the left panel
3. See the chart update in real-time

The Playground includes example templates for all chart types.

---

## Cloud API

Render charts via HTTP without installing anything.

### Basic Usage

```
GET https://api.plainviz.com/api/render?code=<URL-encoded-code>
```

### Example

```
https://api.plainviz.com/api/render?code=Type:Bar%0AApples:50%0AOranges:30
```

### Embed in HTML

```html
<img src="https://api.plainviz.com/api/render?code=Type:Bar%0ASales:100%0ACosts:60" alt="Chart" />
```

### Embed in Markdown

```markdown
![Chart](https://api.plainviz.com/api/render?code=Type:Bar%0AQ1:100%0AQ2:150)
```

See [Cloud API Reference](./cloud-api.md) for full documentation.

---

## npm Packages

For integration into your JavaScript/TypeScript projects.

### Installation

```bash
npm install @plainviz/core @plainviz/render-svg
```

### Basic Usage

```ts
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const code = `
Type: Bar
Title: Monthly Sales

Jan: 100
Feb: 150
Mar: 200
`;

const result = parse(code);

if (result.ok) {
  const svg = render(result.ir);
  console.log(svg); // SVG string
} else {
  console.error(result.errors);
}
```

### Save to File (Node.js)

```ts
import { writeFileSync } from 'fs';
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

const result = parse(`
Type: Pie
Title: Market Share

Apple: 45
Samsung: 30
Others: 25
`);

if (result.ok) {
  const svg = render(result.ir);
  writeFileSync('chart.svg', svg);
}
```

### With Custom Options

```ts
const svg = render(result.ir, {
  width: 800,
  height: 400,
  backgroundColor: '#ffffff',
  textColor: '#333333',
});
```

See package documentation for more details:
- [@plainviz/core](./packages/core.md)
- [@plainviz/render-svg](./packages/render-svg.md)

---

## Markdown Integration

Use PlainViz in Markdown files with the remark plugin.

### Installation

```bash
npm install remark-plainviz
```

### Usage

````markdown
# My Report

```plainviz
Type: Bar
Title: Q1 Results

Product A: 500
Product B: 750
```
````

The code block will be replaced with an SVG chart.

See [Remark Plugin](./integrations/remark.md) for full documentation.

---

## Next Steps

- [Syntax Reference](./syntax.md) - Learn the complete PlainViz syntax
- [Chart Types](./chart-types.md) - Explore all available chart types
- [Examples](./examples.md) - See more examples
