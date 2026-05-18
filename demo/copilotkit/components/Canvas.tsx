"use client";

import { useEffect, useState } from "react";
import {
  MCPAppsActivityRenderer,
  createA2UIMessageRenderer,
} from "@copilotkit/react-core/v2";
import { defaultTheme as a2uiDefaultTheme } from "@copilotkit/a2ui-renderer";
import { platformA2UICatalog } from "./platformA2UICatalog";
import { useDashboardStore, type CanvasState } from "./store";

/**
 * The Canvas is the dashboard's main area.
 *
 * Each canvas kind mounts the OFFICIAL CopilotKit renderer with the
 * activity-message props captured by the interceptors. That gets us the
 * canonical AppBridge protocol for MCP App iframes and the canonical
 * A2UI v0.9 surface rendering — no homegrown shims.
 */
export function Canvas() {
  const canvas = useDashboardStore((s) => s.canvas);
  const clearCanvas = useDashboardStore((s) => s.clearCanvas);

  return (
    <div className="rounded-2xl border border-nord-2 bg-nord-1 min-h-[60vh] overflow-hidden flex flex-col">
      <CanvasChrome canvas={canvas} onClose={clearCanvas} />
      <div className="flex-1 min-h-0 overflow-auto">
        {canvas.kind === "idle" && <IdlePanel />}
        {canvas.kind === "mcp-app" && <MCPAppPanel state={canvas} />}
        {canvas.kind === "a2ui" && <A2UIPanel state={canvas} />}
        {canvas.kind === "deploy-stream" && (
          <DeployStreamPanel state={canvas} />
        )}
        {canvas.kind === "stream-action" && (
          <StreamActionPanel state={canvas} />
        )}
        {canvas.kind === "chart" && <ChartPanel state={canvas} />}
      </div>
    </div>
  );
}

// ─── Chrome (top bar) ─────────────────────────────────────────────────────

function CanvasChrome({
  canvas,
  onClose,
}: {
  canvas: CanvasState;
  onClose: () => void;
}) {
  const recent = useDashboardStore((s) => s.recent);
  const subtitle = subtitleFor(canvas);
  const badge = badgeFor(canvas);

  return (
    <div className="border-b border-nord-2 px-5 py-3 flex items-center justify-between bg-nord-0/40">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-50">
          Canvas
        </div>
        <div className="text-sm opacity-80 truncate">{subtitle ?? "Idle"}</div>
        {badge && (
          <span
            className={`text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded opacity-70 ${badge.tone}`}
            title="Rendering pattern + protocol used for this surface"
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {recent.length > 1 && (
          <div className="text-[11px] opacity-40 hidden md:block">
            {recent.length} recent
          </div>
        )}
        {canvas.kind !== "idle" && (
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded text-nord-4 hover:bg-nord-2/40 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function subtitleFor(c: CanvasState): string | null {
  switch (c.kind) {
    case "mcp-app":
      return `${c.toolName} → MCP App`;
    case "a2ui":
      return `A2UI surface · ${c.surfaceId}`;
    case "deploy-stream":
      return `Deploying ${c.serviceId} to ${c.environment}`;
    case "stream-action":
      return c.title;
    case "chart":
      return c.title;
    default:
      return null;
  }
}

function badgeFor(c: CanvasState): { label: string; tone: string } | null {
  switch (c.kind) {
    case "mcp-app":
      return {
        label: "Open-ended · MCP Apps",
        tone: "bg-nord-frost2/20 text-nord-frost2",
      };
    case "a2ui":
      return {
        label: "Declarative · A2UI",
        tone: "bg-nord-ok/20 text-nord-ok",
      };
    case "deploy-stream":
      return {
        label: "Controlled · AG-UI",
        tone: "bg-nord-warn/20 text-nord-warn",
      };
    case "stream-action":
      return {
        label: "Controlled · AG-UI",
        tone: "bg-nord-warn/20 text-nord-warn",
      };
    case "chart":
      return {
        label: "Controlled · Chart",
        tone: "bg-nord-frost3/20 text-nord-frost1",
      };
    default:
      return null;
  }
}

// ─── Generic AG-UI streaming panel ────────────────────────────────────────

// Per-phase tick speed for AG-UI streaming panels. Kept slow enough that the
// audience can read each phase on stage. The handler timeouts in
// DeployStatus.tsx and StreamActionTool.tsx are sized to cover this.
const STREAM_TICK_MS = 750;

function StreamActionPanel({
  state,
}: {
  state: Extract<CanvasState, { kind: "stream-action" }>;
}) {
  const { title, subtitle, phases, status, startedAt, result } = state;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (status === "complete") {
      setPhase(phases.length);
      return;
    }
    let p = 0;
    setPhase(0);
    const id = setInterval(() => {
      p += 1;
      setPhase(Math.min(p, phases.length - 1));
      if (p >= phases.length - 1) clearInterval(id);
    }, STREAM_TICK_MS);
    return () => clearInterval(id);
  }, [startedAt, status, phases.length]);

  const done = status === "complete";

  return (
    <div className="p-8 max-w-2xl">
      <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
        AG-UI streaming action
      </div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">{title}</h2>
      {subtitle && (
        <p className="text-sm opacity-60 mb-6">{subtitle}</p>
      )}

      <div className="rounded-xl border border-nord-warn/30 bg-nord-warn/5 px-4 py-3 mb-6 text-sm">
        <div className="text-[10px] uppercase tracking-[0.2em] text-nord-warn mb-1">
          Controlled pattern · AG-UI
        </div>
        <p className="text-sm opacity-80 leading-snug">
          You wrote the component, the agent triggered it. AG-UI streams the
          tool's phases as events so the React handler updates its own state
          live — no waiting for a single tool result, no full chat re-render.
        </p>
      </div>

      <ol className="space-y-3">
        {phases.map((label, i) => {
          const passed = i < phase || done;
          const active = i === phase && !done;
          return (
            <li key={label} className="flex items-center gap-3 text-base">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  passed
                    ? "bg-nord-ok/20 text-nord-ok"
                    : active
                      ? "bg-nord-warn/20 text-nord-warn animate-pulse"
                      : "bg-nord-2 text-nord-3"
                }`}
              >
                {passed ? "✓" : active ? "●" : "○"}
              </span>
              <span className={passed ? "" : active ? "" : "opacity-50"}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {done && (
        <div className="mt-8 rounded-xl bg-nord-ok/10 border border-nord-ok/30 px-4 py-3 text-sm text-nord-ok">
          ✓ {result ?? "Done."}
        </div>
      )}
    </div>
  );
}

// ─── Chart panel ──────────────────────────────────────────────────────────

const CHART_COLORS = ["#88C0D0", "#A3BE8C", "#EBCB8B", "#BF616A", "#B48EAD", "#81A1C1"];

function ChartPanel({
  state,
}: {
  state: Extract<CanvasState, { kind: "chart" }>;
}) {
  const { title, subtitle, type, unit, series, xLabels } = state;
  const formatVal = (v: number) =>
    `${unit === "$" ? "$" : ""}${v.toLocaleString()}${unit && unit !== "$" ? unit : ""}`;

  return (
    <div className="p-8 max-w-3xl">
      <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
        Visualization
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm opacity-60 mt-1">{subtitle}</p>
      )}

      <div className="rounded-xl border border-nord-frost2/30 bg-nord-frost2/5 px-4 py-3 mt-4 mb-2 text-sm">
        <div className="text-[10px] uppercase tracking-[0.2em] text-nord-frost2 mb-1">
          Controlled pattern · render-chart frontend tool
        </div>
        <p className="text-sm opacity-80 leading-snug">
          You wrote the SVG chart component, the agent called the
          `render-chart` tool with a spec. AG-UI carries the tool call; the
          host owns the rendering.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-nord-2 bg-nord-0/40 p-5">
        {type === "bar" && <BarChart series={series} unit={unit} format={formatVal} />}
        {type === "line" && (
          <LineChart series={series} xLabels={xLabels} unit={unit} format={formatVal} />
        )}
        {type === "stacked-bar" && (
          <StackedBarChart series={series} xLabels={xLabels} format={formatVal} />
        )}
      </div>
    </div>
  );
}

function BarChart({
  series,
  unit,
  format,
}: {
  series: Array<{ label: string; value?: number; color?: string }>;
  unit?: string;
  format: (v: number) => string;
}) {
  const values = series.map((s) => s.value ?? 0);
  const max = Math.max(...values, 1);
  return (
    <div className="space-y-2.5">
      {series.map((s, i) => {
        const v = s.value ?? 0;
        const pct = (v / max) * 100;
        const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
        return (
          <div key={`${s.label}-${i}`} className="flex items-center gap-3 text-sm">
            <div className="w-40 truncate text-nord-4">{s.label}</div>
            <div className="flex-1 h-7 bg-nord-2/40 rounded overflow-hidden relative">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${pct}%`,
                  background: color,
                  opacity: 0.85,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-3 text-xs font-mono text-nord-6">
                {format(v)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({
  series,
  xLabels,
  unit,
  format,
}: {
  series: Array<{ label: string; values?: number[]; color?: string }>;
  xLabels?: string[];
  unit?: string;
  format: (v: number) => string;
}) {
  const W = 640;
  const H = 220;
  const PAD = 40;
  const allValues = series.flatMap((s) => s.values ?? []);
  const max = Math.max(...allValues, 1);
  const min = 0;
  const xCount = Math.max(...series.map((s) => s.values?.length ?? 0), 1);
  const xStep = (W - PAD * 2) / Math.max(xCount - 1, 1);

  const pathFor = (vals: number[]) => {
    return vals
      .map((v, i) => {
        const x = PAD + i * xStep;
        const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Y grid */}
        {[0, 0.5, 1].map((p) => {
          const y = H - PAD - p * (H - PAD * 2);
          return (
            <g key={p}>
              <line
                x1={PAD}
                x2={W - PAD}
                y1={y}
                y2={y}
                stroke="#434C5E"
                strokeWidth={1}
                opacity={0.4}
              />
              <text x={4} y={y + 4} fill="#D8DEE9" fontSize={10} opacity={0.6}>
                {format(min + (max - min) * p)}
              </text>
            </g>
          );
        })}
        {/* X labels */}
        {xLabels?.map((l, i) => (
          <text
            key={`${l}-${i}`}
            x={PAD + i * xStep}
            y={H - 12}
            fill="#D8DEE9"
            fontSize={10}
            opacity={0.6}
            textAnchor="middle"
          >
            {l}
          </text>
        ))}
        {/* Series */}
        {series.map((s, i) => {
          if (!s.values?.length) return null;
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <g key={`${s.label}-${i}`}>
              <path
                d={pathFor(s.values)}
                fill="none"
                stroke={color}
                strokeWidth={2}
              />
              {s.values.map((v, j) => {
                const x = PAD + j * xStep;
                const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
                return (
                  <circle
                    key={j}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={color}
                    stroke="#2E3440"
                    strokeWidth={1.5}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <div key={`${s.label}-${i}`} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: color }}
              />
              <span className="opacity-80">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StackedBarChart({
  series,
  xLabels,
  format,
}: {
  series: Array<{ label: string; values?: number[]; color?: string }>;
  xLabels?: string[];
  format: (v: number) => string;
}) {
  const xCount = Math.max(...series.map((s) => s.values?.length ?? 0), 1);
  const stacks = Array.from({ length: xCount }, (_, i) =>
    series.map((s) => ({
      label: s.label,
      value: s.values?.[i] ?? 0,
      color: s.color,
    })),
  );
  const totals = stacks.map((s) => s.reduce((sum, x) => sum + x.value, 0));
  const max = Math.max(...totals, 1);

  return (
    <div>
      <div className="flex items-end gap-3 h-56">
        {stacks.map((stack, i) => {
          const total = totals[i];
          const pct = (total / max) * 100;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div className="text-[10px] opacity-60 mb-1">{format(total)}</div>
              <div
                className="w-full flex flex-col-reverse rounded overflow-hidden"
                style={{ height: `${pct}%` }}
              >
                {stack.map((seg, j) => {
                  const segPct = total ? (seg.value / total) * 100 : 0;
                  const color =
                    seg.color ?? CHART_COLORS[j % CHART_COLORS.length];
                  return (
                    <div
                      key={`${seg.label}-${j}`}
                      style={{
                        height: `${segPct}%`,
                        background: color,
                        opacity: 0.85,
                      }}
                      title={`${seg.label}: ${format(seg.value)}`}
                    />
                  );
                })}
              </div>
              <div className="text-[10px] opacity-60 mt-2 text-center">
                {xLabels?.[i] ?? `#${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mt-5 text-xs">
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <div key={`${s.label}-${i}`} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: color }}
              />
              <span className="opacity-80">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Idle ─────────────────────────────────────────────────────────────────

function IdlePanel() {
  return (
    <div className="h-full flex flex-col items-center px-12 py-12">
      <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-3">
        PlatformOps
      </div>
      <h2 className="text-2xl font-semibold tracking-tight mb-2 max-w-xl text-center">
        Your developer portal, conversation-first.
      </h2>
      <p className="text-sm opacity-60 max-w-2xl text-center mb-10">
        Service catalog, golden paths, self-service actions, deploys and
        audit — every workflow your team would build into Backstage or
        Port.io, delivered through chat and rendered right here. You never
        leave the conversation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mb-10">
        <div className="rounded-xl border border-nord-frost2/30 bg-nord-frost2/5 p-5">
          <div className="text-[10px] uppercase tracking-wider text-nord-frost2 mb-1">
            Catalog & forms
          </div>
          <div className="text-base font-semibold mb-2">
            Open the service catalog
          </div>
          <p className="text-sm opacity-70 leading-snug">
            Services, clusters, lambdas, agents. Click into a resource for
            its detail page, or scaffold a new one from a golden-path form.
          </p>
        </div>
        <div className="rounded-xl border border-nord-ok/30 bg-nord-ok/5 p-5">
          <div className="text-[10px] uppercase tracking-wider text-nord-ok mb-1">
            Generated work surfaces
          </div>
          <div className="text-base font-semibold mb-2">
            "Is it safe to deploy?"
          </div>
          <p className="text-sm opacity-70 leading-snug">
            Ask the kind of question a static portal page could never
            prebuild — readiness checks, health comparisons, ownership cards,
            runbook summaries — and get back a composed answer.
          </p>
        </div>
        <div className="rounded-xl border border-nord-warn/30 bg-nord-warn/5 p-5">
          <div className="text-[10px] uppercase tracking-wider text-nord-warn mb-1">
            Live actions
          </div>
          <div className="text-base font-semibold mb-2">
            Deploy, scale, roll back, page
          </div>
          <p className="text-sm opacity-70 leading-snug">
            Operations stream their phases live. You watch Validate → Push →
            Roll out → Health check tick by, with full audit attribution.
          </p>
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] opacity-30">
        Built on MCP Apps · A2UI · AG-UI · CopilotKit
      </div>
    </div>
  );
}

// ─── MCP App (official renderer, hosted in canvas) ────────────────────────

function MCPAppPanel({
  state,
}: {
  state: Extract<CanvasState, { kind: "mcp-app" }>;
}) {
  // Mount the official renderer with a stable key so unrelated state changes
  // in the store don't trigger a full remount.
  const key =
    typeof state.message?.id === "string"
      ? `${state.message.id}-${state.content?.resourceUri ?? ""}`
      : (state.content?.resourceUri ?? "mcp-app");

  return (
    <div className="bg-nord-0 min-h-[60vh]">
      <MCPAppsActivityRenderer
        key={key}
        activityType={state.activityType}
        content={state.content}
        message={state.message}
        agent={state.agent}
      />
    </div>
  );
}

// ─── A2UI (official renderer, hosted in canvas) ───────────────────────────

// Build once at module scope so the render component reference is stable.
const a2uiRenderer = createA2UIMessageRenderer({
  theme: a2uiDefaultTheme,
  catalog: platformA2UICatalog,
});
const A2UIRender = a2uiRenderer.render;

function A2UIPanel({
  state,
}: {
  state: Extract<CanvasState, { kind: "a2ui" }>;
}) {
  const key =
    typeof state.message?.id === "string"
      ? `${state.message.id}-${state.surfaceId}`
      : state.surfaceId;
  // The "a2ui-canvas-wrapper" class lets globals.css override the basic
  // catalog's hard-coded light inline styles into Nord colors.
  return (
    <div className="p-6 a2ui-canvas-wrapper">
      <A2UIRender
        key={key}
        activityType={state.activityType}
        content={state.content}
        message={state.message}
        agent={state.agent}
      />
    </div>
  );
}

// ─── Deploy streaming panel ───────────────────────────────────────────────

function DeployStreamPanel({
  state,
}: {
  state: Extract<CanvasState, { kind: "deploy-stream" }>;
}) {
  const phases = [
    "Validating manifest",
    "Pushing image",
    "Rolling out",
    "Health check",
  ];
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (state.status === "complete") {
      setPhase(phases.length);
      return;
    }
    let p = 0;
    setPhase(0);
    const id = setInterval(() => {
      p += 1;
      setPhase(Math.min(p, phases.length - 1));
      if (p >= phases.length - 1) clearInterval(id);
    }, STREAM_TICK_MS);
    return () => clearInterval(id);
  }, [state.startedAt, state.status]);

  const done = state.status === "complete";

  return (
    <div className="p-8 max-w-2xl">
      <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
        Deploy
      </div>
      <h2 className="text-2xl font-semibold tracking-tight mb-1">
        {state.serviceId}{" "}
        <span className="text-base opacity-50">→</span>{" "}
        <span className="text-base text-nord-frost2 font-mono">
          {state.environment}
        </span>
      </h2>
      <p className="text-sm opacity-60 mb-6">
        Streaming progress via AG-UI events from the frontend tool.
      </p>

      <div className="rounded-xl border border-nord-warn/30 bg-nord-warn/5 px-4 py-3 mb-6 text-sm">
        <div className="text-[10px] uppercase tracking-[0.2em] text-nord-warn mb-1">
          Controlled pattern · AG-UI
        </div>
        <p className="text-sm opacity-80 leading-snug">
          You wrote the deploy component, the agent triggered it. AG-UI is the
          agent ↔ frontend event protocol — progress events stream while the
          work runs, so the React handler updates its own state as each phase
          arrives instead of waiting for a single tool result.
        </p>
      </div>

      <ol className="space-y-3">
        {phases.map((label, i) => {
          const passed = i < phase || done;
          const active = i === phase && !done;
          return (
            <li key={label} className="flex items-center gap-3 text-base">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  passed
                    ? "bg-nord-ok/20 text-nord-ok"
                    : active
                      ? "bg-nord-warn/20 text-nord-warn animate-pulse"
                      : "bg-nord-2 text-nord-3"
                }`}
              >
                {passed ? "✓" : active ? "●" : "○"}
              </span>
              <span className={passed ? "" : active ? "" : "opacity-50"}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {done && (
        <div className="mt-8 rounded-xl bg-nord-ok/10 border border-nord-ok/30 px-4 py-3 text-sm text-nord-ok">
          ✓ Deployed {state.serviceId} to {state.environment} successfully.
        </div>
      )}
    </div>
  );
}
