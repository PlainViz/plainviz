# PlainViz

PlainViz is a **plain-text-first data visualization language and toolkit**.

It lets you describe charts and visual structures using readable text, and turn them into visual output programmatically.

> Status: **early stage**.
> The language and APIs are evolving and may change.

---

## What is PlainViz?

PlainViz explores a simple idea:

> **Data visualizations should be writable, reviewable, and understandable as plain text.**

Instead of configuring charts through large JSON objects or imperative code, PlainViz aims to provide:

- A **text-based notation** for charts and visual structures
- A **declarative, readable syntax** suitable for version control
- A **tooling layer** that can render or transform these descriptions

You can think of it as a step toward:

- "Markdown-like" authoring for data visualization
- A shared textual format for charts across tools
- Visual intent that can be reviewed in code reviews

---

## Why Plain Text?

Plain text has some important properties:

- It works well with **Git and diff**
- It is easy to **read, write, and review**
- It survives copy/paste, chat tools, and documentation
- It makes **visual intent explicit**, not hidden in UI state

PlainViz is an attempt to bring these properties to data visualization.

---

## Current Status

This project is in its **very early stage**.

Right now:

- The language syntax is still being explored
- There is no stable renderer or runtime API
- The npm package is published to reserve the name and establish the project entry point

If you install the package today, you should expect **placeholders**, not a finished tool.

---

## Installation

```bash
npm install plainviz
```

> Note: Installing the package today is mainly for early adopters and experimentation.

---

## Roadmap (high level)

This is a rough direction, not a promise:

- Define a minimal, expressive core syntax
- Build a reference parser
- Experiment with one or two render targets (e.g. SVG / Canvas)
- Document the language with examples

The goal is to keep the surface area small and the intent clear.

---

## Repository & Docs

- **npm**: https://www.npmjs.com/package/plainviz
- **GitHub**: https://github.com/PlainViz/plainviz
- **Website / Docs**: https://plainviz.com

---

## Contributing

The project is not yet ready for broad contribution, but:

- Issues and conceptual discussions are welcome
- Feedback on syntax and mental models is especially useful

More contribution guidelines will be added as the project stabilizes.

---

## License

MIT
