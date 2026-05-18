# PlatformOps Demo Runbook

This is the stage script for the conversation-native IDP demo.

Goal: the audience should remember the workflow first:

> A developer shipped a service safely without opening a portal tab.

Only after the workflow lands, explain the stack:

- MCP Apps for durable IDP surfaces
- A2UI for generated work surfaces
- AG-UI for live operations

## Preflight

Run this before the talk.

```bash
cd demo
npm run start
```

In a second terminal:

```bash
cd demo/copilotkit
pnpm lint
pnpm build
pnpm run dev
```

Open:

```text
http://localhost:3002
```

Check:

- The page loads with `PlatformOps` in the left sidebar.
- The chat sidebar is open.
- `.env.local` contains a valid `ANTHROPIC_API_KEY`.
- The MCP server is running at `http://localhost:3001/mcp`.

## Opening Line

Say this before touching the demo:

> Let me show you what happens when the internal developer portal stops being a destination and becomes a conversation.

Then type the first prompt.

## Main Demo Path

### 1. Open A Service

Prompt:

```text
Show me payment-api.
```

Expected result:

- Canvas opens the `payment-api` MCP App detail view.
- The left sidebar switches from global navigation to resource actions.
- The resource header shows governance data:
  - acting user
  - owning team
  - policy status
  - audit event
  - source catalog record

Talk track:

> This is the part that used to be the portal: service catalog, ownership, status, source of truth. But the developer did not navigate to it. They asked for the service, and the portal came to them.

Stack note, only after the UI is visible:

> This surface is MCP Apps. Durable, tool-owned UI, shipped by the platform backend.

### 2. Ask For Deploy Readiness

Prompt:

```text
Is it safe to deploy?
```

Expected result:

- The agent calls platform data tools:
  - `service-metrics`
  - `list-deployments`
  - `get-oncall`
  - `show-service`
- Canvas changes to an A2UI deploy-readiness surface.
- The surface shows a Go / No-Go verdict and checks for:
  - SLO headroom
  - recent deploys
  - on-call coverage
  - active alerts
  - dependency status

Talk track:

> This page did not exist in the portal. The agent assembled it for this moment from platform data. That is the difference between a static portal page and a conversation-native IDP.

Stack note:

> This is A2UI. The agent emits a UI spec as data, and our host renders it with native React components.

### 3. Open Self-Service Actions

Prompt:

```text
Show me what I can do with this service.
```

Expected result:

- Canvas changes to the `self-service-actions` A2UI surface.
- It shows two stacked cards:
  - Day 1 - Provision
  - Day 2 - Operate
- Each card has action buttons scoped to `payment-api`.

Talk track:

> This is the Port.io part of the story: self-service actions. But instead of sending the developer to a form library, the agent creates the right board for the resource in front of them.

Important:

Do not type the next action. Click the button in the generated board.

### 4. Click Deploy To Staging

Click:

```text
Deploy to staging
```

Expected result:

- The A2UI button sends a `self_service_action` event back through the agent loop.
- The agent calls `deploy-streaming`.
- Canvas changes to an AG-UI streaming panel.
- The phases tick through:
  - Validate
  - Push
  - Roll out
  - Health check
- The final success state remains visible long enough to read.

Talk track:

> The generated UI is not decorative. The button is part of the agent loop. The deploy is a tool call, but the host owns the live operation UI.

Stack note:

> This is AG-UI. The frontend owns the component, the agent triggers the tool, and the UI streams state as the operation runs.

### 5. Close The Main Demo

Say:

> That was a catalog lookup, a deploy-readiness review, a self-service action, a live deploy, and an audit trail. No portal tab. The portal became the backend. The conversation became the interface.

Then pause. Let the audience process it.

## Optional Policy Surprise

Use this if the main path worked cleanly and you have time.

Prompt:

```text
Deploy notification-service to production.
```

Expected result:

- The agent should notice that `notification-service` has degraded SLO / active alerts.
- It should refuse or require approval before production deploy.
- If it renders a policy explanation, let it stand.

Talk track:

> This is why it is an IDP, not a chatbot. The conversation still respects platform policy.

If the model tries to deploy anyway, say:

> In a real platform this policy decision would be enforced server-side. The demo shows the UX shape, but production would put the guardrail behind the tool boundary.

## Backup Demos

Use these if a prompt misfires or you need a shorter path.

### Cost Dashboard

Prompt:

```text
Show me cost by team.
```

Expected result:

- Agent calls `cost-breakdown`.
- Agent calls `render-chart`.
- Canvas shows a bar chart.

Talk track:

> Same conversation, different surface. Cost does not need a full portal page; it needs the right visualization at the right moment.

### Runbook

Prompt:

```text
Pull the payment-api runbook.
```

Expected result:

- Agent calls `get-runbook`.
- Canvas shows an A2UI card with:
  - Symptoms
  - First 5 minutes
  - Escalation

Talk track:

> This is what you want at 3am: not a search box, not a wiki tree, just the operational surface for the incident in front of you.

### Audit

Prompt:

```text
Who deployed payment-api last?
```

Expected result:

- Agent calls `list-deployments`.
- Canvas shows an A2UI accountability card:
  - user
  - service
  - environment
  - commit
  - policy result
  - audit event id

Talk track:

> Platform teams care about governance. Conversation-native does not mean ungoverned.

## Recovery Lines

If the agent gives a text answer instead of rendering:

```text
Render that in the canvas using the right surface.
```

If the agent asks for the service id even though `payment-api` is focused:

```text
Use the currently focused resource.
```

If the canvas gets overwritten too quickly:

```text
Reset conversation
```

Then restart at:

```text
Show me payment-api.
```

If MCP Apps do not render:

- Check the `demo` MCP server terminal.
- Restart `npm run start` in `demo`.
- Refresh `http://localhost:3002`.

## Presenter Notes

Keep the protocol names secondary.

Good order:

1. Show the workflow.
2. Name the IDP capability.
3. Then name the rendering family.

Avoid saying:

> Now I will show you A2UI.

Say instead:

> Now I will ask the IDP whether this service is safe to deploy.

## Final Line

Use this at the end:

> Your portal is not dead. It is your catalog, your policy engine, your audit trail, and your tool backend. But the interface is no longer the portal. The interface is the conversation.
