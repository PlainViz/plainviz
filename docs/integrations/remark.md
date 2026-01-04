# remark-plainviz

A [remark](https://github.com/remarkjs/remark) plugin that transforms PlainViz code blocks in Markdown into SVG charts.

## Installation

```bash
npm install remark-plainviz
```

**Peer dependency:** `unified` (^11.0.0)

## Basic Usage

````markdown
# My Report

```plainviz
Type: Bar
Title: Q1 Results

Product A: 500
Product B: 750
Product C: 600
```
````

The `plainviz` code block will be replaced with an inline SVG chart.

## Setup

### With remark

```js
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkPlainViz from 'remark-plainviz';

const markdown = `
# Sales Report

\`\`\`plainviz
Type: Bar
Title: Monthly Sales

Jan: 100
Feb: 150
Mar: 200
\`\`\`
`;

const result = await remark()
  .use(remarkPlainViz)
  .use(remarkHtml, { sanitize: false })
  .process(markdown);

console.log(String(result));
```

**Important:** Use `{ sanitize: false }` with remark-html to preserve SVG output.

### With unified

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkPlainViz from 'remark-plainviz';

const processor = unified()
  .use(remarkParse)
  .use(remarkPlainViz)
  .use(remarkHtml, { sanitize: false });

const result = await processor.process(markdown);
```

## Options

### className

CSS class name for the SVG wrapper div.

```js
remark()
  .use(remarkPlainViz, { className: 'my-chart' })
```

**Default:** `'plainviz-chart'`

**Output:**

```html
<div class="my-chart">
  <svg>...</svg>
</div>
```

## Code Block Languages

The plugin recognizes two language identifiers:

- ` ```plainviz ` (recommended)
- ` ```pv ` (shorthand)

````markdown
```plainviz
Type: Bar
A: 10
B: 20
```

```pv
Type: Pie
A: 30
B: 70
```
````

## Error Handling

When parsing fails, the plugin renders an error message instead of crashing:

````markdown
```plainviz
Type: Bar
Invalid: not a number
```
````

Output:

```html
<pre class="plainviz-error"><code>Line 3: "not a number" is not a valid number</code></pre>
```

## Framework Integration

### Astro

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import remarkPlainViz from 'remark-plainviz';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkPlainViz],
  },
});
```

### Next.js (with MDX)

```js
// next.config.js
import remarkPlainViz from 'remark-plainviz';

const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [remarkPlainViz],
  },
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx'],
});
```

### Gatsby

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [require('remark-plainviz')],
        },
      },
    },
  ],
};
```

### VitePress

```js
// .vitepress/config.js
import remarkPlainViz from 'remark-plainviz';

export default {
  markdown: {
    remarkPlugins: [remarkPlainViz],
  },
};
```

### Docusaurus

```js
// docusaurus.config.js
const remarkPlainViz = require('remark-plainviz');

module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          remarkPlugins: [remarkPlainViz],
        },
        blog: {
          remarkPlugins: [remarkPlainViz],
        },
      },
    ],
  ],
};
```

## Styling

### Default Wrapper Class

Charts are wrapped in a div with the `plainviz-chart` class:

```css
.plainviz-chart {
  margin: 1rem 0;
  text-align: center;
}

.plainviz-chart svg {
  max-width: 100%;
  height: auto;
}
```

### Error Styling

```css
.plainviz-error {
  background: #fee;
  border: 1px solid #fcc;
  padding: 1rem;
  border-radius: 4px;
  color: #c00;
}
```

## Complete Example

````markdown
# Q1 2024 Report

## Revenue by Region

```plainviz
Type: Bar
Title: Revenue by Region

North America: $2,500,000
Europe: $1,800,000
Asia Pacific: $1,200,000
```

## Market Share Trend

```plainviz
Type: Line
Title: Market Share (%)
Legend: Our Product, Competitor A

Q1: 25, 30
Q2: 28, 29
Q3: 32, 28
Q4: 35, 27
```

## Budget Allocation

```plainviz
Type: Donut
Title: 2024 Budget

Engineering: 40
Marketing: 25
Operations: 20
HR: 15
```
````

## Related

- [Syntax Reference](../syntax.md) - PlainViz syntax guide
- [@plainviz/core](../packages/core.md) - Core parser
- [@plainviz/render-svg](../packages/render-svg.md) - SVG renderer
