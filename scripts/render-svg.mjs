#!/usr/bin/env node
/**
 * CLI script to render PlainViz files to SVG
 * Usage: node scripts/render-svg.mjs examples/01-basic.pv > output.svg
 */

import { readFileSync } from 'fs';
import { parse } from '../packages/core/src/parse.ts';
import { render } from '../packages/render-svg/src/render.ts';

const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Usage: node scripts/render-svg.mjs <input.pv>');
  process.exit(1);
}

try {
  const input = readFileSync(inputFile, 'utf-8');
  const result = parse(input);

  if (!result.ok) {
    console.error('Parse errors:');
    result.errors.forEach(err => {
      console.error(`  Line ${err.line}: ${err.message}`);
    });
    process.exit(1);
  }

  const svg = render(result.ir);
  console.log(svg);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
