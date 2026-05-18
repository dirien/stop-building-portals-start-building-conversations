# Stop Building Portals, Start Building Conversations

A 30-minute conference talk on Generative UI for platform engineering. This repo
holds the slide deck, an MCP App server, a CopilotKit-based developer portal,
and a few scripts that check the talk's claims against real package APIs.

I keep coming back to one question. Backstage and Port.io solved *what* a
platform team offers developers. Did they solve *where* to offer it? When the
catalog, the golden paths and the deploy buttons all live in a conversation the
developer is already having, the trip to a separate portal stops being
mandatory. That's the bet.

## What's in the repo

| Path | What it is |
|---|---|
| [`slides/`](./slides) | The Slidev deck (`slides.md`) and the code snippets it imports |
| [`demo/`](./demo) | The MCP App server. Runs a fake platform catalog at `http://localhost:3001/mcp`. Same server Claude Desktop can connect to. |
| [`demo/copilotkit/`](./demo/copilotkit) | A Next.js 16 frontend that puts the same MCP server inside a conversation-driven IDP: catalog, self-service actions, streaming deploys, governance row |
| [`verify/`](./verify) | One-off scripts. They import each package the talk references and check the API still looks like the slide says it does. |

`AGENTS.md` at the root, and one per subdirectory, hold the rules for AI agents
working in this codebase. Read those if Claude Code or Codex is editing things
for you.

## The three rendering families

The talk sorts Generative UI by who controls the UI. The demo uses all three:

| Family | Used for | Package |
|---|---|---|
| **MCP Apps** | Catalog and resource detail pages, create-* forms. The pages a developer browses to. | `@modelcontextprotocol/ext-apps` |
| **A2UI** | Agent-composed work surfaces: deploy readiness checks, Day 1 / Day 2 boards, runbook cards. The answers a static page could not have prebuilt. | `@a2ui/web_core` + `@ag-ui/a2ui-middleware` |
| **AG-UI streaming** | Live operational actions: deploy, rollback, scale, page on-call. | `useFrontendTool` from `@copilotkit/react-core/v2` |

A real IDP needs all three. MCP Apps own the pages, A2UI composes the answers,
AG-UI runs the work.

## Run the demo

Two terminals.

```bash
# Terminal 1, MCP server
cd demo
npm install
npm run serve
# serves http://localhost:3001/mcp
```

```bash
# Terminal 2, CopilotKit IDP frontend
cd demo/copilotkit
cp .env.example .env.local       # add your Anthropic API key
pnpm install
pnpm dev
# open http://localhost:3002
```

The frontend opens on **Service Catalog**. Try these in order:

1. `Show me payment-api.` The MCP App detail page renders in the canvas. Notice the governance row under the title (acting user, owning team, audit event id, policy posture). That row is what makes this an IDP and not a chatbot.
2. `Is it safe to deploy?` The agent pulls SLO, recent deploys, on-call coverage and dependencies, then composes a readiness checklist as an A2UI surface. No static page in any portal prebuilt that answer.
3. `Show me what I can do with this service.` Day 1 / Day 2 self-service board, rendered as A2UI. Each button fires its prompt back through the agent.
4. Click **Deploy to staging** on the self-service board. AG-UI streams Validate → Push → Roll out → Health check. The handler is intentionally slow so the audience can read each phase.

## Run the deck

```bash
cd slides
pnpm install
pnpm dev
# open http://localhost:3030
```

`pnpm run export` produces a PDF. The first run installs Playwright system deps.

## Add the MCP server to Claude Desktop

The same `demo/` MCP server can run inside Claude Desktop. Add this to
`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "platform-catalog": {
      "command": "npx",
      "args": ["mcp-remote@0.1.38", "http://localhost:3001/mcp"]
    }
  }
}
```

Restart Claude Desktop, then ask *Show me the service catalog*. The same UI
bundle that renders inside the CopilotKit frontend renders inside Claude.
Different host, identical MCP server. That's the slide.

## Speakers

[Engin Diri](https://github.com/dirien), Sr. Solutions Architect at Pulumi.

[Hila Fish](https://github.com/hilafish), Solutions Architect at AWS.

## License

MIT.
