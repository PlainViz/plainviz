/**
 * PlainViz SVG Renderer
 * Renders IR to SVG string (pure, no DOM dependency)
 */

import type { PlainVizIR } from '@plainviz/core';

export interface RenderOptions {
  width?: number;
  height?: number;
  padding?: number;
  colors?: string[];
  backgroundColor?: string;
  textColor?: string;
  gridColor?: string;
}

const DEFAULT_COLORS = [
  '#89b4fa', // Blue
  '#a6e3a1', // Green
  '#f9e2af', // Yellow
  '#f38ba8', // Red
  '#cba6f7', // Mauve
  '#fab387', // Peach
];

const DEFAULT_OPTIONS: Required<RenderOptions> = {
  width: 500,
  height: 300,
  padding: 60,
  colors: DEFAULT_COLORS,
  backgroundColor: '#1e1e2e',
  textColor: '#cdd6f4',
  gridColor: '#313244',
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderBarChart(ir: PlainVizIR, opts: RenderOptions = {}): string {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { width, height, padding, colors, backgroundColor, textColor, gridColor } = options;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 30; // Reserve space for title
  const maxValue = Math.max(...ir.values);
  const barCount = ir.values.length;
  const barWidth = (chartWidth / barCount) * 0.6;
  const barGap = (chartWidth / barCount) * 0.4;

  const lines: string[] = [];

  // SVG header
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background-color: ${backgroundColor};">`);

  // Title
  if (ir.title) {
    lines.push(`  <text x="${width / 2}" y="25" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${escapeXml(ir.title)}</text>`);
  }

  const chartTop = padding;
  const chartBottom = height - padding;

  // Y-axis
  lines.push(`  <line x1="${padding}" y1="${chartTop}" x2="${padding}" y2="${chartBottom}" stroke="${gridColor}" stroke-width="1"/>`);

  // X-axis
  lines.push(`  <line x1="${padding}" y1="${chartBottom}" x2="${width - padding}" y2="${chartBottom}" stroke="${gridColor}" stroke-width="1"/>`);

  // Grid lines (4 horizontal)
  for (let i = 1; i <= 4; i++) {
    const y = chartBottom - (chartHeight / 4) * i;
    lines.push(`  <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="3,3"/>`);

    // Y-axis labels
    const label = Math.round((maxValue / 4) * i);
    lines.push(`  <text x="${padding - 8}" y="${y + 4}" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${label}</text>`);
  }

  // Bars
  ir.values.forEach((value, i) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + (chartWidth / barCount) * i + barGap / 2;
    const y = chartBottom - barHeight;
    const color = colors[i % colors.length];

    // Bar
    lines.push(`  <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${color}"/>`);

    // Value label
    lines.push(`  <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${value}</text>`);

    // X-axis label
    lines.push(`  <text x="${x + barWidth / 2}" y="${chartBottom + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${escapeXml(ir.labels[i])}</text>`);
  });

  lines.push('</svg>');

  return lines.join('\n');
}

export function render(ir: PlainVizIR, opts: RenderOptions = {}): string {
  switch (ir.type) {
    case 'bar':
      return renderBarChart(ir, opts);
    case 'line':
    case 'pie':
    case 'area':
      // TODO: implement other chart types
      throw new Error(`Chart type '${ir.type}' not yet implemented`);
    default:
      throw new Error(`Unknown chart type: ${ir.type}`);
  }
}
