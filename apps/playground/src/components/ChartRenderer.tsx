import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ParseResult } from '@plainviz/core';

// Catppuccin Mocha palette
const COLORS = [
  '#89b4fa', // Blue
  '#a6e3a1', // Green
  '#f9e2af', // Yellow
  '#f38ba8', // Red
  '#cba6f7', // Mauve
  '#fab387', // Peach
  '#94e2d5', // Teal
  '#f5c2e7', // Pink
];

interface ChartRendererProps {
  result: ParseResult;
}

export function ChartRenderer({ result }: ChartRendererProps) {
  if (!result.ok) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg text-red-400">Parse Errors:</p>
          <ul className="text-sm mt-2 text-gray-400">
            {result.errors.map((err, i) => (
              <li key={i}>Line {err.line}: {err.message}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const { ir } = result;

  if (ir.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg">Start typing to see your chart</p>
          <p className="text-sm mt-2 text-gray-600">
            Example: Product A: 500
          </p>
        </div>
      </div>
    );
  }

  // Convert IR to Recharts data format
  const data = ir.labels.map((label, i) => ({
    name: label,
    value: ir.values[i],
  }));

  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  const renderChart = () => {
    switch (ir.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
            <XAxis dataKey="name" stroke="#6c7086" />
            <YAxis stroke="#6c7086" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e2e',
                border: '1px solid #313244',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={{ fill: COLORS[0] }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
            <XAxis dataKey="name" stroke="#6c7086" />
            <YAxis stroke="#6c7086" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e2e',
                border: '1px solid #313244',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e2e',
                border: '1px solid #313244',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        );

      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
            <XAxis dataKey="name" stroke="#6c7086" />
            <YAxis stroke="#6c7086" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e2e',
                border: '1px solid #313244',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {ir.title && (
        <h2 className="text-xl font-bold text-center mb-2 text-gray-200">
          {ir.title}
        </h2>
      )}
      {ir.subtitle && (
        <p className="text-sm text-center mb-4 text-gray-400">
          {ir.subtitle}
        </p>
      )}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
