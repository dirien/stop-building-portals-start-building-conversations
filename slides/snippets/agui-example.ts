// AG-UI + CopilotKit — Agent-frontend generative UI
import { useCopilotAction } from "@copilotkit/react-core";
import { HttpAgent } from "@ag-ui/client";

// CopilotKit: define a generative UI action
useCopilotAction({
  name: "showDeployStatus",
  description: "Show deployment status for a service",
  parameters: [
    { name: "serviceId", type: "string" },
    { name: "environment", type: "string" },
  ],
  // Render a React component inline in the chat
  render: ({ status, args }) => (
    <DeployStatusCard
      serviceId={args.serviceId}
      environment={args.environment}
      loading={status === "executing"}
    />
  ),
  handler: async ({ serviceId, environment }) => {
    return await triggerDeploy(serviceId, environment);
  },
});

// AG-UI: connect to any agent backend
const agent = new HttpAgent({
  url: "https://api.example.com/agent",
});
// 16 event types: RUN_STARTED, TEXT_MESSAGE_*,
// TOOL_CALL_*, STATE_DELTA, RUN_FINISHED
