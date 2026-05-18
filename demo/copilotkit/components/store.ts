"use client";

import { create } from "zustand";

/**
 * The Canvas is the main area of the dashboard.
 *
 * Every agent action — MCP App tool call, A2UI surface, AG-UI streaming
 * action — pushes its result here. The Canvas component subscribes and
 * renders the appropriate panel. The chat sidebar becomes secondary; the
 * dashboard *is* the agent's surface.
 */

export type CanvasState =
  | { kind: "idle" }
  | {
      kind: "mcp-app";
      // Pass the same activity-renderer props verbatim so we can render the
      // official MCPAppsActivityRenderer in the canvas.
      activityType: string;
      content: any;
      message: any;
      agent: any;
      // Convenience fields for the chrome label.
      toolName: string;
      toolInput: Record<string, unknown>;
    }
  | {
      kind: "a2ui";
      activityType: string;
      content: any;
      message: any;
      agent: any;
      surfaceId: string;
    }
  | {
      kind: "deploy-stream";
      serviceId: string;
      environment: "staging" | "production";
      status: "executing" | "complete";
      startedAt: number;
    }
  | {
      kind: "stream-action";
      title: string;
      subtitle?: string;
      phases: string[];
      status: "executing" | "complete";
      startedAt: number;
      result?: string;
    }
  | {
      kind: "chart";
      title: string;
      subtitle?: string;
      type: "bar" | "line" | "stacked-bar";
      unit?: string;
      series: Array<{
        label: string;
        value?: number;
        values?: number[];
        color?: string;
      }>;
      // For line/multi-series charts
      xLabels?: string[];
    };

interface RecentItem {
  id: string;
  label: string;
  kind: CanvasState["kind"];
  at: number;
}

/**
 * The currently focused resource — drives the sidebar context like a
 * Backstage service detail view. Set automatically when the agent calls
 * any tool that operates on a specific resource (show-service,
 * cluster-status, lambda-invocations, agent-traces).
 */
export type SelectedResource =
  | { kind: "service"; id: string; name?: string }
  | { kind: "cluster"; id: string; name?: string }
  | { kind: "lambda"; name: string }
  | { kind: "agent"; id: string; name?: string }
  | null;

interface DashboardState {
  canvas: CanvasState;
  /** Bread-crumb history shown in the canvas chrome. */
  recent: RecentItem[];
  /** Currently focused resource — drives the context sidebar. */
  selectedResource: SelectedResource;
  /**
   * Wall-clock ms when the current canvas was set, used by the
   * "stage-protect" guard below. Internal — not consumed by UI.
   */
  _canvasSetAt: number;

  setCanvas: (next: CanvasState) => void;
  clearCanvas: () => void;
  setSelectedResource: (r: SelectedResource) => void;
  clearSelectedResource: () => void;
}

const MAX_RECENT = 8;

/**
 * How long (ms) a freshly-completed AG-UI streaming canvas is held against
 * being overwritten by a different rendering pattern (typically an A2UI
 * follow-up). Without this, the agent's "let me also render an A2UI
 * confirmation card" reflex blows away the streaming animation before the
 * audience can see the final ✓ state.
 *
 * Same-kind overwrites (e.g. the same deploy-stream re-pushing as it
 * transitions executing → complete) are always allowed.
 */
const STREAM_HOLD_MS = 2500;

function isStreamingKind(k: CanvasState["kind"]): boolean {
  return k === "deploy-stream" || k === "stream-action";
}

export const useDashboardStore = create<DashboardState>((set) => ({
  canvas: { kind: "idle" },
  recent: [],
  selectedResource: null,
  _canvasSetAt: 0,

  setCanvas: (next) =>
    set((state) => {
      const now = Date.now();
      // Stage-protect: if a streaming AG-UI canvas was set within the last
      // STREAM_HOLD_MS, refuse to overwrite it with a DIFFERENT kind. The
      // streaming card is itself the response — agents that fire a
      // render_a2ui follow-up should not get to clobber it.
      const incumbent = state.canvas;
      if (
        isStreamingKind(incumbent.kind) &&
        next.kind !== incumbent.kind &&
        next.kind !== "idle" &&
        now - state._canvasSetAt < STREAM_HOLD_MS
      ) {
        return state;
      }

      const label = labelFor(next);
      const id = `${next.kind}-${now}`;
      const recent = label
        ? [{ id, label, kind: next.kind, at: now }, ...state.recent].slice(
            0,
            MAX_RECENT,
          )
        : state.recent;
      // Auto-select the resource based on the tool that produced this canvas.
      const resource = inferResource(next);
      return {
        canvas: next,
        recent,
        _canvasSetAt: now,
        ...(resource ? { selectedResource: resource } : {}),
      };
    }),

  clearCanvas: () => set({ canvas: { kind: "idle" }, _canvasSetAt: Date.now() }),
  setSelectedResource: (r) => set({ selectedResource: r }),
  clearSelectedResource: () => set({ selectedResource: null }),
}));

/**
 * The MCP Apps activity content doesn't carry a `toolName` — only result,
 * resourceUri, serverHash, serverId, and toolInput. We infer the focused
 * resource from the result's `structuredContent.view` (set by the MCP
 * server's tool handlers) which is the most reliable signal of intent.
 */
function inferResource(c: CanvasState): SelectedResource {
  if (c.kind !== "mcp-app" && c.kind !== "a2ui") return null;
  const result =
    (c as any).content?.result?.structuredContent ??
    (c as any).content?.structuredContent;
  if (!result || typeof result !== "object") return null;

  switch (result.view as string | undefined) {
    case "detail":
      if (result.service?.id) {
        return {
          kind: "service",
          id: result.service.id,
          name: result.service.name,
        };
      }
      return null;
    case "cluster-provision":
    case "cluster-status":
      if (result.cluster?.id) {
        return {
          kind: "cluster",
          id: result.cluster.id,
          name: result.cluster.name,
        };
      }
      return null;
    case "lambda-provision":
      if (result.lambda?.name) {
        return { kind: "lambda", name: result.lambda.name };
      }
      return null;
    case "agent-provision":
      if (result.agent?.id) {
        return {
          kind: "agent",
          id: result.agent.id,
          name: result.agent.name,
        };
      }
      return null;
    case "deploy-result":
      if (result.deployment?.serviceId) {
        return {
          kind: "service",
          id: result.deployment.serviceId,
          name: result.deployment.serviceName,
        };
      }
      return null;
    default:
      return null;
  }
}

function labelFor(c: CanvasState): string | null {
  switch (c.kind) {
    case "mcp-app":
      return `${c.toolName}${Object.keys(c.toolInput).length ? " · " + Object.values(c.toolInput).join(", ") : ""}`;
    case "a2ui":
      return `A2UI surface "${c.surfaceId}"`;
    case "deploy-stream":
      return `Deploy ${c.serviceId} → ${c.environment}`;
    default:
      return null;
  }
}
