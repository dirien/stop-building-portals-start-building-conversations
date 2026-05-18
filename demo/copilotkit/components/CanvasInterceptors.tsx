"use client";

import { useEffect } from "react";
import { z } from "zod";
import {
  MCPAppsActivityType,
  MCPAppsActivityContentSchema,
} from "@copilotkit/react-core/v2";
import { useDashboardStore } from "./store";

/**
 * Activity-message interceptors that capture the full renderer props and
 * push them into the canvas store. The chat shows a small breadcrumb; the
 * real surface (MCP App iframe, A2UI surface) is rendered in <Canvas /> by
 * mounting the official renderer with the stored props.
 */

type Json = Record<string, any>;

interface RendererProps {
  activityType: string;
  content: Json;
  message: any;
  agent: any;
}

// ─── MCP Apps ──────────────────────────────────────────────────────────────

function MCPAppsCanvasInterceptor({
  activityType,
  content,
  message,
  agent,
}: RendererProps) {
  const setCanvas = useDashboardStore((s) => s.setCanvas);
  const toolName = (content?.toolName as string | undefined) ?? "MCP App";
  const toolInput = (content?.toolInput ?? {}) as Record<string, unknown>;

  useEffect(() => {
    setCanvas({
      kind: "mcp-app",
      activityType,
      content,
      message,
      agent,
      toolName,
      toolInput,
    });
  }, [activityType, content, message, agent, toolName, setCanvas]);

  return <Breadcrumb tone="frost" label={`Opened ${toolName} in canvas`} />;
}

export const mcpAppsCanvasRenderer = {
  activityType: MCPAppsActivityType,
  content: MCPAppsActivityContentSchema,
  render: MCPAppsCanvasInterceptor,
};

// ─── A2UI ──────────────────────────────────────────────────────────────────

const A2UI_ACTIVITY_TYPE = "a2ui-surface" as const;

/** Zod pass-through schema — CopilotKit calls `content.safeParse(...)`. */
const passthrough = z.any();

function A2UICanvasInterceptor({
  activityType,
  content,
  message,
  agent,
}: RendererProps) {
  const setCanvas = useDashboardStore((s) => s.setCanvas);
  const surfaceId = readSurfaceId(content);

  useEffect(() => {
    setCanvas({
      kind: "a2ui",
      activityType,
      content,
      message,
      agent,
      surfaceId,
    });
  }, [activityType, content, message, agent, surfaceId, setCanvas]);

  return <Breadcrumb tone="ok" label={`A2UI surface "${surfaceId}" in canvas`} />;
}

function readSurfaceId(content: Json): string {
  if (typeof content?.surfaceId === "string") return content.surfaceId;
  const ids = content?.surfaceIds;
  if (Array.isArray(ids) && typeof ids[0] === "string") return ids[0];
  // Canonical: A2UIMiddleware emits operations under `a2ui_operations`.
  // Each operation has at most one of createSurface / updateComponents /
  // updateDataModel / deleteSurface, all of which carry a surfaceId. Prefer
  // the createSurface id; fall back to any operation's surfaceId.
  const opLists: Json[][] = [];
  if (Array.isArray(content?.a2ui_operations))
    opLists.push(content.a2ui_operations as Json[]);
  if (Array.isArray(content?.messages))
    opLists.push(content.messages as Json[]);
  for (const ops of opLists) {
    for (const op of ops) {
      const cs = (op as { createSurface?: { surfaceId?: string } })
        .createSurface;
      if (cs?.surfaceId) return cs.surfaceId;
    }
    for (const op of ops) {
      for (const key of [
        "updateComponents",
        "updateDataModel",
        "deleteSurface",
      ] as const) {
        const slot = (op as Record<string, { surfaceId?: string } | undefined>)[
          key
        ];
        if (slot?.surfaceId) return slot.surfaceId;
      }
    }
  }
  return "default";
}

export const a2uiCanvasRenderer = {
  activityType: A2UI_ACTIVITY_TYPE,
  content: passthrough,
  render: A2UICanvasInterceptor,
} as const;

// ─── Breadcrumb ────────────────────────────────────────────────────────────

function Breadcrumb({
  tone,
  label,
}: {
  tone: "frost" | "ok" | "warn";
  label: string;
}) {
  const toneClass =
    tone === "ok"
      ? "border-nord-ok/40 text-nord-ok"
      : tone === "warn"
        ? "border-nord-warn/40 text-nord-warn"
        : "border-nord-frost2/40 text-nord-frost2";
  return (
    <div
      className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border ${toneClass} bg-nord-1/60 my-1`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
      <span className="opacity-60">↗</span>
    </div>
  );
}
