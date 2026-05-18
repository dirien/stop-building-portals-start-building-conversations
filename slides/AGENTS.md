<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Managed by agent: keep sections and order; edit content, not structure -->

# AGENTS.md — slides/

## Overview

Slidev deck for the 30-minute talk. The deck is the **canonical artifact** — `demo/` and `demo/copilotkit/` exist to back up specific slides. If you change a slide's claims, update the corresponding demo. If you change the demo, update the slide that shows it.

`CLAUDE.md` in this directory is a symlink to this file.

## Setup

```bash
pnpm install      # pnpm only — do not use npm/yarn here
pnpm run dev      # http://localhost:3030
```

No env vars required. PDF export needs Playwright system deps the first time.

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Dev server | `pnpm run dev` | Slidev at `http://localhost:3030` |
| Build | `pnpm run build` | Static SPA in `dist/` |
| Export PDF | `pnpm run export` | Requires Playwright deps on first run |
| Install | `pnpm install` | pnpm only — do not use npm here |

`pnpm-lock.yaml` is authoritative. Adding `package-lock.json` here is wrong.

## File Map

```
slides/
├── slides.md             ← canonical slide source (~26 slides)
├── slides.md.bak         ← manual checkpoint — do not delete without asking
├── style.css             ← global slide styles
├── snippets/             ← code excerpts imported into slides via <<< @/snippets/...
│   ├── mcp-app-server.ts
│   ├── mcp-app-client.ts
│   ├── agui-example.ts
│   ├── backstage-mcp-plugin.ts
│   ├── json-render-example.ts
│   └── openui-example.tsx
├── public/               ← images, meme assets, speaker photos
└── components/           ← Slidev Vue components (if any)
```

## Workflow

1. Read the slide you're editing in `slides.md` first — slides have presenter notes in `<!-- … -->` blocks that explain timing and intent. Don't rewrite a slide whose notes you haven't read.
2. **Code snippets are not free-form** — they're imported with `<<< @/snippets/<file>` (Slidev's external-snippet syntax). Editing the snippet changes what shows on screen.
3. When you edit a snippet that demonstrates a real package API (MCP Apps, AG-UI, A2UI, json-render, OpenUI), compile-check it against the matching package version installed in `../demo/` or `../demo/copilotkit/` so the slide doesn't ship a stale API.
4. Run `pnpm run dev` and **actually click through the affected slides** before saying done. Layout breaks are not caught by any check.

## Code style / Conventions

Slidev conventions used in this deck:

| Pattern | Example |
|---------|---------|
| Theme | `theme: nord` (frontmatter) |
| Slide separator | `---` on its own line |
| Layouts | `layout: cover \| default \| two-cols \| ...` in per-slide frontmatter |
| External snippets | `<<< @/snippets/file.ts` |
| Presenter notes | HTML comments **after** the slide body |
| Custom CSS | Inline `class="!text-[...]"` (Tailwind-like, Slidev-shipped) |

## Boundaries

### Always Do
- Keep speaker attribution (`Engin Diri` / `Hila Fish`) accurate on title and section slides.
- Mirror package names on slides exactly to what's installed in `demo/` and `demo/copilotkit/`. The audience will read the slide and then see the demo — version drift is visible.
- Preserve presenter notes when restructuring a slide. They encode timing decisions you don't have context for.

### Ask First
- Reordering slides — the deck has a deliberate narrative arc with timing budgets in the notes.
- Replacing assets in `public/` — some are speaker photos with no source elsewhere.
- Bumping Slidev or theme versions — breaking changes happen and there is no test suite.

### Never Do
- Delete `slides.md.bak` without explicit confirmation.
- Commit `.slidev/` or `dist/` (already gitignored).
- Replace `pnpm` commands with `npm` or `yarn`.

## Security

- Speaker photos in `public/` (`engin-diri.jpg`, `hila-fish.jpg`, `ido-liad-mcp-summit.jpg`) are personal images — do not republish outside this deck.
- Do not embed API keys or live endpoints in snippets shown on stage.

## PR / Commit checklist

- [ ] `pnpm run build` succeeds
- [ ] Affected slides clicked through in `pnpm run dev` (layout broke ≠ caught by build)
- [ ] If a snippet was changed, the API shape still matches the installed package in `../demo/` or `../demo/copilotkit/`
- [ ] Presenter notes preserved or updated

## Examples / Patterns to Follow

- External snippet: `<<< @/snippets/mcp-app-server.ts` (loads the file at build time)
- Two-column layout: set `layout: two-cols` in the slide's frontmatter and split content with `::right::`
- Speaker notes: HTML comment **after** the slide body, before the next `---`

## When stuck

- Check the presenter note (HTML comment) on the slide for intent.
- Snippets and slide content drift — when in doubt, the running `demo/` is the source of truth for what actually works.
