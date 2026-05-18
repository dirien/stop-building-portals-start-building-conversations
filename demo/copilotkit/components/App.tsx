"use client";

import { CopilotKitProvider, CopilotSidebar } from "@copilotkit/react-core/v2";
import { Dashboard } from "./Dashboard";
import { DeployStatus } from "./DeployStatus";
import { ChartTool } from "./ChartTool";
import { StreamActionTool } from "./StreamActionTool";
import { DATA_FRONTEND_TOOLS } from "./DataTools";
import { FocusedResourceContext, CanvasContext } from "./AgentContexts";
import {
  mcpAppsCanvasRenderer,
  a2uiCanvasRenderer,
} from "./CanvasInterceptors";

/**
 * Wiring:
 *
 *  CopilotKitProvider
 *    runtimeUrl → /api/copilotkit (BuiltInAgent + middlewares)
 *    renderActivityMessages → canvas interceptors (not the chat)
 *
 *  <Dashboard />   — sidebar + quick prompts + <Canvas /> main area
 *  <DeployStatus /> — registers the AG-UI deploy-streaming frontend tool
 *  <ChartTool />    — registers the render-chart frontend tool
 *  <StreamActionTool /> — registers the generic stream-action frontend tool
 *  frontendTools    — registers cost-breakdown, service-metrics,
 *                     list-deployments, get-runbook, get-oncall up front
 *                     with stage-reliable mocked data.
 *  <CopilotSidebar /> — the chat, narrow, conversation only
 *
 *  Activities (MCP App iframes, A2UI surfaces) are routed by the
 *  interceptors into the dashboard store, where <Canvas /> renders them.
 */
const renderActivityMessages = [mcpAppsCanvasRenderer, a2uiCanvasRenderer];

export function App() {
  return (
    <CopilotKitProvider
      runtimeUrl="/api/copilotkit"
      renderActivityMessages={renderActivityMessages}
      frontendTools={DATA_FRONTEND_TOOLS}
    >
      {/* Dynamic agent contexts — focused resource + canvas state are
          injected into every agent request automatically. The A2UI catalog
          schema is owned server-side by the A2UI middleware (route.ts). */}
      <FocusedResourceContext />
      <CanvasContext />

      <Dashboard />
      <DeployStatus />
      <ChartTool />
      <StreamActionTool />
      <CopilotSidebar
        defaultOpen
        width={360}
        labels={{
          modalHeaderTitle: "Agent Console",
          welcomeMessageText: "Ready.",
        }}
      />
    </CopilotKitProvider>
  );
}
