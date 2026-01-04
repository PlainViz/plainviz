# Examples

A collection of PlainViz examples for common use cases.

## Basic Charts

### Simple Bar Chart

```plainviz
Type: Bar
Title: Monthly Sales

Jan: 20
Feb: 45
Mar: 80
Apr: 60
```

### Line Chart

```plainviz
Type: Line
Title: Website Traffic

Mon: 1200
Tue: 1800
Wed: 1500
Thu: 2200
Fri: 2800
```

### Pie Chart

```plainviz
Type: Pie
Title: Market Share

Apple: 45
Samsung: 30
Others: 25
```

### Donut Chart

```plainviz
Type: Donut
Title: Budget Allocation

Engineering: 40
Marketing: 25
Operations: 20
HR: 15
```

### Area Chart

```plainviz
Type: Area
Title: Cumulative Revenue

Week 1: 100
Week 2: 250
Week 3: 400
Week 4: 600
```

---

## Number Formatting

### Currency

```plainviz
Type: Bar
Title: Revenue by Product

Product A: $1,200
Product B: $850
Product C: $2,100
Product D: $1,650
```

### Percentages

```plainviz
Type: Bar
Title: Completion Rate

Task A: 95%
Task B: 78%
Task C: 100%
Task D: 45%
```

### Large Numbers

```plainviz
Type: Bar
Title: User Growth

2020: 1,000,000
2021: 2,500,000
2022: 5,000,000
2023: 8,500,000
```

---

## Multi-Series Charts

### Comparing Two Series

```plainviz
Type: Bar
Title: Revenue Comparison
Legend: 2023, 2024

Q1: 100, 120
Q2: 150, 180
Q3: 200, 240
Q4: 250, 300
```

### Three Series Line Chart

```plainviz
Type: Line
Title: Product Sales Trend
Legend: Product A, Product B, Product C

Jan: 100, 80, 60
Feb: 120, 90, 75
Mar: 140, 100, 90
Apr: 160, 110, 100
```

### Year-over-Year Comparison

```plainviz
Type: Bar
Title: Quarterly Revenue
Legend: 2022, 2023, 2024

Q1: $1.2M, $1.5M, $1.8M
Q2: $1.4M, $1.7M, $2.1M
Q3: $1.6M, $2.0M, $2.4M
Q4: $1.8M, $2.2M, $2.7M
```

---

## Business Use Cases

### Sales Report

```plainviz
Type: Bar
Title: Sales by Region
Subtitle: Q4 2024

North America: $2,500,000
Europe: $1,800,000
Asia Pacific: $1,200,000
Latin America: $600,000
```

### Project Status

```plainviz
Type: Pie
Title: Project Status

Completed: 45
In Progress: 30
Planned: 15
On Hold: 10
```

### Customer Satisfaction

```plainviz
Type: Donut
Title: Customer Satisfaction Survey

Very Satisfied: 45
Satisfied: 30
Neutral: 15
Unsatisfied: 10
```

### Monthly Metrics

```plainviz
Type: Line
Title: Monthly Active Users
Legend: Mobile, Web

Jan: 50000, 30000
Feb: 55000, 32000
Mar: 62000, 35000
Apr: 70000, 38000
May: 78000, 42000
Jun: 85000, 45000
```

---

## Technical Use Cases

### API Response Times

```plainviz
Type: Line
Title: API Latency (ms)

/users: 45
/products: 120
/orders: 85
/auth: 30
/search: 200
```

### Server Resources

```plainviz
Type: Bar
Title: Server CPU Usage (%)

Server 1: 65
Server 2: 78
Server 3: 45
Server 4: 82
```

### Error Distribution

```plainviz
Type: Pie
Title: Error Types

4xx Client Errors: 45
5xx Server Errors: 20
Timeouts: 25
Network Errors: 10
```

### Deployment Frequency

```plainviz
Type: Bar
Title: Weekly Deployments
Legend: Staging, Production

Week 1: 12, 3
Week 2: 15, 4
Week 3: 10, 2
Week 4: 18, 5
```

---

## With Comments

```plainviz
Type: Bar
Title: Quarterly Results

# Revenue figures in millions
Q1: 10
Q2: 15
Q3: 12  // Lower due to seasonality
Q4: 20  // Holiday boost
```

---

## Minimal Examples

### Simplest Bar Chart

```plainviz
A: 10
B: 20
C: 30
```

### With Just Title

```plainviz
Title: Simple Chart

X: 100
Y: 200
```

---

## Cloud API URLs

### Simple Bar Chart

```
https://api.plainviz.com/api/render?code=Type:Bar%0AApples:50%0AOranges:30%0ABananas:45
```

### Pie Chart with Title

```
https://api.plainviz.com/api/render?code=Type:Pie%0ATitle:Market%20Share%0AApple:45%0ASamsung:30%0AOthers:25
```

### Light Theme

```
https://api.plainviz.com/api/render?code=Type:Bar%0ASales:100%0ACosts:60&theme=light
```

### Custom Size

```
https://api.plainviz.com/api/render?code=Type:Line%0AJan:10%0AFeb:20%0AMar:30&width=800&height=400
```

---

## Embedding Examples

### HTML Image Tag

```html
<img src="https://api.plainviz.com/api/render?code=Type:Bar%0AA:10%0AB:20%0AC:30" alt="Chart" />
```

### Markdown

```markdown
![Sales Chart](https://api.plainviz.com/api/render?code=Type:Bar%0ASales:100%0ACosts:60)
```

### GitHub README Badge Style

```markdown
[![Revenue](https://api.plainviz.com/api/render?code=Type:Bar%0AQ1:100%0AQ2:150&width=300&height=200)](https://example.com)
```

---

## Related

- [Syntax Reference](./syntax.md) - Complete syntax guide
- [Chart Types](./chart-types.md) - Detailed chart type documentation
- [Cloud API](./cloud-api.md) - API reference
