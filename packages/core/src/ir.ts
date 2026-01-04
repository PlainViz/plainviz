/**
 * PlainViz Intermediate Representation (IR)
 * This is the canonical output of the parser.
 * All renderers consume this format.
 */

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut';

export interface DataSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface PlainVizIR {
  type: ChartType;
  title?: string;
  subtitle?: string;
  labels: string[];
  values: number[];           // 单系列数据（向后兼容）
  series?: DataSeries[];      // 多系列数据
  meta?: {
    xAxis?: string;
    yAxis?: string;
    theme?: string;
    colors?: string[];        // 自定义颜色
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
