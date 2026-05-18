# PlatformOps — a conversation-native IDP

A working internal developer portal where the primary interface is conversation,
not a sidebar of pages. Backstage-style catalog, Port.io-style self-service,
Spinnaker-style live deploys — all delivered through one chat panel and one
canvas. The developer never opens a separate UI.

The implementation stack happens to be the canonical Agentic UI packages
(MCP Apps, A2UI, AG-UI on CopilotKit), but the *audience* should remember the
workflow, not the protocols.

> **The portal becomes plumbing. The conversation is the product.**

## What the IDP does

Five workflows, the way a developer would actually use them:

| Workflow | Where it lives | What it feels like |
| --- | --- | --- |
| **Service Catalog** | Sidebar → Service Catalog | Backstage-style browse: services, EKS clusters, Lambdas, AgentCore agents. Detail pages and create-* forms render as MCP App iframes inside the canvas. |
| **Golden Paths** | Sidebar → Golden Paths | Scaffold new services / clusters / lambdas / agents from vetted templates — the platform team's opinionated paths, no separate scaffolding portal. |
| **Self-Service Actions** | Sidebar → Self-Service · or the "Self-service actions ↗" button on any focused resource | Port.io-style Day 1 / Day 2 board, generated live from a fresh A2UI surface. Clicks fire back through the agent loop. |
| **Operations** | Sidebar → Operations | Recent deployments, on-call rotation, runbooks. Live deploys / rollbacks / scales stream into the canvas with all four phases ticking by. |
| **Cost & Governance** | Sidebar → Cost & Governance | Cost dashboards (rendered via the chart tool), audit log, policy posture. Every action is attributable to a user and tied to a source catalog record. |

## The implementation stack (under the hood)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Next.js 16  +  CopilotKit 1.57.1 (v2 API)                                    │
│  ────────────────────────────────────────────────────────────────────────    │
│                                                                                │
│  BACKEND  /app/api/copilotkit/[[...slug]]/route.ts                            │
│                                                                                │
│    new BuiltInAgent({                                                          │
│      model: anthropic("claude-sonnet-4-5-20250929"),                          │
│      prompt: "You ARE the developer portal…",                                  │
│    })                                                                          │
│      .use(new MCPAppsMiddleware({ mcpServers: [...] }))    // MCP App UI      │
│      .use(new A2UIMiddleware({ injectA2UITool: true, ... })) // render_a2ui   │
│                                                                                │
│    new CopilotRuntime({ agents: { default: agent } })                         │
│    createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit" })      │
│                                                                                │
│  FRONTEND  /components/App.tsx                                                 │
│                                                                                │
│    <CopilotKitProvider                                                         │
│      runtimeUrl="/api/copilotkit"                                              │
│      renderActivityMessages={[mcpAppsCanvasRenderer, a2uiCanvasRenderer]}     │
│    >                                                                            │
│      <Dashboard />              {/* IDP shell + sidebar + governance bar */}  │
│      <DeployStatus />           {/* useFrontendTool: deploy-streaming */}     │
│      <StreamActionTool />       {/* useFrontendTool: stream-action */}        │
│      <ChartTool />              {/* useFrontendTool: render-chart */}         │
│      <DataTools />              {/* cost, metrics, deploys, runbooks */}      │
│      <CopilotSidebar />         {/* chat input only */}                        │
│    </CopilotKitProvider>                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

The three rendering families map to specific workflows:

| Rendering family | Used for | Canonical package |
| --- | --- | --- |
| **MCP Apps** (Open-ended) | Catalog and resource detail pages, create-* forms — the durable IDP surfaces | `@ag-ui/mcp-apps-middleware` + `MCPAppsActivityRenderer` |
| **A2UI** (Declarative) | Generated work surfaces: deploy-readiness checks, health comparisons, ownership cards, Day 1 / Day 2 boards | `@ag-ui/a2ui-middleware` + `@copilotkit/a2ui-renderer` |
| **AG-UI streaming** (Controlled) | Live operational actions: deploy, rollback, scale, page, invoke | `useFrontendTool` from `@copilotkit/react-core/v2` |

All three flow through one chat panel against one MCP server. The catalog data
comes from the same `@modelcontextprotocol/ext-apps` server that powers
`/demo` and Claude Desktop.

## Prerequisites

- Node.js ≥ 20
- pnpm
- An Anthropic API key (Sonnet 4.5+ access)

## Setup

```bash
cd demo/copilotkit
cp .env.example .env.local
# put your ANTHROPIC_API_KEY in .env.local
pnpm install
```

## Run

Two terminals:

```bash
# Terminal 1 — MCP server  (the existing /demo)
cd demo
npm install            # if not already done
npm run start          # builds the MCP App bundle, serves http://localhost:3001/mcp

# Terminal 2 — CopilotKit frontend
cd demo/copilotkit
pnpm run dev           # http://localhost:3002
```

Open <http://localhost:3002>. PlatformOps loads with the chat sidebar open.

## On-stage script

> **The story is the IDP, not the protocols.** Walk a developer task end to
> end. The audience should leave remembering "they shipped a service without
> opening a portal" — and only *afterwards* realize MCP Apps, A2UI, and AG-UI
> made it possible.

Open <http://localhost:3002>. Land on **Service Catalog**. Then in chat:

1. **`Show me payment-api.`**
   → The MCP App detail page renders in the canvas. Note the **governance bar**
     under the title: acting as `engin.diri@`, owned by Payments Platform,
     policy checks all green, last audit event id visible, source catalog
     record `catalog/services.yaml#L142`. *"This is an IDP, not a chatbot —
     every action is attributable."*

2. **`Is it safe to deploy?`**
   → The agent pulls SLO, recent deploys, on-call coverage, active alerts,
     and dependency status, then composes an A2UI **deploy-readiness
     checklist** — a Go / No-Go verdict card plus a row per check. *"That page
     didn't exist in any portal. A static IDP couldn't have prebuilt it. The
     agent assembled it from platform data tools."*

3. **`Show me what I can do with this service.`**
   → The agent renders the Day 1 / Day 2 **self-service board** as an A2UI
     surface — two stacked Cards, each with 4–6 action buttons scoped to
     payment-api. *"Port.io spent a year building this UI. We just asked
     for it."*

4. Click **`Deploy to staging`** on the self-service board.
   → AG-UI streams the four phases (Validate → Push → Roll out → Health check)
     into the canvas. Each tick lands roughly every 750 ms. The handler
     completes; the canvas stays on the ✓ state long enough to read it.
     *"And the deploy itself is just another tool call — but live, with the
     UI we own."*

**Close:** *"That was a service catalog, a golden-path check, a self-service
action, and a streaming deploy with audit trail. The developer never opened
the portal — because the portal came to them. MCP Apps for the durable
surfaces. A2UI for what static pages couldn't prebuild. AG-UI for the live
actions. Your IDP, conversation-first."*

### Backup demos (if time allows or a prompt misfires)

- **Cost dashboard:** "Show me cost by team" → `render-chart` SVG bar chart.
- **Runbook:** "Pull the payment-api runbook" → A2UI Card with Symptoms /
  First 5 minutes / Escalation sections.
- **Rollback:** "Roll back the last data-pipeline deploy" → A2UI confirmation
  card with the rollback's audit event id.
- **Cross-resource:** "Compare payment-api and user-service health" → A2UI
  Row of two Cards composed natively.

## Files

```
app/
  layout.tsx
  page.tsx                       # uses <App /> (force-dynamic)
  globals.css
  api/copilotkit/[[...slug]]/
    route.ts                     # BuiltInAgent + MCPAppsMiddleware + A2UIMiddleware

components/
  App.tsx                        # CopilotKitProvider + renderActivityMessages
  Dashboard.tsx                  # branded PlatformOps dashboard (sidebar, KPIs, table)
  DataTools.tsx                  # frontend data tools for metrics, costs, runbooks, on-call
  DeployStatus.tsx               # AG-UI deploy action with streaming render
```

## Troubleshooting

**Chat says "no tools available"** — `/demo` MCP server isn't running, or
`MCP_SERVER_URL` is misconfigured. Default is `http://localhost:3001/mcp`.

**LLM errors (401, 404)** — `ANTHROPIC_API_KEY` in `.env.local` is missing or
invalid. Restart the dev server after editing `.env.local`.

**A2UI surface won't render** — check the browser console. The middleware
emits `a2ui-surface` ACTIVITY_SNAPSHOTs; the renderer ingests them via
`processMessages`. Errors usually mean a malformed v0.9 op (missing
`createSurface`, missing `id: "root"`, etc.). The agent's system prompt
includes A2UI v0.9 protocol instructions — if it goes off-script, tighten
that prompt.

## Why this is interesting

You are not running this inside Claude Desktop. You are running it in
**your own React app** that you fully control — branded, themed, owned by
the platform team. The MCP server doesn't know which host is rendering it.
The agent emits AG-UI events; activity renderers turn those into UI.

That's the unification slide of the talk, made concrete:

- MCP for tools/data
- AG-UI for transport
- MCP Apps / A2UI for UI payload
- CopilotKit for the React runtime that wires it all together

If you can fork this and rebrand `<Sidebar />` and `<Hero />`, you have a
working Backstage alternative.
