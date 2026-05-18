"use client";

import { useEffect } from "react";
import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { useDashboardStore } from "./store";

/**
 * The AG-UI Controlled pattern.
 *
 * Registers `deploy-streaming` as a v2 frontend tool via the canonical
 * `useFrontendTool` hook. Status transitions (InProgress → Executing →
 * Complete) are emitted by the v2 runtime; the render effect mirrors them
 * into the dashboard canvas so the streaming panel paints live instead of
 * inside the chat breadcrumb.
 */
export function DeployStatus() {
  const setCanvas = useDashboardStore((s) => s.setCanvas);

  useFrontendTool({
    name: "deploy-streaming",
    description:
      "AG-UI Controlled-pattern wrapper that deploys a platform service to a target environment and STREAMS the rollout phases (Validate → Push → Roll out → Health check) live into the dashboard canvas. Use this instead of the MCP server `deploy-service` tool whenever you want the user to watch progress in real time. The MCP `deploy-service` tool returns the result instantly with no animation — only use that one for the iframe-rendered deploy-result page.",
    parameters: z.object({
      serviceId: z
        .string()
        .describe("The service ID (e.g. user-service, payment-api)"),
      environment: z
        .enum(["staging", "production"])
        .describe("Target environment"),
    }),
    handler: async ({ serviceId: _s, environment: _e }) => {
      // 4 phases × ~750ms tick (see Canvas.tsx DeployStreamPanel) + buffer.
      // Keep this in sync with the per-phase interval so the audience sees
      // the full Validate → Push → Roll out → Health check sweep before the
      // agent moves on (e.g. to a follow-up A2UI confirmation card).
      await new Promise((r) => setTimeout(r, 4000));
      return {
        status: "success",
        deploymentId: `deploy-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    },
    render: function DeployRender({ status, args }) {
      const serviceId = String(args.serviceId ?? "unknown");
      const environment = String(args.environment ?? "staging") as
        | "staging"
        | "production";

      useEffect(() => {
        if (
          status === ToolCallStatus.Executing ||
          status === ToolCallStatus.InProgress
        ) {
          setCanvas({
            kind: "deploy-stream",
            serviceId,
            environment,
            status: "executing",
            startedAt: Date.now(),
          });
        } else if (status === ToolCallStatus.Complete) {
          setCanvas({
            kind: "deploy-stream",
            serviceId,
            environment,
            status: "complete",
            startedAt: Date.now(),
          });
        }
      }, [status, serviceId, environment]);

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
            ? `Deployed ${serviceId} → ${environment}`
            : `Deploying ${serviceId} → ${environment}`}
          <span className="opacity-60">↗</span>
        </div>
      );
    },
  });

  return null;
}
