#!/usr/bin/env node
/**
 * Demo script: Renders input.md with remark-plainviz
 * Usage: node examples/remark-demo/render.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkPlainViz from '../../packages/remark-plainviz/dist/index.js';

const inputPath = new URL('./input.md', import.meta.url);
const outputPath = new URL('./output.html', import.meta.url);

const markdown = readFileSync(inputPath, 'utf-8');

const result = await remark()
  .use(remarkPlainViz)
  .use(remarkHtml, { sanitize: false })
  .process(markdown);

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PlainViz Remark Demo</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #1e1e2e;
      color: #cdd6f4;
    }
    h1, h2 { color: #cba6f7; }
    .plainviz-chart {
      margin: 20px 0;
      padding: 20px;
      background: #181825;
      border-radius: 8px;
    }
  </style>
</head>
<body>
${result.toString()}
</body>
</html>`;

writeFileSync(outputPath, html);

console.log('✓ Rendered to examples/remark-demo/output.html');
