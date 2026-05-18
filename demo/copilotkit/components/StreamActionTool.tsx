"use client";

import { useEffect } from "react";
import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useDashboardStore } from "./store";

/**
 * Generic Controlled-pattern streaming action (AG-UI). Any quick-prompt
 * tagged "Controlled · AG-UI" that isn't `deploy-streaming` calls this tool.
 * The agent provides a title and phase list; AG-UI streams them into the
 * canvas through this v2 `useFrontendTool` handler.
 *
 * Examples:
 *  - "Page primary on-call" → phases: Resolving rotation, Sending SMS, Sending Slack, Acknowledged
 *  - "Scale node group" → phases: Validating capacity, Draining old nodes, Joining new nodes, Verifying
 *  - "Invoke Lambda test" → phases: Cold start, Executing, Streaming logs, Done
 */
export function StreamActionTool() {
  const setCanvas = useDashboardStore((s) => s.setCanvas);

  useFrontendTool({
    name: "stream-action",
    description:
      "Streams a multi-phase operational action into the dashboard canvas. Title + phases + optional result message.",
    parameters: z.object({
      title: z
        .string()
        .describe(
          "Card title, e.g. 'Page primary on-call' or 'Scale node group'",
        ),
      subtitle: z
        .string()
        .optional()
        .describe(
          "Optional one-line context, e.g. 'Platform Team — incident #4203'",
        ),
      phasesJson: z
        .string()
        .describe(
          'JSON array of phase labels. Pick 3–6. Example: ["Resolving rotation","Sending SMS","Sending Slack page","Acknowledged"]',
        ),
      resultMessage: z
        .string()
        .optional()
        .describe(
          "One-line confirmation shown after the stream completes, e.g. 'Engin Diri acknowledged on Slack'",
        ),
    }),
    handler: async () => {
      // Symbolic duration so the stream is visible on stage. Sized to cover
      // up to 6 phases at the per-phase interval used by Canvas.tsx
      // StreamActionPanel (~750ms) + buffer, so the audience sees every
      // phase tick by before the agent yields to a follow-up render.
      await new Promise((r) => setTimeout(r, 5000));
      return { ok: true };
    },
    render: function StreamRender({ status, args }) {
      const title = String(args.title ?? "Action");
      const subtitle = args.subtitle ? String(args.subtitle) : undefined;
      const phases = parsePhases(args.phasesJson) ?? [
        "Starting",
        "In progress",
        "Verifying",
        "Done",
      ];
      const resultMessage = args.resultMessage
        ? String(args.resultMessage)
        : undefined;

      useEffect(() => {
        if (
          status === ToolCallStatus.Executing ||
          status === ToolCallStatus.InProgress
        ) {
          setCanvas({
            kind: "stream-action",
            title,
            subtitle,
            phases,
            status: "executing",
            startedAt: Date.now(),
          });
        } else if (status === ToolCallStatus.Complete) {
          setCanvas({
            kind: "stream-action",
            title,
            subtitle,
            phases,
            status: "complete",
            startedAt: Date.now(),
            result: resultMessage,
          });
        }
      }, [status, title, subtitle, args.phasesJson, resultMessage]);

      const tone =
        status === ToolCallStatus.Complete
          ? "border-nord-ok/40 text-nord-ok"
          : "border-nord-warn/40 text-nord-warn";

      return (
        <div
          className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border bg-nord-1/60 my-1 ${tone}`}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {status === ToolCallStatus.Complete
            ? `Completed ${title}`
            : `Streaming ${title}`}
          <span className="opacity-60">↗</span>
        </div>
      );
    },
  });

  return null;
}

function parsePhases(v: unknown): string[] | undefined {
  if (Array.isArray(v))
    return v.filter((x): x is string => typeof x === "string");
  if (typeof v !== "string") return undefined;
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : undefined;
  } catch {
    return undefined;
  }
}
