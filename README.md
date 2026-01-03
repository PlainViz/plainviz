# PlainViz

PlainViz is a **plain-text-first data visualization language and toolkit**.

It lets you describe charts as readable text — and render them programmatically.

**Current focus:** bar charts
**Status:** early stage (APIs and syntax may change)

---

## 15-Second Example (Bar Chart)

```yaml
Type: Bar
Title: Monthly Sales

Jan: 20
Feb: 45
Mar: 80
Apr: 60
```

**Intent:**
A bar chart whose structure, labels, and values are fully visible as plain text.

**Output (planned):**
SVG (reference renderer) → Canvas / others later

---

## What Is PlainViz?

PlainViz explores a simple idea:

> **Data visualizations should be writable, reviewable, and understandable as plain text.**

Instead of configuring charts through:

* large JSON objects
* imperative drawing code
* opaque UI state

PlainViz aims to provide:

* a **text-based notation** for charts and visual structures
* a **declarative, readable syntax** suitable for version control
* a **tooling layer** that can render or transform these descriptions

You can think of it as a step toward:

* *Markdown-like authoring* for data visualization
* a shared textual format for charts across tools
* visual intent that can be reviewed in pull requests

---

## Why Plain Text?

Plain text has some important properties:

* works naturally with Git and diff
* easy to read, write, and review
* survives copy/paste, chat tools, and documentation
* makes visual intent explicit, not hidden in UI state

PlainViz is an attempt to bring these properties to data visualization.

---

## Why Start with Bar Charts?

Bar charts are intentionally chosen as the first focus because:

* they are structurally simple
* they expose core design questions (axes, scale, labels, values)
* they are common in product, business, and technical contexts

Starting with bar charts helps keep:

* the language surface area small
* the mental model clear
* experimentation focused

Other chart types are **out of scope for now**.

---

## Current Status

This project is in a very early stage.

At the moment:

* the language syntax is still being explored
* there is no stable renderer or runtime API
* the npm package exists to reserve the name and establish the entry point

If you install the package today, expect **placeholders**, not a finished tool.

---

## Installation

```bash
npm install plainviz
```

> Note: Installation is currently for early adopters and experimentation only.

---

## Roadmap (High Level)

This is direction, not a promise:

* define a minimal, expressive core syntax (bar charts first)
* build a reference parser
* implement a reference SVG renderer
* document the language with concrete examples

The goal is to keep:

* the surface area small
* the intent explicit
* the abstraction honest

---

## Repository & Links

* npm: [https://www.npmjs.com/package/plainviz](https://www.npmjs.com/package/plainviz)
* GitHub: [https://github.com/PlainViz/plainviz](https://github.com/PlainViz/plainviz)
* Website / Docs: [https://plainviz.com](https://plainviz.com)

---

## Contributing

The project is not yet ready for broad contribution, but:

* issues and conceptual discussions are welcome
* feedback on syntax and mental models is especially useful

Contribution guidelines will be added as the project stabilizes.

---

## License

MIT
