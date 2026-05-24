# Stop Building Portals, Start Building Conversations

A 30-minute conference talk on generative UI for platform engineering. This repo
holds the slide deck and the demo it runs against.

The bet behind the talk: Backstage and Port.io solved *what* a platform team
offers developers. The unsolved question is *where* to offer it. When the
catalog, the golden paths and the deploy buttons live inside the conversation a
developer is already having, the trip to a separate portal stops being
mandatory.

## What's in the repo

| Path | What it is |
|---|---|
| [`slides/`](./slides) | The Slidev deck (`slides.md`), code snippets and assets. |
| [`demo/`](./demo) | The MCP App server. Centerpiece of the talk. Runs a fake platform catalog over MCP and ships an HTML UI bundled as a resource. Hosted by Claude Desktop on stage. |
| [`demo/copilotkit/`](./demo/copilotkit) | A Next.js frontend that hosts the same MCP server inside a conversation-driven IDP, with an A2UI-rendered work surface as a sketch of the next step. Not shown live in the talk; kept for reference. |

`AGENTS.md` at the root, and one per subdirectory, hold the rules for AI agents
working in this codebase.

## The two rendering surfaces

The talk sorts generative UI by who controls the UI.

| Surface | Status | Used for | Package |
|---|---|---|---|
| **MCP Apps** (formerly MCP-UI) | Ships today in Claude, ChatGPT, VS Code, Goose | Catalog and resource detail pages, create-* forms. The pages a developer browses to from inside the conversation. | `@modelcontextprotocol/ext-apps` |
| **A2UI** | Spec drafted; no major host renders it natively yet | Agent-composed work surfaces: deploy readiness checks, runbook cards. The answers a static page could not have prebuilt. | `@a2ui/web_core` |

MCP Apps is what you can ship today. A2UI is the bet on where this goes next.

## Run the demo

The demo on stage is the MCP App server hosted inside Claude Desktop.

```bash
cd demo
npm install
npm run serve
# serves http://localhost:3001/mcp
```

Add it to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Restart Claude Desktop, then ask *Show me the service catalog*. The catalog
renders inline in the conversation. Click into a service. Click **Deploy**.
Same MCP server, different host than what the slides show, identical UI.

### Optional: the CopilotKit IDP

The same `demo/` MCP server can also be wired into a Next.js frontend. It's not
part of the live demo, but it shows how the same data layer reads inside a
purpose-built IDP shell, and it includes an A2UI work surface as a sketch of
the bet.

```bash
cd demo/copilotkit
cp .env.example .env.local       # add your Anthropic API key
pnpm install
pnpm dev
# open http://localhost:3002
```

## Run the deck

```bash
cd slides
pnpm install
pnpm dev
# open http://localhost:3030
```

`pnpm run export` produces a PDF. The first run installs Playwright system deps.

## Speakers

[Engin Diri](https://github.com/dirien), Sr. Solutions Architect at Pulumi.

[Hila Fish](https://github.com/hilafish), Solutions Architect at AWS.

## License

MIT.
