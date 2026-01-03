// PlainViz Core Parser
// Converts PlainViz syntax to standardized JSON for chart rendering

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar' | 'funnel';
  title?: string;
  subtitle?: string;
  theme?: string;
  xAxis?: string;
  yAxis?: string;
  legend?: string[];
}

export interface DataPoint {
  name: string;
  value: number;
  values?: number[]; // For multi-series data
}

export interface ParseResult {
  config: ChartConfig;
  data: DataPoint[];
  error?: string;
}

const HEADER_KEYS = ['type', 'title', 'subtitle', 'theme', 'x-axis', 'y-axis', 'x', 'y', 'legend', 'palette', 'config', 'sort', 'color'];

function isHeaderLine(line: string): boolean {
  const trimmed = line.trim().toLowerCase();
  const colonIndex = trimmed.indexOf(':');
  if (colonIndex === -1) return false;

  const key = trimmed.slice(0, colonIndex).trim();
  return HEADER_KEYS.includes(key);
}

function parseValue(value: string): number | number[] {
  // Handle multiple values (e.g., "100, 150" for multi-series)
  if (value.includes(',')) {
    return value.split(',').map(v => parseFloat(cleanNumber(v.trim())));
  }
  return parseFloat(cleanNumber(value));
}

function cleanNumber(value: string): string {
  // Remove common formatting: $, %, spaces, etc.
  return value.replace(/[$%,\s]/g, '');
}

function parseLegend(value: string): string[] {
  // Parse legend: [2023, 2024] or "2023, 2024"
  const cleaned = value.replace(/[\[\]]/g, '').trim();
  return cleaned.split(',').map(s => s.trim());
}

export function parse(input: string): ParseResult {
  const lines = input.split('\n').filter(line => {
    const trimmed = line.trim();
    // Filter out empty lines and comments
    return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#');
  });

  if (lines.length === 0) {
    return {
      config: { type: 'bar' },
      data: [],
      error: 'No content to parse'
    };
  }

  const config: ChartConfig = { type: 'bar' };
  const data: DataPoint[] = [];
  let inDataSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');

    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    const keyLower = key.toLowerCase();

    // Parse header fields
    if (!inDataSection && isHeaderLine(line)) {
      switch (keyLower) {
        case 'type':
          config.type = value.toLowerCase() as ChartConfig['type'];
          break;
        case 'title':
          config.title = value.replace(/^["']|["']$/g, '');
          break;
        case 'subtitle':
          config.subtitle = value.replace(/^["']|["']$/g, '');
          break;
        case 'theme':
          config.theme = value;
          break;
        case 'x-axis':
        case 'x':
          config.xAxis = value;
          break;
        case 'y-axis':
        case 'y':
          config.yAxis = value;
          break;
        case 'legend':
          config.legend = parseLegend(value);
          break;
      }
    } else {
      // Data section
      inDataSection = true;
      const parsedValue = parseValue(value);

      if (Array.isArray(parsedValue)) {
        data.push({
          name: key,
          value: parsedValue[0],
          values: parsedValue
        });
      } else if (!isNaN(parsedValue)) {
        data.push({
          name: key,
          value: parsedValue
        });
      }
    }
  }

  // If no type specified but we have data, default to bar
  if (data.length > 0 && !config.type) {
    config.type = 'bar';
  }

  return { config, data };
}

// Default example for the editor
export const DEFAULT_EXAMPLE = `Type: Bar
Title: Q1 Revenue

Product A: 500
Product B: 750
Product C: 300
Product D: 420`;
