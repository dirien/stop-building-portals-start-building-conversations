# Stop Building Portals, Start Building Conversations

> Generative UI for Platform Engineering — a 30-minute conference talk

## About

Platform engineering solved **what to offer** developers but not **where to offer it**. This talk explores how Generative UI technologies let platform teams deliver interactive interfaces directly inside AI conversations — where developers already work.

## Technologies Covered

| Technology | Role |
|---|---|
| [MCP Apps](https://modelcontextprotocol.io/docs/extensions/apps) | Full HTML apps inside AI conversations (centerpiece) |
| [OpenUI](https://github.com/thesysdev/openui) | Token-efficient component rendering |
| [json-render](https://json-render.dev) | Cross-platform streaming UI |
| [AG-UI / CopilotKit](https://docs.ag-ui.com) | Agent-frontend transport protocol |

## View the Slides

```bash
pnpm install
pnpm run dev
# Open http://localhost:3030
```

## Run the Demo

The demo is an MCP App server that renders a platform service catalog inside an AI conversation.

```bash
cd demo
npm install
npm run build
npm run serve
# Server runs on http://localhost:3001/mcp
```

Connect to it from Claude Desktop, VS Code with Copilot, or the [basic-host](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-host) test client.

## License

MIT
