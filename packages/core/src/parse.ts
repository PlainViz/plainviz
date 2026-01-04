/**
 * PlainViz Parser
 * Parses PlainViz syntax into IR (Intermediate Representation)
 */

import type { PlainVizIR, ParseResult, ParseError, ChartType } from './ir.js';

const HEADER_KEYS = new Set([
  'type', 'title', 'subtitle', 'theme',
  'x-axis', 'y-axis', 'x', 'y',
  'legend', 'colors'
]);

// Simple split by comma (both English and Chinese) - for headers like Legend, Colors
function splitList(value: string): string[] {
  return value.split(/[,，]/).map(s => s.trim()).filter(s => s);
}

// Smart split for data values
// Preserves number formatting like $1,200 or 1,000,000
function splitValues(value: string): string[] {
  // Chinese comma always splits
  // English comma only splits if followed by whitespace or at end
  const parts = value.split(/，|,(?=\s|$)/).map(s => s.trim()).filter(s => s);

  // If we got only one part, return as-is
  if (parts.length <= 1) {
    return parts;
  }

  // Verify all parts look like numbers (with optional formatting)
  // If any part is clearly not a number, don't split
  const allNumbers = parts.every(p => {
    const cleaned = p.replace(/[$%,\s]/g, '');
    return !isNaN(parseFloat(cleaned));
  });

  if (!allNumbers) {
    return [value]; // Return original if not all parts are numbers
  }

  return parts;
}

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
  let legend: string[] = [];
  let colors: string[] = [];

  const labels: string[] = [];
  const values: number[] = [];
  const multiValues: number[][] = [];  // 多系列数据

  let inDataSection = false;
  let isMultiSeries = false;

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
          const validTypes = ['bar', 'line', 'pie', 'area', 'donut'];
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
        case 'legend':
          legend = splitList(value);
          break;
        case 'colors':
          colors = splitList(value);
          break;
      }
    } else {
      // Data section
      inDataSection = true;

      // Check for multi-series (comma-separated values)
      const rawValues = splitValues(value);

      if (rawValues.length > 1) {
        // Multi-series data
        isMultiSeries = true;
        const nums: number[] = [];
        let hasError = false;

        for (const rv of rawValues) {
          const num = cleanNumber(rv);
          if (isNaN(num)) {
            errors.push({
              line: lineNum,
              message: `"${rv}" is not a valid number`,
              hint: `Use numbers like: ${key}: 100, 80, 60`,
              source: trimmed,
            });
            hasError = true;
            break;
          }
          nums.push(num);
        }

        if (!hasError) {
          labels.push(key);
          multiValues.push(nums);
        }
      } else {
        // Single value
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
    values: isMultiSeries ? [] : values,
  };

  // Build series for multi-series data
  if (isMultiSeries && multiValues.length > 0) {
    const seriesCount = multiValues[0].length;
    ir.series = [];

    for (let s = 0; s < seriesCount; s++) {
      const seriesName = legend[s] || `Series ${s + 1}`;
      const seriesValues = multiValues.map(row => row[s] ?? 0);
      ir.series.push({
        name: seriesName,
        values: seriesValues,
        color: colors[s],
      });
    }

    // Also populate values with first series for backward compatibility
    ir.values = ir.series[0]?.values || [];
  }

  if (title) ir.title = title;
  if (subtitle) ir.subtitle = subtitle;
  if (xAxis || yAxis || theme || colors.length > 0) {
    ir.meta = {};
    if (xAxis) ir.meta.xAxis = xAxis;
    if (yAxis) ir.meta.yAxis = yAxis;
    if (theme) ir.meta.theme = theme;
    if (colors.length > 0) ir.meta.colors = colors;
  }

  return { ok: true, ir };
}
