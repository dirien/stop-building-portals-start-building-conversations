import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import fs from "node:fs/promises";

const server = new McpServer({
  name: "Platform Service Catalog",
  version: "1.0.0",
});

const RESOURCE_URI = "ui://platform-catalog/mcp-app.html";

// Tool: returns data + points to the UI resource
registerAppTool(server, "show-catalog", {
  title: "Platform Service Catalog",
  description: "Shows all registered platform services",
  inputSchema: {},
  _meta: { ui: { resourceUri: RESOURCE_URI } },
}, async () => ({
  content: [{ type: "text", text: "5 services found" }],
  structuredContent: { view: "catalog", services: [...] },
}));

// App-only tool: callable from UI, hidden from model
registerAppTool(server, "deploy-service", {
  description: "Deploy a service to an environment",
  inputSchema: z.object({
    serviceId: z.string(),
    environment: z.enum(["staging", "production"]),
  }),
  _meta: { ui: { resourceUri: RESOURCE_URI, visibility: ["app"] } },
}, async ({ serviceId, environment }) => ({
  content: [{ type: "text", text: `Deployed to ${environment}` }],
  structuredContent: { view: "deploy-result", deployment: {...} },
}));

// Resource: serves the bundled HTML app
registerAppResource(
  server,
  "platform-catalog-ui",
  RESOURCE_URI,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => ({
    contents: [{
      uri: RESOURCE_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: await fs.readFile("dist/mcp-app.html", "utf-8"),
    }],
  }),
);
