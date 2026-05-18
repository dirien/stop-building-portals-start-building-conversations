"use client";

import { useEffect } from "react";
import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useDashboardStore } from "./store";

/**
 * `render-chart` — a v2 `useFrontendTool` the agent can call when the user
 * asks for a visualization (cost breakdown, invocation graph, etc.).
 *
 * This is the Controlled pattern (AG-UI): we wrote the chart component, the
 * agent provides the spec, AG-UI carries the tool call. Same family as
 * `deploy-streaming` and `stream-action` — just shaped for visualizations.
 */
export function ChartTool() {
  const setCanvas = useDashboardStore((s) => s.setCanvas);

  useFrontendTool({
    name: "render-chart",
    description:
      "Renders an SVG chart (bar, line, or stacked-bar) in the dashboard canvas.",
    parameters: z.object({
      title: z.string().describe("Chart title"),
      subtitle: z
        .string()
        .optional()
        .describe("Optional caption under the title"),
      type: z
        .enum(["bar", "line", "stacked-bar"])
        .describe(
          "Use bar for category comparisons, line for time series, stacked-bar for multi-series stacks.",
        ),
      unit: z
        .string()
        .optional()
        .describe(
          "Optional unit shown on Y-axis labels, e.g. '$', 'ms', 'req'",
        ),
      seriesJson: z
        .string()
        .describe(
          'JSON array of series. For bar: [{"label":"EKS","value":4280}, ...]. For line: [{"label":"Errors","values":[0,2,1,7,3]}]. Optional color: \'#88c0d0\' Nord frost2, \'#a3be8c\' ok, \'#ebcb8b\' warn, \'#bf616a\' accent.',
        ),
      xLabelsJson: z
        .string()
        .optional()
        .describe(
          'Optional JSON array of x-axis labels (string[]) for line / multi-series bar charts, e.g. ["Mon","Tue","Wed"].',
        ),
    }),
    handler: async () => ({ ok: true }),
    render: function ChartRender({ status, args }) {
      const parsedSeries = safeParseArray(args.seriesJson);
      const validSeries = Array.isArray(parsedSeries)
        ? (parsedSeries.filter(
            (s) => s && typeof s === "object",
          ) as Array<Record<string, unknown>>)
        : null;
      const xLabels = safeParseArray(args.xLabelsJson) as string[] | undefined;

      useEffect(() => {
        if (
          status !== ToolCallStatus.Complete &&
          status !== ToolCallStatus.Executing
        )
          return;
        if (!validSeries || validSeries.length === 0) return;
        setCanvas({
          kind: "chart",
          title: String(args.title ?? "Chart"),
          subtitle: args.subtitle ? String(args.subtitle) : undefined,
          type: ((args.type as string) || "bar") as
            | "bar"
            | "line"
            | "stacked-bar",
          unit: args.unit ? String(args.unit) : undefined,
          series: validSeries as never,
          xLabels,
        });
      }, [
        status,
        args.title,
        args.type,
        args.seriesJson,
        args.xLabelsJson,
        args.unit,
        args.subtitle,
      ]);

      if (!validSeries || validSeries.length === 0) {
        return (
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-nord-accent/40 text-nord-accent bg-nord-1/60 my-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            Chart "{String(args.title ?? "")}" — invalid seriesJson, not rendered
          </div>
        );
      }
      return (
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-nord-frost2/40 text-nord-frost2 bg-nord-1/60 my-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          Chart "{String(args.title ?? "")}" in canvas
          <span className="opacity-60">↗</span>
        </div>
      );
    },
  });

  return null;
}

function safeParseArray(s: unknown): unknown[] | undefined {
  if (Array.isArray(s)) return s;
  if (typeof s !== "string") return undefined;
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}
