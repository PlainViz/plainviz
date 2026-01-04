# Syntax Reference

Complete guide to PlainViz syntax.

## Basic Structure

A PlainViz document consists of two sections:

1. **Header** (optional) - Chart configuration
2. **Data** - Label-value pairs

```plainviz
Type: Bar           # Header: chart type
Title: My Chart     # Header: title

Apples: 50          # Data: label and value
Oranges: 30         # Data: label and value
Bananas: 45         # Data: label and value
```

## Header Fields

All header fields are optional.

| Field | Description | Default | Example |
|-------|-------------|---------|---------|
| `Type` | Chart type | `bar` | `Type: Line` |
| `Title` | Chart title | none | `Title: Sales Report` |
| `Subtitle` | Chart subtitle | none | `Subtitle: Q1 2024` |
| `Legend` | Series names (multi-series) | `Series 1, Series 2...` | `Legend: 2023, 2024` |
| `Colors` | Custom colors | default palette | `Colors: #ff0000, #00ff00` |
| `X-Axis` / `X` | X-axis label | none | `X: Months` |
| `Y-Axis` / `Y` | Y-axis label | none | `Y: Revenue ($)` |

### Chart Types

```plainviz
Type: Bar      # Vertical bar chart
Type: Line     # Line chart
Type: Pie      # Pie chart
Type: Area     # Area chart
Type: Donut    # Donut chart
```

Type is case-insensitive: `Type: bar`, `Type: Bar`, `Type: BAR` all work.

### Title and Subtitle

```plainviz
Type: Bar
Title: Quarterly Revenue
Subtitle: Fiscal Year 2024

Q1: 100
Q2: 150
```

Quotes are optional:

```plainviz
Title: My Chart
Title: "My Chart"
Title: 'My Chart'
```

## Data Format

### Basic Syntax

```
Label: Value
```

Each data point is a label-value pair separated by a colon.

```plainviz
Type: Bar

Apples: 50
Oranges: 30
Bananas: 45
```

### Number Formatting

PlainViz automatically cleans common number formats:

| Format | Cleaned Value | Example |
|--------|---------------|---------|
| Plain number | as-is | `Sales: 100` → 100 |
| With commas | removes commas | `Revenue: 1,200` → 1200 |
| With dollar sign | removes `$` | `Price: $50` → 50 |
| With percent | removes `%` | `Growth: 45%` → 45 |
| Combined | cleans all | `Revenue: $1,200` → 1200 |

```plainviz
Type: Bar
Title: Revenue by Product

Product A: $1,200
Product B: $850
Product C: $2,100
```

### Multi-Series Data

Compare multiple data series by separating values with commas.

```plainviz
Type: Bar
Title: Company Comparison
Legend: Alibaba, Tencent

Revenue: 100, 80
Profit: 30, 25
Growth: 15, 12
```

**Key points:**
- Use `Legend:` to name the series (optional, defaults to "Series 1", "Series 2", etc.)
- Separate values with commas (`,`) or Chinese commas (`，`)
- Each row must have the same number of values

### Multi-Series with Formatting

Number formatting works with multi-series too:

```plainviz
Type: Line
Title: Yearly Comparison
Legend: 2023, 2024

Q1: $1,000, $1,200
Q2: $1,100, $1,400
Q3: $1,300, $1,600
Q4: $1,500, $1,800
```

## Comments

Lines starting with `#` or `//` are comments.

```plainviz
Type: Bar
Title: Sales Data

# This is a comment
Apples: 50    // This is also a comment
Oranges: 30
```

## Empty Lines

Empty lines are ignored and can be used to organize your code.

```plainviz
Type: Bar
Title: Quarterly Sales

# Q1 and Q2
Jan: 100
Feb: 120

# Q3 and Q4
Jul: 150
Aug: 180
```

## Custom Colors

Specify custom colors for your chart:

```plainviz
Type: Bar
Title: Brand Colors
Colors: #ff6b6b, #4ecdc4, #45b7d1

Product A: 100
Product B: 80
Product C: 60
```

Colors can be:
- Hex codes: `#ff6b6b`, `#4ecdc4`
- RGB: `rgb(255, 107, 107)`
- Named colors: `red`, `blue`, `green`

## Error Handling

PlainViz provides helpful error messages for common mistakes.

### Missing Colon

```
# Wrong
Apples 50

# Error: Missing ':' separator
# Hint: Each line should be "Label: Value", e.g., "Sales: 100"
```

### Using Equals Sign

```
# Wrong
Apples = 50

# Error: Use ':' instead of '='
# Hint: Try: Apples: 50
```

### Invalid Number

```
# Wrong
Apples: fifty

# Error: "fifty" is not a valid number
# Hint: Use a number like: Apples: 100
```

### Unknown Chart Type

```
# Wrong
Type: Graph

# Error: Unknown chart type "Graph"
# Hint: Valid types: bar, line, pie, area, donut
```

## Complete Example

```plainviz
Type: Bar
Title: Annual Revenue Report
Subtitle: Comparison by Region
Legend: 2023, 2024
Colors: #89b4fa, #a6e3a1

North America: $2,500,000, $2,800,000
Europe: $1,800,000, $2,100,000
Asia Pacific: $1,200,000, $1,600,000
Latin America: $600,000, $750,000
```

## Quick Reference

```
Type: bar|line|pie|area|donut
Title: "Chart Title"
Subtitle: "Subtitle"
Legend: Series1, Series2
Colors: #hex1, #hex2

# Single series
Label1: 100
Label2: 200

# Multi-series
Label1: 100, 150
Label2: 200, 250
```
