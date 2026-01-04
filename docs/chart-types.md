# Chart Types

PlainViz supports five chart types. Each is suited for different data visualization needs.

## Overview

| Type | Best For | Multi-Series |
|------|----------|--------------|
| [Bar](#bar-chart) | Comparing categories | Yes |
| [Line](#line-chart) | Trends over time | Yes |
| [Pie](#pie-chart) | Parts of a whole | No |
| [Donut](#donut-chart) | Parts of a whole (with center space) | No |
| [Area](#area-chart) | Trends with volume emphasis | No |

---

## Bar Chart

Best for comparing values across categories.

```plainviz
Type: Bar
Title: Monthly Sales

Jan: 20
Feb: 45
Mar: 80
Apr: 60
```

### Multi-Series Bar Chart

Compare multiple data series side by side:

```plainviz
Type: Bar
Title: Revenue Comparison
Legend: Alibaba, Tencent

Revenue: 100, 80
Profit: 30, 25
Growth: 15, 12
```

### When to Use

- Comparing discrete categories
- Showing rankings
- Displaying survey results

---

## Line Chart

Best for showing trends over time or continuous data.

```plainviz
Type: Line
Title: Website Traffic

Mon: 1200
Tue: 1800
Wed: 1500
Thu: 2200
Fri: 2800
```

### Multi-Series Line Chart

Compare trends across multiple series:

```plainviz
Type: Line
Title: Quarterly Trends
Legend: 2023, 2024

Q1: 100, 120
Q2: 110, 140
Q3: 130, 160
Q4: 150, 180
```

### When to Use

- Time series data
- Showing trends and patterns
- Comparing multiple trends

---

## Pie Chart

Best for showing parts of a whole (proportions).

```plainviz
Type: Pie
Title: Market Share

Apple: 45
Samsung: 30
Others: 25
```

### When to Use

- Showing percentages or proportions
- Parts that sum to a whole
- Limited number of categories (2-6 recommended)

### Tips

- Values are automatically converted to percentages
- Keep categories to 6 or fewer for readability
- Order slices from largest to smallest for clarity

---

## Donut Chart

Similar to pie chart but with a hole in the center. Useful when you want to add a label or icon in the center.

```plainviz
Type: Donut
Title: Budget Allocation

Engineering: 40
Marketing: 25
Operations: 20
HR: 15
```

### When to Use

- Same use cases as pie charts
- When you want center space for additional information
- Modern, cleaner aesthetic preference

---

## Area Chart

Similar to line chart but with the area below the line filled. Emphasizes volume or cumulative values.

```plainviz
Type: Area
Title: Cumulative Sales

Week 1: 100
Week 2: 250
Week 3: 400
Week 4: 600
```

### When to Use

- Emphasizing magnitude of change
- Showing cumulative totals
- Volume over time

---

## Choosing the Right Chart

| If you want to show... | Use |
|------------------------|-----|
| Comparison between categories | Bar |
| Change over time | Line |
| Proportions/percentages | Pie or Donut |
| Cumulative values | Area |
| Multiple series comparison | Bar or Line (multi-series) |

## Default Type

If you don't specify a type, PlainViz defaults to Bar chart:

```plainviz
Title: Sales

Q1: 100
Q2: 200
```

This renders as a bar chart.
