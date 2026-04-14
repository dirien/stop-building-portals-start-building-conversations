# Plan: Build "Stop Building Portals, Start Building Conversations"

## Context

Engin Diri has a 30-minute conference talk planned about how platform engineering should move from portal-based UIs to conversation-embedded UIs using Generative UI technologies. The repo is currently empty. This plan covers scaffolding the Slidev presentation, writing all ~26 slides with speaker notes, and building a live demo MCP App server.

---

## Part 1: Project Scaffolding

### Directory Structure

```
/
  slides.md              # Main Slidev deck (all 26 slides)
  package.json           # Slidev dependencies + scripts
  .gitignore
  public/                # Static assets (images, QR code)
  snippets/              # Code snippets imported into slides
    mcp-app-server.ts
    mcp-app-client.ts
    openui-example.tsx
    json-render-example.ts
    agui-example.ts
  demo/                  # MCP App demo server
    package.json
    tsconfig.json
    vite.config.ts
    server.ts
    main.ts
    src/
      mcp-app.html
      mcp-app.ts
      global.css
  .github/workflows/deploy.yml
  CLAUDE.md
  README.md
```

### Step 1A: Root Slidev Setup

Create `package.json` with scripts `dev`, `build`, `export`. Install:
- `@slidev/cli`, `@slidev/theme-seriph`
- `@iconify-json/mdi`, `@iconify-json/carbon`, `@iconify-json/logos`
- `playwright-chromium` (PDF export)

`slides.md` headmatter:
- `theme: seriph`, `colorSchema: dark`, `duration: 30min`, `timer: countdown`
- Fonts: Inter (sans), Fira Code (mono)
- `download: true`, `transition: slide-left`

### Step 1B: Demo MCP App Server Setup

`demo/package.json` dependencies:
- `@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`
- `express`, `cors`, `zod`
- Dev: `typescript`, `tsx`, `vite`, `vite-plugin-singlefile`

Vite config uses `vite-plugin-singlefile` to bundle `src/mcp-app.html` into a single file served as an MCP resource.

---

## Part 2: Slide-by-Slide Content (~26 slides)

### Act 1: The Problem (6 min, 5 slides)

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 1 | Cover | `cover` | Title + subtitle + author | Icons |
| 2 | The Split Screen | `two-cols` | Portal screenshot vs conversation with embedded UI | v-click reveal |
| 3 | Problem Statement | `center` | "Every portal tab is a context switch" | v-mark highlight |
| 4 | Portal Adoption Curve | `default` | Launch → Power users only → Back to CLI → Shelfware | Mermaid flow |
| 5 | What Developers Want | `default` | Stay in workflow, on-demand capabilities, rich feedback | v-clicks bullets |

### Act 2: The Paradigm Shift (25 min, 17 slides)

**Section 3 — Generative UI (4 slides)**

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 6 | What is Generative UI? | `center` | Definition with v-mark.box | |
| 7 | Three-Pattern Spectrum | `default` | Token-Heavy → Hybrid → UI-Resource | Mermaid + table |
| 8 | Emerging GenUI Stack | `default` | Full architecture: Developer → AI → GenUI → Platform | Mermaid diagram |
| 9 | Why Now? | `default` | MCP critical mass, token costs, host UIs ready | v-clicks |

**Section 4 — MCP Apps Deep Dive [CENTERPIECE] (5 slides)**

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 10 | SEP-1865 Section | `section` | "MCP Apps" divider | |
| 11 | Architecture | `default` | Full request flow: Dev → Host → LLM → Server → UI render | Mermaid sequence |
| 12 | Server-Side Code | `default` | `registerAppTool` + `registerAppResource` | Code from snippets/ |
| 13 | Client-Side Code | `default` | `App` class, `ontoolinput`, `ontoolresult` | Code from snippets/ |
| 14 | LIVE DEMO | `center` | Demo: service catalog as MCP App | Switch to terminal |

**Section 5 — OpenUI (3 slides)**

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 15 | OpenUI Section | `section` | "OpenUI by Thesys" divider | |
| 16 | How OpenUI Works | `two-cols` | Flow diagram + code snippet | Mermaid + code |
| 17 | Token Cost Comparison | `fact` | "10-50x fewer tokens" + comparison table | |

**Section 6 — json-render (3 slides)**

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 18 | json-render Section | `section` | "json-render by Vercel Labs" divider | |
| 19 | Architecture | `two-cols` | Features list + code snippet | v-clicks + code |
| 20 | MCP Integration | `default` | Plain MCP → json-render enhanced | magic-move animation |

**Section 7 — AG-UI & Decision Matrix (2 slides)**

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 21 | AG-UI Protocol | `default` | Event types + CopilotKit hooks | Mermaid + code |
| 22 | Decision Matrix | `default` | When to use which technology | Table with v-clicks |

### Act 3: The Future (4 min, 4 slides)

| # | Title | Layout | Content | Visual |
|---|-------|--------|---------|--------|
| 23 | The Deeper Shift | `center` | "Your platform's first user is an AI agent" | v-mark.circle |
| 24 | Five Things This Quarter | `default` | Numbered actionable list | v-clicks |
| 25 | Resources | `default` | Links + QR code | Two-column |
| 26 | Closing | `cover` | "Stop Building Portals. Start Building Conversations." | v-mark.underline |

---

## Part 3: Demo Code Architecture

### Server (`demo/server.ts`)

Three MCP tools:
1. **`show-catalog`** — Lists all platform services. Returns `structuredContent` + text fallback + `_meta.ui.resourceUri: "ui://catalog/mcp-app.html"`
2. **`show-service`** — Shows detail for one service. Same UI resource, different data.
3. **`deploy-service`** — App-only tool (`visibility: ["app"]`), callable from UI only. Simulates deployment.

One MCP resource:
- `ui://catalog/mcp-app.html` — Serves the bundled HTML app from `dist/`

Mock data: 5-6 platform services (user-service, payment-api, notification-service, api-gateway, auth-service) with name, team, health status, last deploy.

Pattern reference: `/Users/dirien/Tools/repos/mcp-server/src/server/server.ts` for modular tool registration.

### Transport (`demo/main.ts`)

Supports `stdio` and `http` transport via CLI argument. HTTP uses `StreamableHTTPServerTransport` on port 3001.

### Client (`demo/src/mcp-app.ts`)

Uses `App` class from `@modelcontextprotocol/ext-apps`:
- `ontoolinput` → show loading state
- `ontoolresult` → render service grid (catalog) or detail view (service)
- Deploy button calls `app.callTool("deploy-service", ...)`
- Respects host theme via CSS variables (`--mcp-ui-background`, etc.)

Vanilla TypeScript + CSS (no React needed for demo simplicity).

### Snippet Files (`snippets/`)

Trimmed, slide-friendly versions of the demo code:
- `mcp-app-server.ts` (~35 lines) — registerAppTool + registerAppResource
- `mcp-app-client.ts` (~25 lines) — App class lifecycle
- `openui-example.tsx` (~20 lines) — Component definition + render
- `json-render-example.ts` (~20 lines) — JSON UI schema + renderer
- `agui-example.ts` (~15 lines) — AG-UI events + CopilotKit hooks

---

## Part 4: Implementation Sequence

1. Create root `package.json`, `.gitignore`, install Slidev deps → verify `pnpm run dev` works with minimal `slides.md`
2. Build `demo/` server: `server.ts`, `main.ts`, `vite.config.ts`, `tsconfig.json`, `package.json` → verify `npm run build` + `npm run serve`
3. Build client: `mcp-app.html`, `mcp-app.ts`, `global.css` → verify single-file bundle in `dist/`
4. Extract code snippets into `snippets/`
5. Write all 26 slides with content, Mermaid diagrams, code imports, animations, speaker notes
6. Add `public/` assets, GitHub Actions workflow
7. Write `README.md` and `CLAUDE.md`

---

## Part 5: Verification

1. `pnpm run dev` — all 26 slides render, Mermaid diagrams display, code has syntax highlighting
2. Presenter mode (press P) — speaker notes visible on every slide, 30-min countdown timer works
3. Code snippet imports — all `<<< @/snippets/*.ts` resolve with correct highlighting
4. `cd demo && npm run build` — `dist/mcp-app.html` generated as single file
5. `cd demo && npm run serve` — HTTP server on port 3001 responds to MCP requests
6. Demo with Claude Desktop — connect to `http://localhost:3001/mcp`, ask "Show me the service catalog", UI renders inline
7. Text fallback — call `show-catalog` from a non-UI client, verify JSON text response
8. `pnpm run export` — PDF generated with all slides
9. Walk through all slides in presenter mode — ~70 seconds per slide pace for 30 min target
