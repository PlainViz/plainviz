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
  const { width, height, padding, backgroundColor, textColor, gridColor } = options;
  const colors = ir.meta?.colors || options.colors;

  const isMultiSeries = ir.series && ir.series.length > 1;
  const seriesCount = isMultiSeries ? ir.series!.length : 1;
  const legendHeight = isMultiSeries ? 25 : 0;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 30 - legendHeight;

  // Calculate max value across all series
  let maxValue: number;
  if (isMultiSeries) {
    maxValue = Math.max(...ir.series!.flatMap(s => s.values));
  } else {
    maxValue = Math.max(...ir.values);
  }

  const labelCount = ir.labels.length;
  const groupWidth = chartWidth / labelCount;
  const barWidth = (groupWidth * 0.7) / seriesCount;
  const groupPadding = groupWidth * 0.15;

  const lines: string[] = [];

  // SVG header
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background-color: ${backgroundColor};">`);

  // Title
  if (ir.title) {
    lines.push(`  <text x="${width / 2}" y="25" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${escapeXml(ir.title)}</text>`);
  }

  // Legend for multi-series
  if (isMultiSeries) {
    const legendY = 45;
    const legendItemWidth = 80;
    const legendStartX = (width - ir.series!.length * legendItemWidth) / 2;

    ir.series!.forEach((series, i) => {
      const x = legendStartX + i * legendItemWidth;
      const color = series.color || colors[i % colors.length];
      lines.push(`  <rect x="${x}" y="${legendY - 8}" width="12" height="12" rx="2" fill="${color}"/>`);
      lines.push(`  <text x="${x + 16}" y="${legendY}" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${escapeXml(series.name)}</text>`);
    });
  }

  const chartTop = padding + legendHeight;
  const chartBottom = height - padding;

  // Y-axis
  lines.push(`  <line x1="${padding}" y1="${chartTop}" x2="${padding}" y2="${chartBottom}" stroke="${gridColor}" stroke-width="1"/>`);

  // X-axis
  lines.push(`  <line x1="${padding}" y1="${chartBottom}" x2="${width - padding}" y2="${chartBottom}" stroke="${gridColor}" stroke-width="1"/>`);

  // Grid lines
  for (let i = 1; i <= 4; i++) {
    const y = chartBottom - (chartHeight / 4) * i;
    lines.push(`  <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="3,3"/>`);
    const label = Math.round((maxValue / 4) * i);
    lines.push(`  <text x="${padding - 8}" y="${y + 4}" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${label}</text>`);
  }

  // Draw bars
  ir.labels.forEach((label, labelIndex) => {
    const groupX = padding + groupWidth * labelIndex + groupPadding;

    if (isMultiSeries) {
      // Multi-series: grouped bars
      ir.series!.forEach((series, seriesIndex) => {
        const value = series.values[labelIndex] ?? 0;
        const barHeight = (value / maxValue) * chartHeight;
        const x = groupX + seriesIndex * barWidth;
        const y = chartBottom - barHeight;
        const color = series.color || colors[seriesIndex % colors.length];

        lines.push(`  <rect x="${x}" y="${y}" width="${barWidth - 2}" height="${barHeight}" rx="2" fill="${color}"/>`);
      });
    } else {
      // Single series
      const value = ir.values[labelIndex];
      const barHeight = (value / maxValue) * chartHeight;
      const x = groupX;
      const y = chartBottom - barHeight;
      const color = colors[labelIndex % colors.length];

      lines.push(`  <rect x="${x}" y="${y}" width="${groupWidth * 0.7}" height="${barHeight}" rx="4" fill="${color}"/>`);
      lines.push(`  <text x="${x + groupWidth * 0.35}" y="${y - 8}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${value}</text>`);
    }

    // X-axis label
    const labelX = groupX + (groupWidth * 0.7) / 2;
    lines.push(`  <text x="${labelX}" y="${chartBottom + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${escapeXml(label)}</text>`);
  });

  lines.push('</svg>');

  return lines.join('\n');
}

export function renderLineChart(ir: PlainVizIR, opts: RenderOptions = {}): string {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { width, height, padding, backgroundColor, textColor, gridColor } = options;
  const colors = ir.meta?.colors || options.colors;

  const isMultiSeries = ir.series && ir.series.length > 1;
  const legendHeight = isMultiSeries ? 25 : 0;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 30 - legendHeight;
  const pointCount = ir.labels.length;

  // Calculate max value across all series
  let maxValue: number;
  if (isMultiSeries) {
    maxValue = Math.max(...ir.series!.flatMap(s => s.values));
  } else {
    maxValue = Math.max(...ir.values);
  }

  const lines: string[] = [];

  // SVG header
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background-color: ${backgroundColor};">`);

  // Title
  if (ir.title) {
    lines.push(`  <text x="${width / 2}" y="25" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${escapeXml(ir.title)}</text>`);
  }

  // Legend for multi-series
  if (isMultiSeries) {
    const legendY = 45;
    const legendItemWidth = 80;
    const legendStartX = (width - ir.series!.length * legendItemWidth) / 2;

    ir.series!.forEach((series, i) => {
      const x = legendStartX + i * legendItemWidth;
      const color = series.color || colors[i % colors.length];
      lines.push(`  <rect x="${x}" y="${legendY - 8}" width="12" height="12" rx="2" fill="${color}"/>`);
      lines.push(`  <text x="${x + 16}" y="${legendY}" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${escapeXml(series.name)}</text>`);
    });
  }

  const chartTop = padding + legendHeight;
  const chartBottom = height - padding;

  // Y-axis
  lines.push(`  <line x1="${padding}" y1="${chartTop}" x2="${padding}" y2="${chartBottom}" stroke="${gridColor}" stroke-width="1"/>`);

  // X-axis
  lines.push(`  <line x1="${padding}" y1="${chartBottom}" x2="${width - padding}" y2="${chartBottom}" stroke="${gridColor}" stroke-width="1"/>`);

  // Grid lines
  for (let i = 1; i <= 4; i++) {
    const y = chartBottom - (chartHeight / 4) * i;
    lines.push(`  <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="3,3"/>`);
    const label = Math.round((maxValue / 4) * i);
    lines.push(`  <text x="${padding - 8}" y="${y + 4}" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${label}</text>`);
  }

  if (isMultiSeries) {
    // Draw multiple lines
    ir.series!.forEach((series, seriesIndex) => {
      const color = series.color || colors[seriesIndex % colors.length];
      const points = series.values.map((value, i) => ({
        x: padding + (chartWidth / (pointCount - 1 || 1)) * i,
        y: chartBottom - (value / maxValue) * chartHeight,
      }));

      // Draw line path
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      lines.push(`  <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

      // Draw points
      points.forEach((p) => {
        lines.push(`  <circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="${backgroundColor}" stroke-width="2"/>`);
      });
    });

    // X-axis labels (only once)
    ir.labels.forEach((label, i) => {
      const x = padding + (chartWidth / (pointCount - 1 || 1)) * i;
      lines.push(`  <text x="${x}" y="${chartBottom + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${escapeXml(label)}</text>`);
    });
  } else {
    // Single series
    const points = ir.values.map((value, i) => ({
      x: padding + (chartWidth / (pointCount - 1 || 1)) * i,
      y: chartBottom - (value / maxValue) * chartHeight,
    }));

    // Draw line path
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    lines.push(`  <path d="${pathD}" fill="none" stroke="${colors[0]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`);

    // Draw points and labels
    points.forEach((p, i) => {
      lines.push(`  <circle cx="${p.x}" cy="${p.y}" r="5" fill="${colors[0]}" stroke="${backgroundColor}" stroke-width="2"/>`);
      lines.push(`  <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${ir.values[i]}</text>`);
      lines.push(`  <text x="${p.x}" y="${chartBottom + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${escapeXml(ir.labels[i])}</text>`);
    });
  }

  lines.push('</svg>');

  return lines.join('\n');
}

export function renderPieChart(ir: PlainVizIR, opts: RenderOptions = {}): string {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { width, height, colors, backgroundColor, textColor } = options;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 2 - 60;
  const total = ir.values.reduce((a, b) => a + b, 0);

  const lines: string[] = [];

  // SVG header
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background-color: ${backgroundColor};">`);

  // Title
  if (ir.title) {
    lines.push(`  <text x="${width / 2}" y="25" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${escapeXml(ir.title)}</text>`);
  }

  // Draw pie slices
  let currentAngle = -Math.PI / 2; // Start from top

  ir.values.forEach((value, i) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos(currentAngle);
    const y1 = centerY + radius * Math.sin(currentAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color = colors[i % colors.length];

    // Slice path
    const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    lines.push(`  <path d="${pathD}" fill="${color}" stroke="${backgroundColor}" stroke-width="2"/>`);

    // Label position (middle of slice, outside)
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelRadius = radius + 25;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    const percent = Math.round((value / total) * 100);

    lines.push(`  <text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${escapeXml(ir.labels[i])}: ${percent}%</text>`);

    currentAngle = endAngle;
  });

  lines.push('</svg>');

  return lines.join('\n');
}

export function renderDonutChart(ir: PlainVizIR, opts: RenderOptions = {}): string {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { width, height, colors, backgroundColor, textColor } = options;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const outerRadius = Math.min(width, height) / 2 - 60;
  const innerRadius = outerRadius * 0.6; // Donut hole
  const total = ir.values.reduce((a, b) => a + b, 0);

  const lines: string[] = [];

  // SVG header
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background-color: ${backgroundColor};">`);

  // Title
  if (ir.title) {
    lines.push(`  <text x="${width / 2}" y="25" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="${textColor}">${escapeXml(ir.title)}</text>`);
  }

  // Draw donut slices
  let currentAngle = -Math.PI / 2; // Start from top

  ir.values.forEach((value, i) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;

    // Outer arc points
    const ox1 = centerX + outerRadius * Math.cos(currentAngle);
    const oy1 = centerY + outerRadius * Math.sin(currentAngle);
    const ox2 = centerX + outerRadius * Math.cos(endAngle);
    const oy2 = centerY + outerRadius * Math.sin(endAngle);

    // Inner arc points
    const ix1 = centerX + innerRadius * Math.cos(currentAngle);
    const iy1 = centerY + innerRadius * Math.sin(currentAngle);
    const ix2 = centerX + innerRadius * Math.cos(endAngle);
    const iy2 = centerY + innerRadius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color = colors[i % colors.length];

    // Donut slice path: outer arc -> line to inner -> inner arc (reverse) -> line back
    const pathD = `M ${ox1} ${oy1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    lines.push(`  <path d="${pathD}" fill="${color}" stroke="${backgroundColor}" stroke-width="2"/>`);

    // Label position (middle of slice, outside)
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelRadius = outerRadius + 25;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    const percent = Math.round((value / total) * 100);

    lines.push(`  <text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="11" fill="${textColor}">${escapeXml(ir.labels[i])}: ${percent}%</text>`);

    currentAngle = endAngle;
  });

  lines.push('</svg>');

  return lines.join('\n');
}

export function renderAreaChart(ir: PlainVizIR, opts: RenderOptions = {}): string {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const { width, height, padding, colors, backgroundColor, textColor, gridColor } = options;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 30;
  const maxValue = Math.max(...ir.values);
  const pointCount = ir.values.length;

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

  // Grid lines
  for (let i = 1; i <= 4; i++) {
    const y = chartBottom - (chartHeight / 4) * i;
    lines.push(`  <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="${gridColor}" stroke-width="1" stroke-dasharray="3,3"/>`);
    const label = Math.round((maxValue / 4) * i);
    lines.push(`  <text x="${padding - 8}" y="${y + 4}" text-anchor="end" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${label}</text>`);
  }

  // Calculate points
  const points: { x: number; y: number }[] = ir.values.map((value, i) => ({
    x: padding + (chartWidth / (pointCount - 1 || 1)) * i,
    y: chartBottom - (value / maxValue) * chartHeight,
  }));

  // Draw filled area
  const areaPathD = [
    `M ${padding} ${chartBottom}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${chartBottom}`,
    'Z'
  ].join(' ');
  lines.push(`  <path d="${areaPathD}" fill="${colors[0]}" fill-opacity="0.3"/>`);

  // Draw line on top
  const linePathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  lines.push(`  <path d="${linePathD}" fill="none" stroke="${colors[0]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

  // Draw points and labels
  points.forEach((p, i) => {
    // X-axis label
    lines.push(`  <text x="${p.x}" y="${chartBottom + 18}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#6c7086">${escapeXml(ir.labels[i])}</text>`);
  });

  lines.push('</svg>');

  return lines.join('\n');
}

export function render(ir: PlainVizIR, opts: RenderOptions = {}): string {
  switch (ir.type) {
    case 'bar':
      return renderBarChart(ir, opts);
    case 'line':
      return renderLineChart(ir, opts);
    case 'pie':
      return renderPieChart(ir, opts);
    case 'donut':
      return renderDonutChart(ir, opts);
    case 'area':
      return renderAreaChart(ir, opts);
    default:
      throw new Error(`Unknown chart type: ${ir.type}`);
  }
}
