# Plan: Conference Talk Content — "Stop Building Portals, Start Building Conversations"

## Context

You have a conference talk planned with the title **"Stop Building Portals, Start Building Conversations"**. The original abstract focuses on MCP Apps and how platform engineering needs to move from portal-based UIs to conversation-embedded UIs. You want to **broaden the narrative** to include **Generative UI** as a wider concept, specifically covering two additional technologies alongside MCP Apps:

- **OpenUI** by Thesys (`github.com/thesysdev/openui`) — a token-efficient, streaming-first language for AI-generated UI
- **json-render** by Vercel Labs (`json-render.dev`) — a cross-platform generative UI framework with component guardrails
- **CopilotKit / AG-UI** (`copilotkit.ai/generative-ui`) — the AG-UI protocol as the runtime transport layer, plus CopilotKit's three-pattern generative UI framework

The goal: MCP Apps remains the centerpiece, but the talk now tells the bigger story of how AI is changing the UI layer of platform engineering. The narrative arc covers the full emerging stack: MCP (tools) + AG-UI (transport) + A2UI/OpenUI/json-render (UI specs).

---

## Deliverables

### 1. Slide Deck (Slidev)

A Slidev-based presentation (~25 slides for a 30-minute slot). Speaker notes embedded in each slide.

### 2. Demo Code

A minimal MCP App demo showing a platform service catalog rendered inside an AI conversation, potentially integrating json-render for the UI layer.

---

## Talk Structure (10 sections, 30 min)

> **30-min compression**: Sections 5 and 6 (OpenUI, json-render) get 3 min each instead of 5. Use pre-recorded clips or screenshots instead of live demos for those. Section 8 trimmed to 2 min. Total: ~30 min.

### Act 1: The Problem (6 min)

**Section 1 — Opening Hook (2 min)**
- Split-screen visual: portal dashboard vs. developer's actual workspace (terminal + AI chat)
- Thesis: "What if the portal came to them — as part of the conversation they were already having?"

**Section 2 — The Context-Switch Tax (4 min)**
- Platform engineering solved "what to offer" but not "where to offer it"
- AI-native workflows (Claude Code, Copilot, Cursor) created a second workspace developers prefer
- The conversation is the new operating surface

### Act 2: The Paradigm Shift (25 min)

**Section 3 — Introducing Generative UI (5 min)**
- Define Generative UI: UI described declaratively, rendered at runtime, where AI participates in selecting/composing components
- Three patterns spectrum (credit CopilotKit's framework for this taxonomy):
  - **Static/Controlled**: AI picks from pre-built components (e.g. ChatGPT chart renderer)
  - **Declarative**: AI generates structured descriptions mapped to a component catalog (OpenUI, json-render, Google A2UI)
  - **Open-ended**: AI generates raw HTML/CSS/JS (Claude Artifacts, MCP Apps at full flexibility)
- Position all technologies on this spectrum
- Introduce the emerging multi-layer standard stack:
  - **MCP** = tool execution layer
  - **AG-UI** (CopilotKit) = runtime transport / state sync protocol
  - **A2UI / OpenUI / json-render** = UI specification languages
  - These layers are complementary, not competing

**Section 4 — MCP Apps Deep Dive [CENTERPIECE] (10 min)**
- SEP-1865, jointly released Jan 26, 2026 by Anthropic + OpenAI
- "Apps in AI" paradigm (inverse of "AI in Apps")
- Architecture: `ui://` URI scheme, sandboxed HTML iframes, bidirectional JSON-RPC over postMessage
- Pre-declared UI templates as MCP resources
- Platform engineering angle: your MCP server already has tools — now give it a face
- **Live demo**: MCP App rendering a platform service catalog inside Claude Code / VS Code
  - Browse services, select one, fill parameters, trigger deployment — all in-conversation
  - Show the three key pieces: MCP server resource declaration, iframe HTML, JSON-RPC message flow

**Section 5 — OpenUI by Thesys (5 min)**
- The token efficiency problem: JSON is verbose, OpenUI Lang is 67% fewer tokens
- How it works: component libraries with Zod schemas, automatic system prompt generation, streaming-first rendering
- Platform engineering angle: "golden paths for UI" — the platform team defines the component catalog, AI generates within those guardrails
- Quick demo: OpenUI playground or side-by-side token comparison (JSON vs OpenUI Lang)

**Section 6 — json-render by Vercel Labs (5 min)**
- The cross-platform problem: what if your platform needs UIs in React, mobile, email, PDF, and AI conversations?
- Three-layer architecture: Schema -> Catalog -> Registry
- JSONL streaming with RFC 6902 JSON Patch for incremental updates
- Component guardrails: AI can only use catalog-defined components
- `@json-render/mcp` package: first-class MCP Apps integration
- Code export: AI-generated UIs exportable as standalone components
- Quick demo: json-render generating a deployment status component with streaming patches

### Act 3: The Future (9 min)

**Section 7 — The Emerging Stack & AG-UI (4 min)**
- Introduce the full emerging standard stack for agentic UIs:
  - **MCP** = tool execution (what the agent can do)
  - **AG-UI** (CopilotKit) = runtime transport protocol (how events flow between agent backend and frontend)
    - 16 event types: lifecycle, text streaming, tool calls, state management, activity, reasoning
    - Bidirectional state sync via JSON Patch (RFC 6902)
    - Framework-agnostic: works with LangGraph, CrewAI, AWS Strands, etc.
  - **A2UI / OpenUI / json-render** = UI specification (what to render)
  - **MCP Apps** = delivery channel (where to render — inside AI conversations)
- These layers are complementary, not competing — a real platform team uses multiple
- Decision matrix for platform teams:

| Need | Use |
|------|-----|
| UI inside AI conversations | MCP Apps |
| Token-efficient AI output | OpenUI |
| Cross-platform rendering | json-render |
| Agent-frontend state sync | AG-UI |
| Component safety/guardrails | OpenUI (Zod) or json-render (Catalog) |
| Human-in-the-loop approvals | AG-UI + CopilotKit |
| MCP integration | MCP Apps + @json-render/mcp |

- Analogy: like composing K8s + Helm + ArgoCD + Backstage — no single tool does everything

**Section 8 — AI as a First-Class Platform User (2 min)**
- The deeper shift: platform teams now build for AI agents, not just human developers
- MCP = protocol layer, Generative UI = presentation layer, AG-UI = transport layer, Agent Frameworks = orchestration
- Connect to your existing work: CfgMgmtCamp workshop, Kagent, agent harness
- Challenge: "Your next platform user will not have a browser. It will have a context window."

**Section 9 — Practical Takeaways (2 min)**
- Five things to do this quarter:
  1. Inventory your portal — which actions could be MCP tools?
  2. Build one MCP server with a `ui://` resource
  3. Define your component catalog (Zod schemas or json-render Catalog)
  4. Test with real developers in Claude Code or VS Code
  5. Plan for the hybrid stack — design for composability

**Section 10 — Closing (2 min)**
- Return to opening split-screen, add a third panel: AI conversation with embedded UI
- "Stop building portals nobody visits. Start building conversations developers are already having."
- Resources slide with QR code: MCP Apps spec, OpenUI GitHub, json-render.dev

---

## Implementation Steps

### Step 1: Create repo and Slidev project
- Create a new repo `stop-building-portals-start-building-conversations` in `/Users/dirien/Tools/repos/`
- Scaffold Slidev project (`npm init slidev`)
- Set up `slides.md` with the 10-section structure

### Step 2: Write slide content (~25 slides)
- Create slides following the outline above
- Include architecture diagrams (Mermaid)
- Add code snippets for MCP Apps, OpenUI Lang, and json-render examples
- Speaker notes with talking points embedded per slide

### Step 3: Build demo code
- Create `demo/` directory in the repo
- Minimal MCP App demo: TypeScript MCP server with a `ui://` resource
- Platform service catalog iframe with bidirectional JSON-RPC
- Integrate `@json-render/mcp` for the UI layer to show the hybrid approach

### Step 4: Add supporting assets
- Mermaid diagrams inline in slides (spectrum, hybrid stack, architecture)
- Code snippets for all three technologies

---

## Key References

| Technology | URL | Role in Talk |
|---|---|---|
| MCP Apps spec (SEP-1865) | `github.com/modelcontextprotocol/ext-apps` | Centerpiece — deep dive |
| MCP Apps docs | `modelcontextprotocol.io/docs/extensions/apps` | Architecture details |
| OpenUI | `github.com/thesysdev/openui` | Complementary — token efficiency |
| OpenUI playground | `openui.com/playground` | Demo |
| json-render | `json-render.dev` | Complementary — cross-platform |
| json-render MCP | `@json-render/mcp` npm package | Integration point |
| CopilotKit | `copilotkit.ai/generative-ui` | Three-pattern framework & GenUI taxonomy |
| AG-UI Protocol | `docs.ag-ui.com` | Runtime transport standard |
| AG-UI vs A2UI | `copilotkit.ai/ag-ui-and-a2ui` | Ecosystem comparison |

## Existing Repos to Reference

- `cfgmgmtcamp-2026-agentic-ai-workshop/` — Slidev/Jekyll structure template, Kagent multi-agent content
- `what-is-ai-platform-engineering-and-why-should-you-care/` — AI platform engineering narrative
- `mcp-server/` — Existing Pulumi MCP server (potential demo base)

---

## Verification

- Run `npm run dev` on the Slidev project and walk through all slides in browser
- Test any demo code in Claude Code or VS Code with MCP
- Verify all external links are valid
- Time the talk by reading through speaker notes (~30 min target)
