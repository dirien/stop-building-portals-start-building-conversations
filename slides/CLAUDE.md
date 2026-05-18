# Stop Building Portals, Start Building Conversations

Conference talk about Generative UI for Platform Engineering.

## Project Structure

- `slides.md` — Slidev presentation (~26 slides, 30-min talk)
- `demo/` — MCP App demo server (TypeScript)
- `snippets/` — Code snippets imported into slides
- `public/` — Static assets (images, QR code)

## Commands

### Slides
```bash
pnpm run dev      # Dev server at localhost:3030
pnpm run build    # Build for production
pnpm run export   # Export to PDF
```

### Demo MCP App
```bash
cd demo
npm install
npm run build     # Build the bundled HTML app
npm run dev       # Dev mode (watch + serve)
npm run serve     # Serve on http://localhost:3001/mcp
```

## Key Technologies

- **Slidev** — Markdown-based slide framework
- **MCP Apps** (`@modelcontextprotocol/ext-apps`) — Interactive UI in MCP
- **OpenUI** — Token-efficient component rendering
- **json-render** — Cross-platform streaming UI
- **AG-UI / CopilotKit** — Agent-frontend transport protocol
