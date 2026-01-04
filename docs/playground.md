# Playground Guide

The PlainViz Playground is a web-based editor for creating and previewing charts in real-time.

## Access

Visit [plainviz.com](https://plainviz.com) to open the Playground.

## Interface

The Playground has two main panels:

| Panel | Description |
|-------|-------------|
| **Left (Editor)** | Write PlainViz code |
| **Right (Preview)** | See the rendered chart |

Changes in the editor are reflected instantly in the preview.

## Features

### Code Editor

- Syntax highlighting for PlainViz
- Real-time error feedback
- Auto-save to browser storage

### Example Templates

The Playground includes built-in examples for quick start:

- Bar Chart
- Line Chart
- Pie Chart
- Area Chart
- Donut Chart
- Multi-Series Charts

Click on an example to load it into the editor.

### Help Sidebar

Access documentation and syntax reference directly from the Playground.

## Workflow

1. **Start with an example** - Select a template that's close to what you need
2. **Edit the code** - Modify labels, values, and settings
3. **Preview instantly** - See changes reflected in real-time
4. **Copy or export** - Use the generated chart

## Error Handling

When your code has syntax errors:

- The preview shows an error message
- The editor highlights the problematic line
- Error hints suggest how to fix the issue

Example error:
```
Line 5: "fifty" is not a valid number
Hint: Use a number like: Apples: 100
```

## Tips

### Quick Start

Start with this minimal example:

```plainviz
Type: Bar

A: 10
B: 20
C: 30
```

### Adding a Title

```plainviz
Type: Bar
Title: My First Chart

A: 10
B: 20
C: 30
```

### Changing Chart Type

Just change the `Type:` line:

```plainviz
Type: Pie
Title: My First Chart

A: 10
B: 20
C: 30
```

## Exporting Charts

### Copy SVG

The rendered chart is an SVG that you can:

1. Right-click and "Save Image As..."
2. Copy and paste into design tools
3. Embed directly in HTML

### Use Cloud API

For permanent URLs, use the [Cloud API](./cloud-api.md):

```
https://api.plainviz.com/api/render?code=Type:Bar%0AA:10%0AB:20
```

## Keyboard Shortcuts

The editor supports standard text editing shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + /` | Toggle comment |

## Browser Support

The Playground works best in modern browsers:

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Offline Usage

The Playground requires an internet connection. For offline usage, consider using the [npm packages](./packages/core.md) in your local development environment.
