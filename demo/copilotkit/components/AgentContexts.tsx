"use client";

import { useAgentContext } from "@copilotkit/react-core/v2";
import { useDashboardStore } from "./store";

/**
 * Dynamic agent contexts.
 *
 * Static stuff (the A2UI component catalog) is published server-side via
 * the @ag-ui/a2ui-middleware's `schema` config — single source of truth on
 * the server. Here we only publish state that genuinely changes at
 * runtime: the focused resource and the current canvas content.
 *
 * Both get serialized into the agent request automatically, so the agent
 * always knows what the user is looking at without us asking for ids.
 */

export function FocusedResourceContext() {
  const selectedResource = useDashboardStore((s) => s.selectedResource);
  useAgentContext({
    description:
      "Currently focused resource in the PlatformOps dashboard. Auto-set when the user opens a service/cluster/lambda/agent or when you call a resource-scoped tool. Treat this as the implicit subject of the user's next request — do not ask the user to repeat the resource id.",
    value: selectedResource ?? "none",
  });
  return null;
}

export function CanvasContext() {
  const canvas = useDashboardStore((s) => s.canvas);
  const summary = (() => {
    switch (canvas.kind) {
      case "idle":
        return "idle";
      case "mcp-app":
        return `Canvas shows an MCP App iframe (${canvas.toolName}).`;
      case "a2ui":
        return `Canvas shows an A2UI surface "${canvas.surfaceId}".`;
      case "deploy-stream":
        return `Canvas shows the deploy-streaming action for ${canvas.serviceId} → ${canvas.environment} (${canvas.status}).`;
      case "stream-action":
        return `Canvas shows the stream-action "${canvas.title}" (${canvas.status}).`;
      case "chart":
        return `Canvas shows a ${canvas.type} chart titled "${canvas.title}".`;
    }
  })();

  useAgentContext({
    description:
      "Current state of the dashboard canvas. The canvas is shared between all rendering tools — only ONE thing renders there at a time. If something is already rendered, calling another rendering tool will replace it. Use this to avoid overwriting your own previous render.",
    value: summary,
  });
  return null;
}
