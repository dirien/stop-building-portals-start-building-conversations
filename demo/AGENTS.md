<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Managed by agent: keep sections and order; edit content, not structure -->

# AGENTS.md — demo/

## Overview

A single MCP server that exposes a **Platform Service Catalog** as both MCP tools/resources and an MCP App UI. Connects to Claude Desktop, VS Code Copilot, or any MCP host that supports `ui://` resources.

This is the **centerpiece live demo** for the talk. It must `npm run build && npm run serve` cleanly on a fresh checkout.

## Setup

```bash
cd demo
npm install
npm run build      # produces dist/mcp-app.html (single-file UI bundle)
npm run serve      # http://localhost:3001/mcp (StreamableHTTP)
# or
npm run serve:stdio  # for Claude Desktop / stdio hosts
```

No env vars required. `PORT=<n>` overrides the HTTP port (default 3001).

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Install | `npm install` | npm here, not pnpm |
| Build UI | `npm run build` | tsc typecheck + Vite single-file bundle |
| Serve (HTTP) | `npm run serve` | `tsx --watch main.ts` → `http://localhost:3001/mcp` |
| Serve (stdio) | `npm run serve:stdio` | for Claude Desktop / direct stdio hosts |
| Dev mode | `npm run dev` | concurrent watch+serve |
| One-shot | `npm run start` | build then serve in dev mode |

`PORT=<n>` env var changes the HTTP port. There is no test suite — the dev loop is "build, connect from a host, click around."

## File Map

```
demo/
├── main.ts              ← entrypoint: --stdio flag → StdioServerTransport, else Express/StreamableHTTP
├── server.ts            ← createServer(): registers tools, resources, and the MCP App UI
├── mcp-app.html         ← root HTML for the embedded app (built by Vite into a single inline bundle)
├── src/
│   ├── mcp-app.ts       ← UI logic loaded into mcp-app.html
│   └── global.css
├── package.json
├── tsconfig.json        ← strict, ESM, bundler resolution, noEmit
└── vite.config.ts       ← uses vite-plugin-singlefile, INPUT env var
```

## Code style / Conventions

- Strict TypeScript, ESM only, `moduleResolution: bundler`, `noEmit: true` (the runtime is `tsx`).
- One-file server: `server.ts` registers tools, resources, and the catalog data in-line. Do not split it.
- All MCP App glue (`registerAppTool`, `registerAppResource`, `RESOURCE_MIME_TYPE`) comes from `@modelcontextprotocol/ext-apps/server` — no hand-rolled mime strings or URIs.

## How the MCP App resource is wired

1. `server.ts` calls `registerAppResource()` from `@modelcontextprotocol/ext-apps/server`, pointing at the **built** `dist/mcp-app.html` (Vite's single-file output).
2. Tools call `registerAppTool()` so the host knows certain tool results should render via the UI resource (mime type from `RESOURCE_MIME_TYPE`).
3. `main.ts` switches between `StdioServerTransport` (Claude Desktop) and `StreamableHTTPServerTransport` (web hosts, basic-host test client).

**Implication for agents**: if you change `src/mcp-app.ts` or `mcp-app.html`, you **must** re-run `npm run build` before the change shows up over MCP. The server reads from `dist/`.

## Workflow

1. Read `server.ts` end-to-end before changing tools or data. The service catalog is intentionally rich; the shape is referenced from slides.
2. After UI changes: `npm run build`, then reconnect the MCP host.
3. After server changes: `tsx --watch` reloads automatically, but **the host must reconnect** to see new tools/resources.
4. Verify with at least one real host (Claude Desktop, VS Code Copilot, or `basic-host`) before claiming done. `tsc --noEmit` does not prove the demo works.

## Boundaries

### Always Do
- Keep tool descriptions in `server.ts` quotable — they appear in screenshots in the deck.
- Preserve `RESOURCE_MIME_TYPE` from `@modelcontextprotocol/ext-apps/server` — do not hardcode the MIME string.
- Match the catalog data shape to what the UI in `src/mcp-app.ts` actually renders. Adding fields without rendering them is fine; removing rendered fields breaks the demo.

### Ask First
- Bumping `@modelcontextprotocol/sdk` or `@modelcontextprotocol/ext-apps` — the App protocol is pre-1.0 and ships breaking changes.
- Splitting `server.ts` into modules — it is intentionally one file so the audience can read it on screen.

### Never Do
- Commit `dist/` (gitignored at root).
- Replace npm with pnpm here — `demo/copilotkit/` uses pnpm but `demo/` uses npm and a `package-lock.json` exists.
- Add a real database or external dependency — the catalog data lives in-memory in `server.ts` by design.

## Security

- The catalog data in `server.ts` is fabricated — but treat it as if real: do not put company names, IPs, or AWS account IDs in there.
- The server has CORS open (`app.use(cors())`) because it's a demo. **Never expose this beyond `localhost` without locking that down.**

## PR / Commit checklist

- [ ] `npm run build` succeeds (typecheck + Vite bundle)
- [ ] At least one MCP host (Claude Desktop, VS Code Copilot, or `basic-host`) connects and can call a tool that renders the UI
- [ ] If `src/mcp-app.ts` or `mcp-app.html` changed: re-ran `npm run build` and reconnected the host
- [ ] Slide snippets in `../slides/snippets/mcp-app-server.ts` and `mcp-app-client.ts` still match the API shape used here

## Examples / Patterns to Follow

Real pattern from `server.ts` (mirror it; do not invent new shapes):

```ts
registerAppTool(
  server,
  "show-catalog",
  {
    title: "Platform Service Catalog",
    description: "Shows the platform service catalog…",
    inputSchema: {},
    _meta: { ui: { resourceUri: RESOURCE_URI } },
  },
  async () => ({
    content: [{ type: "text", text: "…" }],
    structuredContent: { view: "catalog", services: [/* … */] },
  }),
);
```

`RESOURCE_URI` is the `ui://…` URI registered once via `registerAppResource`, then referenced from every tool that should render UI.

## When stuck

- The `@modelcontextprotocol/ext-apps` package has a `basic-host` example — point it at `http://localhost:3001/mcp` to reproduce host behavior without Claude Desktop.
- If a tool result doesn't render as UI, check that the tool was registered with `registerAppTool` and that the resource URI in the result matches what `registerAppResource` exposes.
