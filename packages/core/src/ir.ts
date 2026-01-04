/**
 * PlainViz Intermediate Representation (IR)
 * This is the canonical output of the parser.
 * All renderers consume this format.
 */

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut';

export interface PlainVizIR {
  type: ChartType;
  title?: string;
  subtitle?: string;
  labels: string[];
  values: number[];
  meta?: {
    xAxis?: string;
    yAxis?: string;
    theme?: string;
  };
}

export interface ParseError {
  line: number;
  message: string;
  hint?: string;
  source?: string;
}

export type ParseResult =
  | { ok: true; ir: PlainVizIR }
  | { ok: false; errors: ParseError[] };
