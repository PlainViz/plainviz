/**
 * PlainViz Parser
 * Parses PlainViz syntax into IR (Intermediate Representation)
 */

import type { PlainVizIR, ParseResult, ParseError, ChartType } from './ir.js';

const HEADER_KEYS = new Set([
  'type', 'title', 'subtitle', 'theme',
  'x-axis', 'y-axis', 'x', 'y'
]);

function isHeaderKey(key: string): boolean {
  return HEADER_KEYS.has(key.toLowerCase());
}

function cleanNumber(value: string): number {
  // Remove common formatting: $, %, commas, spaces
  const cleaned = value.replace(/[$%,\s]/g, '');
  return parseFloat(cleaned);
}

export function parse(input: string): ParseResult {
  const lines = input.split('\n');
  const errors: ParseError[] = [];

  let type: ChartType = 'bar';
  let title: string | undefined;
  let subtitle: string | undefined;
  let xAxis: string | undefined;
  let yAxis: string | undefined;
  let theme: string | undefined;

  const labels: string[] = [];
  const values: number[] = [];

  let inDataSection = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      continue;
    }

    // Find colon separator
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) {
      // Check for common mistakes
      if (trimmed.includes('=')) {
        errors.push({
          line: lineNum,
          message: `Use ':' instead of '='`,
          hint: `Try: ${trimmed.replace('=', ':')}`,
          source: trimmed,
        });
      } else {
        errors.push({
          line: lineNum,
          message: `Missing ':' separator`,
          hint: `Each line should be "Label: Value", e.g., "Sales: 100"`,
          source: trimmed,
        });
      }
      continue;
    }

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    if (!key) {
      errors.push({
        line: lineNum,
        message: `Empty label before ':'`,
        hint: `Add a label name, e.g., "Product A: 50"`,
        source: trimmed,
      });
      continue;
    }

    if (!value) {
      errors.push({
        line: lineNum,
        message: `Missing value after ':'`,
        hint: `Add a number value, e.g., "${key}: 100"`,
        source: trimmed,
      });
      continue;
    }

    // Parse header fields
    if (!inDataSection && isHeaderKey(key)) {
      const keyLower = key.toLowerCase();

      switch (keyLower) {
        case 'type':
          const validTypes = ['bar', 'line', 'pie', 'area'];
          const typeLower = value.toLowerCase();
          if (validTypes.includes(typeLower)) {
            type = typeLower as ChartType;
          } else {
            // Find closest match for suggestion
            const suggestion = validTypes.find(t =>
              t.startsWith(typeLower.charAt(0)) || typeLower.includes(t.charAt(0))
            ) || 'bar';
            errors.push({
              line: lineNum,
              message: `Unknown chart type "${value}"`,
              hint: `Valid types: bar, line, pie, area. Did you mean "${suggestion}"?`,
              source: trimmed,
            });
          }
          break;
        case 'title':
          title = value.replace(/^["']|["']$/g, '');
          break;
        case 'subtitle':
          subtitle = value.replace(/^["']|["']$/g, '');
          break;
        case 'x-axis':
        case 'x':
          xAxis = value;
          break;
        case 'y-axis':
        case 'y':
          yAxis = value;
          break;
        case 'theme':
          theme = value;
          break;
      }
    } else {
      // Data section
      inDataSection = true;

      const numValue = cleanNumber(value);
      if (isNaN(numValue)) {
        errors.push({
          line: lineNum,
          message: `"${value}" is not a valid number`,
          hint: `Use a number like: ${key}: 100 (supports $, %, commas)`,
          source: trimmed,
        });
        continue;
      }

      labels.push(key);
      values.push(numValue);
    }
  }

  // Validation
  if (labels.length === 0 && errors.length === 0) {
    errors.push({
      line: 0,
      message: 'No data points found',
      hint: `Add data like:\nApples: 50\nOranges: 30\nBananas: 45`,
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const ir: PlainVizIR = {
    type,
    labels,
    values,
  };

  if (title) ir.title = title;
  if (subtitle) ir.subtitle = subtitle;
  if (xAxis || yAxis || theme) {
    ir.meta = {};
    if (xAxis) ir.meta.xAxis = xAxis;
    if (yAxis) ir.meta.yAxis = yAxis;
    if (theme) ir.meta.theme = theme;
  }

  return { ok: true, ir };
}
