<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Managed by agent: keep sections and order; edit content, not structure -->

# AGENTS.md

**Precedence:** the **closest `AGENTS.md`** to the files you're changing wins. Root holds global defaults only.

## What this repo is

A 30-minute conference talk: *"Stop Building Portals, Start Building Conversations — Generative UI for Platform Engineering."* The repo bundles the slide deck, a live MCP App demo, and a custom CopilotKit-based developer portal.

This is a **demo / educational artifact**, not a production codebase. Optimize for clarity over robustness.

## Index of scoped AGENTS.md (MUST read when working in these directories)

| Directory | Stack | Read first |
|-----------|-------|------------|
| `slides/` | Slidev + pnpm | [`slides/AGENTS.md`](./slides/AGENTS.md) |
| `demo/` | TypeScript + Express + MCP SDK (npm) | [`demo/AGENTS.md`](./demo/AGENTS.md) |
| `demo/copilotkit/` | Next.js 16 + CopilotKit + AG-UI (pnpm) | [`demo/copilotkit/AGENTS.md`](./demo/copilotkit/AGENTS.md) |

> When you read or edit files in a listed directory, **load its AGENTS.md first**. It contains directory-specific conventions that override this root file.

## File Map

```
.
├── AGENTS.md                  ← this file
├── .mcp.json                  ← MCP servers used by agents (context7, pulumi, yaah)
├── slides/                    ← Slidev deck (the talk itself)
│   ├── slides.md              ← canonical slide source
│   ├── snippets/              ← code excerpts imported into slides
│   └── public/                ← images, QR codes
├── demo/                      ← MCP App server (centerpiece demo)
│   ├── server.ts              ← tools + resources + UI registration
│   ├── main.ts                ← stdio | streamable-HTTP entrypoint
│   ├── mcp-app.html           ← single-page UI bundled into the resource
│   └── src/                   ← UI source (Vite-bundled)
└── demo/copilotkit/           ← Conversational IDP (Next.js app)
    ├── app/api/copilotkit/    ← agent runtime + MCP/A2UI middleware
    └── components/            ← canvas, dashboard, tools, store
```

## Three rendering families (talk terminology)

| Family | Used for | Package |
|--------|----------|---------|
| **MCP Apps** (open-ended HTML) | Catalog & resource detail pages | `@modelcontextprotocol/ext-apps` |
| **A2UI** (declarative JSON UI) | Generated work surfaces (deploy checks, Day 1/2 boards) | `@a2ui/web_core` + `@ag-ui/a2ui-middleware` |
| **AG-UI streaming** (frontend tools) | Live ops actions (deploy, rollback, scale) | `useFrontendTool` from `@copilotkit/react-core/v2` |

If you change demo code, identify which family it belongs to before touching it — the three families have different lifecycles and different host expectations.

## Workflow

1. **Before coding**: read the nearest `AGENTS.md`. For demo changes, also check the matching slide in `slides/slides.md` so the deck stays in sync with the code shown.
2. **After each change**: run the scoped check (`pnpm typecheck` in `demo/copilotkit/`, `npm run build` in `demo/`, `pnpm run build` in `slides/`).
3. **Before claiming done**: actually run the dev server and load the UI — type-check passing is not enough for an interactive demo.

## Boundaries

### Always Do
- Keep `slides/snippets/*` in sync with what the demo code actually does. The audience reads the snippet and then sees the demo — divergence breaks the talk.
- Use the exact package names from the talk (`@modelcontextprotocol/ext-apps`, `@copilotkit/react-core`, `@ag-ui/a2ui-middleware`) — these are quoted on slides.

### Ask First
- Adding new top-level directories or new scopes.
- Bumping any of the demo-critical packages: `@modelcontextprotocol/ext-apps`, `@modelcontextprotocol/sdk`, `@copilotkit/*`, `@ag-ui/*`, `@a2ui/web_core`. These ship breaking changes often; check that the demo still renders.
- Replacing or refactoring the rendering-family split (MCP Apps / A2UI / AG-UI). That split *is* the talk.

### Never Do
- Commit `.env.local`, `.env*.local`, or anything containing an Anthropic API key. `demo/copilotkit/.env.example` is the only env file that belongs in git.
- Delete `slides/slides.md.bak` without asking — it's a manual checkpoint of the deck.
- Modify `node_modules/`, `*.tsbuildinfo`, `.next/`, `dist/`, `.slidev/`, or `pnpm-lock.yaml` / `package-lock.json` by hand. Let the package managers regenerate them.

## MCP servers available to agents

Defined in `.mcp.json` (root) and `slides/.mcp.json`:

| Server | Type | Purpose |
|--------|------|---------|
| `context7` | stdio | Library docs lookup |
| `pulumi` | http | Pulumi-related queries |
| `yaah` | stdio | Project planning / workflow helpers |

## When instructions conflict
The nearest `AGENTS.md` wins. Explicit user prompts override files.
