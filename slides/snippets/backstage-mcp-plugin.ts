// Backstage v1.40 — @backstage/plugin-mcp-actions-backend
// Your Backstage catalog, accessible as MCP tools

import { createBackendModule } from '@backstage/backend-plugin-api';
import { mcpActionsPlugin } from '@backstage/plugin-mcp-actions-backend';

// Every scaffolder action → MCP tool
// Every catalog entity → queryable via conversation
// Your portal becomes an MCP server

const backend = createBackend();
backend.add(mcpActionsPlugin);

// AI agents can now:
// - Query your software catalog
// - Invoke scaffolder templates
// - Access TechDocs
// All from inside the conversation
