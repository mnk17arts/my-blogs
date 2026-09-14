# Agent Operating Handbook — F.Y.I.

This document defines the architecture, editorial standards, and step-by-step operating flow for AI agents working in this repository. Any agent entering a fresh chat in this workspace must follow these rules.

---

## 1. Project Overview & Philosophy

- **Publication Name:** **F.Y.I.** (`F.Y.I. <span>Tech</span>`)
- **Live URL:** [mnk17arts.github.io/my-blogs](https://mnk17arts.github.io/my-blogs/) (GitHub Pages)
- **Tagline:** *"For your information — and future intelligence."*
- **Mission:** A high-clarity, future-facing publication exploring software systems, computer architecture, and emerging technology.
- **Editorial Tenets:**
  1. **One idea at a time:** Focus deeply on a single concept, invariant, or architecture.
  2. **Plain explanations over hype:** Deconstruct complex mechanisms with everyday analogies before diving into technical rigor.
  3. **Rich visual media:** Every post should feature visual aids—custom SVG flow diagrams (`.post-diagram`), comparison tables (`.data-table`), and structured callouts (`.callout-box`).
  4. **Primary source citations:** Always link to authoritative specifications (3GPP, RFCs, IEEE, NIST, academic papers) in `.sources`.

---

## 2. Technical Architecture & Invariants

- **Zero Build / Static Architecture:** Pure Vanilla HTML5, CSS3, and modern JavaScript.
  - **NO** bundlers (Vite, Webpack).
  - **NO** frontend frameworks (React, Vue, Next.js).
  - **NO** build step required for deployment.
- **Theme System (Light & Dark Mode):**
  - Controlled by `data-theme="dark"` / `data-theme="light"` on `<html>`.
  - Persisted in `localStorage` under `'fyi_theme'`.
  - Auto-detects OS `prefers-color-scheme`.
  - Anti-FOUC inline script in `<head>` ensures seamless page loads without flash.
- **Centralized Content Registry (`posts.json`):**
  - All articles are indexed in [posts.json](file:///c:/Users/mnk17.LAPTOP-T3A6M7N9/MNK_Projects/mnk17blogs/posts.json).
  - [script.js](file:///c:/Users/mnk17.LAPTOP-T3A6M7N9/MNK_Projects/mnk17blogs/script.js) dynamically loads `posts.json` to:
    1. Render the **Latest Note** and **Recent Notes** feed on `index.html`.
    2. Synchronize and populate **Sidebar Categories and Article Counts** across every single page on the site.
  - **CRITICAL INVARIANT:** **Never manually edit `index.html` or old post sidebars when adding a new post.** Adding an entry to `posts.json` automatically updates the homepage and all sidebars.

---

## 3. Fresh-Chat Quickstart Procedure

When starting in a fresh conversation, follow this exact sequence:

1. **Check Git State:**
   ```powershell
   git status
   git branch
   git log -n 3 --oneline
   ```
2. **Review Current Content:**
   - Read [posts.json](file:///c:/Users/mnk17.LAPTOP-T3A6M7N9/MNK_Projects/mnk17blogs/posts.json) to see what has already been published.
   - Inspect the reference template at [posts/template-post.html](file:///c:/Users/mnk17.LAPTOP-T3A6M7N9/MNK_Projects/mnk17blogs/posts/template-post.html).
3. **Identify the Task:**
   - Is it drafting a new blog post? (e.g. on branch `blog-3`)
   - Is it enhancing styles or fixing a bug?
   - Is it improving the dynamic engine?

---

## 4. Standard Workflow: Publishing a New Blog Post

Publishing a new article requires only **two core files** to be touched:

### Step 1: Scaffold and Write the Post
1. Copy [posts/template-post.html](file:///c:/Users/mnk17.LAPTOP-T3A6M7N9/MNK_Projects/mnk17blogs/posts/template-post.html) to `posts/<slug>.html`.
2. Fill in the `<title>`, `<meta description>`, and `<link rel="canonical">`.
3. Draft the article adhering to the editorial blueprint:
   - **Lead Paragraph (`.lead`):** The central counter-intuitive premise or mental model.
   - **Intuitive Explanation:** Everyday analogy and plain language.
   - **Callout Card (`.callout-box.info` / `.callout-box.warning` / `.callout-box.quote`):** Highlighting a fundamental rule or trade-off.
   - **Visual Flow Diagram (`.post-diagram`):** Clean inline SVG illustration of the data/control flow.
   - **Technical Comparison Table (`.data-table`):** Structured specs or comparative dimensions.
   - **"Why this matters":** Real-world consequences for software engineers and systems.
   - **Takeaways (`<ul>`):** 3–4 bulleted insights.
   - **Primary Citations (`.sources`):** Links to official specifications and whitepapers.

### Step 2: Register in `posts.json`
Add the new post to the top of [posts.json](file:///c:/Users/mnk17.LAPTOP-T3A6M7N9/MNK_Projects/mnk17blogs/posts.json):
```json
{
  "id": "<slug>",
  "slug": "<slug>",
  "title": "<Full Post Title>",
  "category": "<Category Name>",
  "date": "DD Month YYYY",
  "readTime": "X min",
  "excerpt": "A compelling 1-2 sentence overview of the note.",
  "url": "posts/<slug>.html",
  "featured": true
}
```
*(Set `featured: true` on the new post and change the previous post's `featured` flag to `false` if you want the new post highlighted as the Latest Note).*

### Step 3: Verification
1. Validate JSON syntax:
   ```powershell
   python -c "import json; json.load(open('posts.json', encoding='utf-8'))"
   ```
2. Launch a temporary local preview server:
   ```powershell
   python -m http.server 8080
   ```
3. Verify that:
   - `http://localhost:8080/index.html` displays the new post in the feed.
   - The sidebar category links and counts update automatically.
   - The article renders cleanly with reading progress bar, light/dark mode, and diagrams.
   - No encoding errors (no `?` characters in place of `&rarr;`).
4. Commit changes:
   ```powershell
   git add posts/<slug>.html posts.json
   git commit -m "[FEAT] Blog-X: <Title>"
   ```

---

## 5. Design System Tokens & Classes

| Element / Utility | Class / Token | Usage |
| :--- | :--- | :--- |
| **Colors** | `--paper`<br>`--ink`<br>`--muted`<br>`--accent`<br>`--accent-soft` | Adapts dynamically between light & dark themes |
| **Theme Toggle** | `.theme-toggle-btn` | Minimalist Sun/Moon button in sidebar & mobile header |
| **Fonts** | `'DM Sans', sans-serif`<br>`'Newsreader', serif` | UI/body text and editorial serif headlines |
| **Reading Bar** | `#reading-progress` | Injected automatically by `script.js` |
| **Callout Boxes** | `.callout-box.info`<br>`.callout-box.warning`<br>`.callout-box.quote` | Concept highlights, warnings, and quotes |
| **Comparison Tables** | `<div class="table-wrap"><table class="data-table">` | Clean zebra-styled specs table |
| **Code Blocks** | `<div class="code-block"><pre><code>` | Monospaced snippet card |
| **Diagrams** | `<figure class="post-diagram"><svg>...</svg></figure>` | Responsive inline SVG diagrams |
| **Audio Reader** | `<div class="audio-group">` | In-browser speech synthesis with speed control |
| **Share Toolbar** | `<div class="share-group">` | One-click copy link, Web Share API, and social share links |
| **Arrows / Entities** | Use `&rarr;` and `&middot;` | **Never** use raw characters that could degrade to `?` |

