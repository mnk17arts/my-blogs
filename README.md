# F.Y.I. (Tech)

> *"For your information — and future intelligence."*

F.Y.I. is a personal publication dedicated to deconstructing software systems, computer architecture, and emerging technologies from first principles.

This project started from a simple interest: reading about Ambient IoT and noticing how quietly transformative energy-harvesting devices could be. That sparked the idea for this publication: not a noisy content machine, but a quiet, high-clarity space to explore interesting concepts with depth, visual models, and zero hype.

---

## What this publication is

F.Y.I. is a home for:

- **Research-informed notes:** grounded in official specifications (3GPP, IEEE, RFC, NIST) and research papers.
- **Rich visual media & diagrams:** custom SVG flowcharts, comparison tables, and concept callouts.
- **Deep systems intuition:** exploring how things actually work beneath operating system abstractions.
- **Dual themes:** seamless Light and Dark mode with system preference auto-detection.

---

## Publishing Philosophy

- **One idea at a time:** deep exploration of a single invariant or architecture.
- **Clear explanations over hype:** plain language without stripping essential technical nuance.
- **Research first, writing second:** verified against primary specifications and code.
- **Publication when ready:** a thoughtful archive built sustainably, note by note.

---

## Project Architecture

This publication is built as a zero-dependency, static website hosted on GitHub Pages:

- `index.html` — homepage feed (dynamically hydrated from `posts.json`)
- `about.html` — publication manifesto and philosophy
- `styles.css` — typography tokens, light/dark theme variables, responsive tables, and diagram classes
- `script.js` — dynamic registry auto-loader, light/dark theme engine, reading progress bar, and mobile drawer
- `posts.json` — centralized article registry (titles, dates, slugs, categories)
- `posts/template-post.html` — reference post template with pre-styled callouts, diagrams, and tables
- `posts/` — published articles
- `AGENTS.md` — operating handbook for AI agents working in this repository

---

## How to add a new post

1. Copy `posts/template-post.html` to `posts/<slug>.html` and write your article.
2. Register the post by adding an entry to `posts.json`.
3. `index.html` and sidebar category links across all pages update automatically.
