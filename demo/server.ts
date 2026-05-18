import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

// ─── Data ──────────────────────────────────────────────────────────────────
//
// Richer than a stock demo on purpose — this is the surface area a real
// internal developer portal would expose. Six services with ownership,
// language stack, replicas, endpoints, SLO targets, on-call rotation,
// linked runbook, and a deployment history.

const oncallRotations: Record<string, { primary: string; secondary: string; rotationEnds: string }> = {
  "Platform Team": {
    primary: "Engin Diri",
    secondary: "Hila Fish",
    rotationEnds: "2026-05-23T09:00:00Z",
  },
  "Commerce Team": {
    primary: "Ido Salomon",
    secondary: "Liad Yosef",
    rotationEnds: "2026-05-20T09:00:00Z",
  },
  "Infrastructure Team": {
    primary: "Aviv Gilad",
    secondary: "Tomer Kohen",
    rotationEnds: "2026-05-22T09:00:00Z",
  },
  "Security Team": {
    primary: "Maya Cohen",
    secondary: "Yotam Avraham",
    rotationEnds: "2026-05-21T09:00:00Z",
  },
  "Data Team": {
    primary: "Noa Tessler",
    secondary: "Or Levi",
    rotationEnds: "2026-05-19T09:00:00Z",
  },
};

interface Service {
  id: string;
  name: string;
  description: string;
  team: string;
  language: string;
  health: "healthy" | "degraded" | "unhealthy";
  replicas: number;
  lastDeploy: string;
  endpoints: string[];
  dependencies: string[];
  slo: { target: number; current: number; window: string };
  runbookUrl: string;
}

const services: Service[] = [
  {
    id: "user-service",
    name: "User Service",
    description: "Manages user accounts, authentication, and profiles",
    team: "Platform Team",
    language: "Go",
    health: "healthy",
    replicas: 3,
    lastDeploy: "2026-04-12T14:30:00Z",
    endpoints: ["/api/v1/users", "/api/v1/auth", "/api/v1/profiles"],
    dependencies: ["auth-service", "notification-service"],
    slo: { target: 99.9, current: 99.97, window: "30d" },
    runbookUrl: "https://runbooks.platformops.dev/user-service",
  },
  {
    id: "payment-api",
    name: "Payment API",
    description: "Processes payments, refunds, and billing operations",
    team: "Commerce Team",
    language: "TypeScript",
    health: "healthy",
    replicas: 5,
    lastDeploy: "2026-04-10T09:15:00Z",
    endpoints: ["/api/v1/payments", "/api/v1/refunds", "/api/v1/invoices"],
    dependencies: ["user-service", "notification-service"],
    slo: { target: 99.95, current: 99.92, window: "30d" },
    runbookUrl: "https://runbooks.platformops.dev/payment-api",
  },
  {
    id: "notification-service",
    name: "Notification Service",
    description: "Sends emails, SMS, push notifications, and Slack messages",
    team: "Platform Team",
    language: "Python",
    health: "degraded",
    replicas: 2,
    lastDeploy: "2026-04-08T16:45:00Z",
    endpoints: ["/api/v1/notifications", "/api/v1/templates"],
    dependencies: [],
    slo: { target: 99.5, current: 97.8, window: "30d" },
    runbookUrl: "https://runbooks.platformops.dev/notification-service",
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    description: "Routes and rate-limits all external API traffic",
    team: "Infrastructure Team",
    language: "Rust",
    health: "healthy",
    replicas: 4,
    lastDeploy: "2026-04-13T11:00:00Z",
    endpoints: ["/gateway/v1/routes", "/gateway/v1/ratelimits"],
    dependencies: ["auth-service"],
    slo: { target: 99.99, current: 99.99, window: "30d" },
    runbookUrl: "https://runbooks.platformops.dev/api-gateway",
  },
  {
    id: "auth-service",
    name: "Auth Service",
    description: "OAuth2/OIDC provider for all internal services",
    team: "Security Team",
    language: "Go",
    health: "healthy",
    replicas: 3,
    lastDeploy: "2026-04-11T08:20:00Z",
    endpoints: ["/auth/v1/token", "/auth/v1/jwks", "/auth/v1/authorize"],
    dependencies: [],
    slo: { target: 99.99, current: 99.98, window: "30d" },
    runbookUrl: "https://runbooks.platformops.dev/auth-service",
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "ETL and streaming data processing for analytics",
    team: "Data Team",
    language: "Scala",
    health: "unhealthy",
    replicas: 1,
    lastDeploy: "2026-04-05T22:10:00Z",
    endpoints: ["/api/v1/pipelines", "/api/v1/jobs"],
    dependencies: ["user-service"],
    slo: { target: 99.0, current: 94.2, window: "30d" },
    runbookUrl: "https://runbooks.platformops.dev/data-pipeline",
  },
];

// Deployment history — newest first. Each tool call to deploy-service appends
// to this list so the demo feels alive over a session.
const deployments: Array<{
  id: string;
  serviceId: string;
  serviceName: string;
  environment: "staging" | "production";
  status: "success" | "failed" | "in-progress";
  initiatedBy: string;
  durationMs: number;
  commitSha: string;
  timestamp: string;
}> = [
  {
    id: "deploy-1715000003",
    serviceId: "api-gateway",
    serviceName: "API Gateway",
    environment: "production",
    status: "success",
    initiatedBy: "engin.diri",
    durationMs: 87_200,
    commitSha: "f3a92c1",
    timestamp: "2026-04-13T11:00:00Z",
  },
  {
    id: "deploy-1715000002",
    serviceId: "user-service",
    serviceName: "User Service",
    environment: "staging",
    status: "success",
    initiatedBy: "hila.fish",
    durationMs: 64_800,
    commitSha: "9d7a4b2",
    timestamp: "2026-04-12T14:30:00Z",
  },
  {
    id: "deploy-1715000001",
    serviceId: "payment-api",
    serviceName: "Payment API",
    environment: "production",
    status: "success",
    initiatedBy: "ido.salomon",
    durationMs: 142_300,
    commitSha: "2c4e8f1",
    timestamp: "2026-04-10T09:15:00Z",
  },
  {
    id: "deploy-1715000000",
    serviceId: "data-pipeline",
    serviceName: "Data Pipeline",
    environment: "production",
    status: "failed",
    initiatedBy: "noa.tessler",
    durationMs: 38_400,
    commitSha: "8b1d3a7",
    timestamp: "2026-04-05T22:10:00Z",
  },
];

// Inline runbooks. In a real system these would live in a docs portal —
// here we serve them through MCP so the agent can pull them on demand.
const runbooks: Record<string, { title: string; sections: Array<{ heading: string; body: string }> }> = {
  "user-service": {
    title: "User Service — Incident Runbook",
    sections: [
      {
        heading: "Symptoms",
        body: "Elevated 5xx rate on /api/v1/auth, or login attempts hanging > 2s.",
      },
      {
        heading: "First 5 minutes",
        body: "1. Check auth-service health (it's a hard dependency).\n2. Inspect HPA — pods may be CPU-throttled.\n3. Roll back to the previous deploy if the spike correlates with a release.",
      },
      {
        heading: "Escalation",
        body: "Platform Team primary on-call → Security Team if auth-service is degraded.",
      },
    ],
  },
  "payment-api": {
    title: "Payment API — Incident Runbook",
    sections: [
      {
        heading: "Symptoms",
        body: "Failed-payment rate above 0.5% over a 5-minute window, or webhook-delivery lag > 30s.",
      },
      {
        heading: "First 5 minutes",
        body: "1. Verify upstream processor (Stripe/Adyen) status pages.\n2. Inspect circuit breakers — a stuck breaker holds payments in retry queue.\n3. Drain affected pod if memory > 85%.",
      },
      {
        heading: "Escalation",
        body: "Commerce Team primary on-call → Finance Ops if the queue depth exceeds 10k.",
      },
    ],
  },
  "notification-service": {
    title: "Notification Service — Incident Runbook",
    sections: [
      {
        heading: "Symptoms",
        body: "Push or email queue depth above 50k, or vendor-side bounce rate > 2%.",
      },
      {
        heading: "First 5 minutes",
        body: "1. Throttle by channel — disable the worst-offender vendor temporarily.\n2. Re-enqueue failed jobs with a backoff window of 60s.\n3. Notify product teams whose campaigns are paused.",
      },
      {
        heading: "Escalation",
        body: "Platform Team primary on-call. If SES/SendGrid limits are hit, page Infrastructure Team.",
      },
    ],
  },
  "api-gateway": {
    title: "API Gateway — Incident Runbook",
    sections: [
      {
        heading: "Symptoms",
        body: "p99 latency > 200ms across all routes, or 429 rate > 5%.",
      },
      {
        heading: "First 5 minutes",
        body: "1. Check origin shield — CDN may be returning cold misses.\n2. Inspect rate-limit buckets for a single noisy tenant.\n3. Bypass the auth filter only if the auth-service is the bottleneck.",
      },
      {
        heading: "Escalation",
        body: "Infrastructure Team primary. Page CDN vendor only after 15 minutes of sustained degradation.",
      },
    ],
  },
  "auth-service": {
    title: "Auth Service — Incident Runbook",
    sections: [
      {
        heading: "Symptoms",
        body: "Token-issuance error rate > 0.1%, or JWKS endpoint returning stale keys.",
      },
      {
        heading: "First 5 minutes",
        body: "1. Verify upstream IdP (Okta/Entra) is reachable.\n2. Inspect KMS for signing-key rotation lag.\n3. Force a JWKS cache flush if clients are getting stale keys.",
      },
      {
        heading: "Escalation",
        body: "Security Team primary. CISO must be paged if any sign of credential exposure.",
      },
    ],
  },
  "data-pipeline": {
    title: "Data Pipeline — Incident Runbook",
    sections: [
      {
        heading: "Symptoms",
        body: "Backlog > 1h, or job-failure rate > 10% over 15 minutes.",
      },
      {
        heading: "First 5 minutes",
        body: "1. Check upstream Kafka — partition lag is the usual culprit.\n2. Look for OOMs in the Spark executors; bump driver memory.\n3. Halt low-priority jobs to free up cluster slots.",
      },
      {
        heading: "Escalation",
        body: "Data Team primary. Page Infrastructure Team if the underlying cluster is unhealthy.",
      },
    ],
  },
};

// ─── Cloud resource data ───────────────────────────────────────────────────

interface EksCluster {
  id: string;
  name: string;
  region: string;
  version: string;
  status: "active" | "creating" | "updating" | "degraded";
  nodeGroups: Array<{ name: string; instanceType: string; desired: number; min: number; max: number }>;
  podsRunning: number;
  servicesAttached: number;
  costMonthUsd: number;
  createdAt: string;
}

const clusters: EksCluster[] = [
  {
    id: "platformops-prod",
    name: "platformops-prod",
    region: "us-east-1",
    version: "1.30",
    status: "active",
    nodeGroups: [
      { name: "general", instanceType: "m6i.xlarge", desired: 8, min: 3, max: 24 },
      { name: "burst", instanceType: "c6i.2xlarge", desired: 2, min: 0, max: 12 },
    ],
    podsRunning: 142,
    servicesAttached: 38,
    costMonthUsd: 4280,
    createdAt: "2025-11-04T10:22:00Z",
  },
  {
    id: "platformops-staging",
    name: "platformops-staging",
    region: "us-east-1",
    version: "1.30",
    status: "active",
    nodeGroups: [
      { name: "general", instanceType: "m6i.large", desired: 3, min: 2, max: 8 },
    ],
    podsRunning: 54,
    servicesAttached: 38,
    costMonthUsd: 920,
    createdAt: "2025-11-04T10:50:00Z",
  },
];

interface LambdaFn {
  name: string;
  runtime: string;
  memoryMb: number;
  timeoutSeconds: number;
  region: string;
  triggers: string[];
  invocations24h: number;
  errors24h: number;
  p99Ms: number;
  costMonthUsd: number;
  lastDeploy: string;
  status: "active" | "creating" | "updating";
}

const lambdas: LambdaFn[] = [
  {
    name: "invoice-processor",
    runtime: "nodejs20.x",
    memoryMb: 512,
    timeoutSeconds: 30,
    region: "us-east-1",
    triggers: ["sqs:invoices-queue"],
    invocations24h: 14_293,
    errors24h: 12,
    p99Ms: 240,
    costMonthUsd: 47.2,
    lastDeploy: "2026-04-10T09:15:00Z",
    status: "active",
  },
  {
    name: "image-resize",
    runtime: "python3.12",
    memoryMb: 1024,
    timeoutSeconds: 60,
    region: "us-east-1",
    triggers: ["s3:uploads-bucket"],
    invocations24h: 8_192,
    errors24h: 0,
    p99Ms: 1100,
    costMonthUsd: 89.4,
    lastDeploy: "2026-04-02T16:00:00Z",
    status: "active",
  },
  {
    name: "webhook-fanout",
    runtime: "nodejs20.x",
    memoryMb: 256,
    timeoutSeconds: 15,
    region: "us-east-1",
    triggers: ["apigw:webhooks"],
    invocations24h: 31_044,
    errors24h: 78,
    p99Ms: 95,
    costMonthUsd: 22.6,
    lastDeploy: "2026-04-14T08:30:00Z",
    status: "active",
  },
];

interface AgentCoreDeployment {
  id: string;
  name: string;
  model: string;
  status: "active" | "deploying" | "paused";
  region: string;
  invocations24h: number;
  avgLatencyMs: number;
  errorRate: number;
  costMonthUsd: number;
  guardrails: string[];
  knowledgeBases: string[];
  lastDeploy: string;
}

const agentCores: AgentCoreDeployment[] = [
  {
    id: "support-triage",
    name: "support-triage",
    model: "anthropic.claude-sonnet-4-5",
    status: "active",
    region: "us-east-1",
    invocations24h: 412,
    avgLatencyMs: 1820,
    errorRate: 0.6,
    costMonthUsd: 312,
    guardrails: ["pii-redaction", "no-financial-advice"],
    knowledgeBases: ["help-center", "past-tickets"],
    lastDeploy: "2026-04-09T13:00:00Z",
  },
  {
    id: "code-reviewer",
    name: "code-reviewer",
    model: "anthropic.claude-opus-4-1",
    status: "active",
    region: "us-east-1",
    invocations24h: 87,
    avgLatencyMs: 4600,
    errorRate: 1.1,
    costMonthUsd: 580,
    guardrails: ["no-credentials-leak"],
    knowledgeBases: ["engineering-handbook"],
    lastDeploy: "2026-04-11T09:30:00Z",
  },
];

const RESOURCE_URI = "ui://platform-catalog/mcp-app.html";

function getDistDir(): string {
  const dir = import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);
  return dir.endsWith("dist") ? dir : path.join(dir, "dist");
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Platform Service Catalog",
    version: "2.0.0",
  });

  // ─── show-catalog ──────────────────────────────────────────────────────
  registerAppTool(
    server,
    "show-catalog",
    {
      title: "Platform Service Catalog",
      description:
        "Shows the platform service catalog with all registered services, their health status, and deployment information.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: `Platform Service Catalog:\n${services
            .map((s) => `- ${s.name} (${s.health}) — ${s.description}`)
            .join("\n")}`,
        },
      ],
      structuredContent: {
        view: "catalog",
        services: services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          team: s.team,
          language: s.language,
          health: s.health,
          replicas: s.replicas,
          lastDeploy: s.lastDeploy,
        })),
      },
    }),
  );

  // ─── show-service ──────────────────────────────────────────────────────
  registerAppTool(
    server,
    "show-service",
    {
      title: "Service Details",
      description:
        "Shows detailed information about a specific platform service, including endpoints, dependencies, SLO target, and on-call rotation.",
      inputSchema: z.object({
        serviceId: z.string().describe("The service ID (e.g. user-service)"),
      }),
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ serviceId }) => {
      const service = services.find((s) => s.id === serviceId);
      if (!service) {
        return {
          content: [{ type: "text", text: `Service not found: ${serviceId}` }],
          isError: true,
        };
      }
      const oncall = oncallRotations[service.team];
      return {
        content: [
          {
            type: "text",
            text: `${service.name} (${service.health}) — owned by ${service.team}. SLO ${service.slo.current}% / ${service.slo.target}% (${service.slo.window}). On-call: ${oncall?.primary ?? "TBD"}.`,
          },
        ],
        structuredContent: {
          view: "detail",
          service: { ...service, oncall },
        },
      };
    },
  );

  // ─── deploy-service (app-only) ─────────────────────────────────────────
  registerAppTool(
    server,
    "deploy-service",
    {
      title: "Deploy Service",
      description:
        "Triggers a deployment for a platform service to a target environment.",
      inputSchema: z.object({
        serviceId: z.string().describe("The service ID to deploy"),
        environment: z
          .enum(["staging", "production"])
          .describe("Target environment"),
      }),
      _meta: { ui: { resourceUri: RESOURCE_URI, visibility: ["app"] } },
    },
    async ({ serviceId, environment }) => {
      const service = services.find((s) => s.id === serviceId);
      if (!service) {
        return {
          content: [{ type: "text", text: `Service not found: ${serviceId}` }],
          isError: true,
        };
      }
      const deployment = {
        id: `deploy-${Date.now()}`,
        serviceId,
        serviceName: service.name,
        environment,
        status: "success" as const,
        initiatedBy: "you",
        durationMs: 60_000 + Math.floor(Math.random() * 60_000),
        commitSha: Math.random().toString(16).slice(2, 9),
        timestamp: new Date().toISOString(),
      };
      deployments.unshift(deployment);
      service.lastDeploy = deployment.timestamp;
      return {
        content: [
          {
            type: "text",
            text: `Deployed ${service.name} to ${environment} successfully.`,
          },
        ],
        structuredContent: {
          view: "deploy-result",
          deployment,
        },
      };
    },
  );

  // ─── list-deployments (data-only, no UI resource) ──────────────────────
  server.tool(
    "list-deployments",
    "Lists recent deployments across all services, with optional filters by service or environment.",
    {
      serviceId: z
        .string()
        .optional()
        .describe("Optionally filter to one service id"),
      environment: z
        .enum(["staging", "production"])
        .optional()
        .describe("Optionally filter to one environment"),
      limit: z
        .number()
        .int()
        .positive()
        .max(50)
        .optional()
        .describe("Max number of results (default 10)"),
    },
    async ({ serviceId, environment, limit }) => {
      const filtered = deployments
        .filter((d) => (serviceId ? d.serviceId === serviceId : true))
        .filter((d) => (environment ? d.environment === environment : true))
        .slice(0, limit ?? 10);
      return {
        content: [
          {
            type: "text",
            text:
              filtered.length === 0
                ? "No matching deployments."
                : filtered
                    .map(
                      (d) =>
                        `${d.serviceName} → ${d.environment} (${d.status}) at ${d.timestamp} by ${d.initiatedBy}, sha ${d.commitSha}`,
                    )
                    .join("\n"),
          },
        ],
        structuredContent: {
          view: "deployments",
          deployments: filtered,
        },
      };
    },
  );

  // ─── get-oncall (data-only) ────────────────────────────────────────────
  server.tool(
    "get-oncall",
    "Returns the current on-call primary and secondary for a team, plus when the rotation ends.",
    {
      team: z
        .string()
        .describe(
          "Team name, e.g. 'Platform Team' or 'Commerce Team'. Pass an empty string to get all rotations.",
        ),
    },
    async ({ team }) => {
      if (!team || team.trim() === "") {
        return {
          content: [
            {
              type: "text",
              text: Object.entries(oncallRotations)
                .map(
                  ([t, r]) =>
                    `${t}: primary ${r.primary}, secondary ${r.secondary}, ends ${r.rotationEnds}`,
                )
                .join("\n"),
            },
          ],
          structuredContent: {
            view: "oncall-list",
            rotations: oncallRotations,
          },
        };
      }
      const r = oncallRotations[team];
      if (!r) {
        return {
          content: [{ type: "text", text: `Unknown team: ${team}` }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `${team}: primary ${r.primary}, secondary ${r.secondary}, rotation ends ${r.rotationEnds}.`,
          },
        ],
        structuredContent: {
          view: "oncall",
          team,
          ...r,
        },
      };
    },
  );

  // ─── get-runbook (data-only) ───────────────────────────────────────────
  server.tool(
    "get-runbook",
    "Returns the incident runbook for a given service: symptoms, first-5-minutes steps, and escalation path.",
    {
      serviceId: z
        .string()
        .describe("The service ID, e.g. user-service or payment-api"),
    },
    async ({ serviceId }) => {
      const rb = runbooks[serviceId];
      if (!rb) {
        return {
          content: [
            { type: "text", text: `No runbook found for ${serviceId}.` },
          ],
          isError: true,
        };
      }
      const text = `${rb.title}\n\n${rb.sections
        .map((s) => `## ${s.heading}\n${s.body}`)
        .join("\n\n")}`;
      return {
        content: [{ type: "text", text }],
        structuredContent: {
          view: "runbook",
          serviceId,
          ...rb,
        },
      };
    },
  );

  // ─── service-metrics (data-only) ───────────────────────────────────────
  server.tool(
    "service-metrics",
    "Returns SLO target vs current and basic health/replica info for a service. Use when the user asks about reliability or compliance with an SLO.",
    {
      serviceId: z.string().describe("The service ID"),
    },
    async ({ serviceId }) => {
      const s = services.find((x) => x.id === serviceId);
      if (!s) {
        return {
          content: [{ type: "text", text: `Service not found: ${serviceId}` }],
          isError: true,
        };
      }
      const headroom = +(s.slo.current - s.slo.target).toFixed(2);
      const status =
        headroom >= 0 ? "meeting SLO" : "BURNING ERROR BUDGET";
      return {
        content: [
          {
            type: "text",
            text: `${s.name} — current ${s.slo.current}%, target ${s.slo.target}% over ${s.slo.window}. Headroom ${headroom > 0 ? "+" : ""}${headroom}% — ${status}.`,
          },
        ],
        structuredContent: {
          view: "metrics",
          serviceId: s.id,
          name: s.name,
          health: s.health,
          replicas: s.replicas,
          slo: s.slo,
          headroom,
          status,
        },
      };
    },
  );

  // ════════════════════════════════════════════════════════════════════════
  // DAY 1 — Cloud resource provisioning (UI-enabled MCP App tools)
  // ════════════════════════════════════════════════════════════════════════

  // ─── new-eks-cluster (form view) ───────────────────────────────────────
  // Renders a form in the MCP App. User fills inputs and the iframe calls
  // create-eks-cluster via app.callServerTool() with the gathered values.
  registerAppTool(
    server,
    "new-eks-cluster",
    {
      title: "New EKS cluster (form)",
      description:
        "Opens a form so the user can fill in EKS cluster details (name, region, version, instance type, desired node count). Use this when the user asks to create a cluster WITHOUT providing every detail in plain text — the form collects them in the canvas.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "Open the EKS cluster form so the user can fill in details.",
        },
      ],
      structuredContent: {
        view: "cluster-form",
        defaults: {
          region: "us-east-1",
          version: "1.30",
          instanceType: "m6i.large",
          desiredNodes: 3,
        },
        regions: [
          "us-east-1",
          "us-east-2",
          "us-west-2",
          "eu-west-1",
          "eu-central-1",
          "ap-northeast-1",
        ],
        versions: ["1.30", "1.29", "1.28"],
        instanceTypes: [
          "t3.medium",
          "m6i.large",
          "m6i.xlarge",
          "m6i.2xlarge",
          "c6i.large",
          "c6i.xlarge",
          "c6i.2xlarge",
          "r6i.large",
          "r6i.xlarge",
        ],
      },
    }),
  );

  // ─── new-lambda (form view) ────────────────────────────────────────────
  registerAppTool(
    server,
    "new-lambda",
    {
      title: "New Lambda function (form)",
      description:
        "Opens a form so the user can fill in Lambda details (name, runtime, memory, timeout, trigger, code URL). Use when the user asks to create a Lambda WITHOUT providing every detail.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "Open the Lambda function form so the user can fill in details.",
        },
      ],
      structuredContent: {
        view: "lambda-form",
        defaults: {
          runtime: "nodejs20.x",
          memoryMb: 512,
          timeoutSeconds: 30,
          trigger: "none",
        },
        runtimes: [
          "nodejs20.x",
          "nodejs22.x",
          "python3.12",
          "python3.13",
          "go1.x",
          "java21",
          "ruby3.3",
        ],
        triggers: ["none", "apigw", "sqs", "s3", "eventbridge", "schedule"],
      },
    }),
  );

  // ─── new-agentcore (form view) ─────────────────────────────────────────
  registerAppTool(
    server,
    "new-agentcore",
    {
      title: "New AgentCore agent (form)",
      description:
        "Opens a form so the user can fill in agent details (name, model, guardrails, knowledge bases). Use when the user asks to deploy an AgentCore agent WITHOUT providing every detail.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "Open the AgentCore form so the user can fill in details.",
        },
      ],
      structuredContent: {
        view: "agent-form",
        defaults: {
          model: "anthropic.claude-sonnet-4-5",
        },
        models: [
          "anthropic.claude-sonnet-4-5",
          "anthropic.claude-opus-4-1",
          "anthropic.claude-haiku-4-5",
        ],
        availableGuardrails: [
          "pii-redaction",
          "no-financial-advice",
          "no-credentials-leak",
          "content-safety",
        ],
        availableKnowledgeBases: [
          "help-center",
          "past-tickets",
          "engineering-handbook",
          "product-docs",
          "compliance-policies",
        ],
      },
    }),
  );

  // ─── list-clusters ─────────────────────────────────────────────────────
  registerAppTool(
    server,
    "list-clusters",
    {
      title: "EKS clusters",
      description:
        "Lists all EKS clusters with status, region, version, node groups, and monthly cost.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: clusters
            .map(
              (c) =>
                `${c.name} (${c.status}) — ${c.region}, k8s ${c.version}, ${c.podsRunning} pods, $${c.costMonthUsd}/mo`,
            )
            .join("\n"),
        },
      ],
      structuredContent: { view: "clusters", clusters },
    }),
  );

  // ─── create-eks-cluster ────────────────────────────────────────────────
  registerAppTool(
    server,
    "create-eks-cluster",
    {
      title: "Create EKS cluster",
      description:
        "Provisions a new EKS cluster. Walks through Validating IAM → Creating VPC → Creating control plane → Joining node groups → Ready.",
      inputSchema: z.object({
        name: z.string().describe("Cluster name, e.g. platformops-eu"),
        region: z.string().describe("AWS region, e.g. us-east-1, eu-west-1"),
        version: z
          .string()
          .optional()
          .describe("Kubernetes version, default 1.30"),
        instanceType: z
          .string()
          .optional()
          .describe("Worker node instance type, default m6i.large"),
        desiredNodes: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Initial node count, default 3"),
      }),
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ name, region, version, instanceType, desiredNodes }) => {
      const cluster: EksCluster = {
        id: name,
        name,
        region,
        version: version ?? "1.30",
        status: "active",
        nodeGroups: [
          {
            name: "general",
            instanceType: instanceType ?? "m6i.large",
            desired: desiredNodes ?? 3,
            min: 2,
            max: 8,
          },
        ],
        podsRunning: 0,
        servicesAttached: 0,
        costMonthUsd: 280 * (desiredNodes ?? 3),
        createdAt: new Date().toISOString(),
      };
      clusters.unshift(cluster);
      return {
        content: [
          {
            type: "text",
            text: `Provisioned EKS cluster ${name} in ${region}, k8s ${cluster.version}, ${desiredNodes ?? 3} × ${instanceType ?? "m6i.large"} nodes.`,
          },
        ],
        structuredContent: {
          view: "cluster-provision",
          cluster,
          phases: [
            { name: "Validating IAM permissions", status: "complete", durationMs: 1200 },
            { name: "Creating VPC and subnets", status: "complete", durationMs: 14000 },
            { name: "Creating control plane", status: "complete", durationMs: 220000 },
            { name: "Joining node groups", status: "complete", durationMs: 90000 },
            { name: "Installing addons (CoreDNS, kube-proxy, VPC CNI)", status: "complete", durationMs: 38000 },
            { name: "Cluster ready", status: "complete", durationMs: 0 },
          ],
        },
      };
    },
  );

  // ─── list-lambdas ──────────────────────────────────────────────────────
  registerAppTool(
    server,
    "list-lambdas",
    {
      title: "Lambda functions",
      description:
        "Lists all Lambda functions with runtime, memory, triggers, last-24h invocations, error count, and monthly cost.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: lambdas
            .map(
              (l) =>
                `${l.name} (${l.runtime}) — ${l.invocations24h.toLocaleString()} inv/24h, ${l.errors24h} errors, p99 ${l.p99Ms}ms`,
            )
            .join("\n"),
        },
      ],
      structuredContent: { view: "lambdas", lambdas },
    }),
  );

  // ─── create-lambda ─────────────────────────────────────────────────────
  registerAppTool(
    server,
    "create-lambda",
    {
      title: "Create Lambda function",
      description:
        "Creates a new Lambda function with the chosen runtime, memory, and trigger configuration.",
      inputSchema: z.object({
        name: z.string().describe("Function name, e.g. order-webhook-handler"),
        runtime: z
          .enum([
            "nodejs20.x",
            "nodejs22.x",
            "python3.12",
            "python3.13",
            "go1.x",
            "java21",
            "ruby3.3",
          ])
          .describe("Lambda runtime"),
        memoryMb: z
          .number()
          .int()
          .min(128)
          .max(10240)
          .optional()
          .describe("Memory in MB, default 512"),
        timeoutSeconds: z
          .number()
          .int()
          .positive()
          .max(900)
          .optional()
          .describe("Timeout in seconds, default 30"),
        trigger: z
          .enum(["apigw", "sqs", "s3", "eventbridge", "schedule", "none"])
          .optional()
          .describe("Event source trigger, default none"),
      }),
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ name, runtime, memoryMb, timeoutSeconds, trigger }) => {
      const fn: LambdaFn = {
        name,
        runtime,
        memoryMb: memoryMb ?? 512,
        timeoutSeconds: timeoutSeconds ?? 30,
        region: "us-east-1",
        triggers: trigger && trigger !== "none" ? [`${trigger}:${name}`] : [],
        invocations24h: 0,
        errors24h: 0,
        p99Ms: 0,
        costMonthUsd: 0,
        lastDeploy: new Date().toISOString(),
        status: "active",
      };
      lambdas.unshift(fn);
      return {
        content: [
          {
            type: "text",
            text: `Created Lambda ${name} (${runtime}, ${fn.memoryMb}MB, ${fn.timeoutSeconds}s timeout). Trigger: ${fn.triggers[0] ?? "none"}.`,
          },
        ],
        structuredContent: {
          view: "lambda-provision",
          lambda: fn,
          phases: [
            { name: "Validating IAM execution role", status: "complete", durationMs: 800 },
            { name: "Uploading function package", status: "complete", durationMs: 2200 },
            { name: "Creating function configuration", status: "complete", durationMs: 1400 },
            { name: trigger && trigger !== "none" ? `Wiring ${trigger} trigger` : "Skipping trigger wiring", status: "complete", durationMs: 1100 },
            { name: "Function active", status: "complete", durationMs: 0 },
          ],
        },
      };
    },
  );

  // ─── list-agents ───────────────────────────────────────────────────────
  registerAppTool(
    server,
    "list-agents",
    {
      title: "AgentCore deployments",
      description:
        "Lists all Bedrock AgentCore agent deployments with model, status, invocations, latency, error rate, and monthly cost.",
      inputSchema: {},
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: agentCores
            .map(
              (a) =>
                `${a.name} (${a.model}, ${a.status}) — ${a.invocations24h}/24h, p50 ${a.avgLatencyMs}ms, err ${a.errorRate}%, $${a.costMonthUsd}/mo`,
            )
            .join("\n"),
        },
      ],
      structuredContent: { view: "agents", agents: agentCores },
    }),
  );

  // ─── deploy-agentcore ──────────────────────────────────────────────────
  registerAppTool(
    server,
    "deploy-agentcore",
    {
      title: "Deploy Bedrock AgentCore agent",
      description:
        "Deploys a Bedrock AgentCore agent with the chosen model, optional guardrails, and knowledge bases.",
      inputSchema: z.object({
        name: z.string().describe("Agent name, e.g. support-triage"),
        model: z
          .enum([
            "anthropic.claude-sonnet-4-5",
            "anthropic.claude-opus-4-1",
            "anthropic.claude-haiku-4-5",
          ])
          .describe("Bedrock model id"),
        guardrails: z
          .array(z.string())
          .optional()
          .describe(
            "List of guardrail names to attach, e.g. ['pii-redaction', 'no-financial-advice']",
          ),
        knowledgeBases: z
          .array(z.string())
          .optional()
          .describe("Knowledge base ids the agent can query"),
      }),
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ name, model, guardrails, knowledgeBases }) => {
      const agent: AgentCoreDeployment = {
        id: name,
        name,
        model,
        status: "active",
        region: "us-east-1",
        invocations24h: 0,
        avgLatencyMs: 0,
        errorRate: 0,
        costMonthUsd: 0,
        guardrails: guardrails ?? [],
        knowledgeBases: knowledgeBases ?? [],
        lastDeploy: new Date().toISOString(),
      };
      agentCores.unshift(agent);
      return {
        content: [
          {
            type: "text",
            text: `Deployed AgentCore agent ${name} with ${model}. Guardrails: ${(guardrails ?? []).join(", ") || "none"}. KBs: ${(knowledgeBases ?? []).join(", ") || "none"}.`,
          },
        ],
        structuredContent: {
          view: "agent-provision",
          agent,
          phases: [
            { name: "Validating model access", status: "complete", durationMs: 1200 },
            { name: "Attaching guardrails", status: "complete", durationMs: 1600 },
            { name: "Linking knowledge bases", status: "complete", durationMs: 2200 },
            { name: "Creating action groups", status: "complete", durationMs: 1800 },
            { name: "Publishing alias", status: "complete", durationMs: 900 },
            { name: "Agent ready", status: "complete", durationMs: 0 },
          ],
        },
      };
    },
  );

  // ════════════════════════════════════════════════════════════════════════
  // DAY 2 — Operations (mostly data-only, the agent composes A2UI surfaces)
  // ════════════════════════════════════════════════════════════════════════

  // ─── cluster-status ────────────────────────────────────────────────────
  server.tool(
    "cluster-status",
    "Returns the current status of an EKS cluster — node groups, pod count, version, control-plane health.",
    {
      clusterId: z.string().describe("Cluster id, e.g. platformops-prod"),
    },
    async ({ clusterId }) => {
      const c = clusters.find((x) => x.id === clusterId);
      if (!c) {
        return {
          content: [{ type: "text", text: `Cluster not found: ${clusterId}` }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `${c.name}: ${c.status}, k8s ${c.version}, ${c.podsRunning} pods, ${c.nodeGroups.length} node groups, $${c.costMonthUsd}/mo`,
          },
        ],
        structuredContent: { view: "cluster-status", cluster: c },
      };
    },
  );

  // ─── scale-cluster ─────────────────────────────────────────────────────
  server.tool(
    "scale-cluster",
    "Scales a node group on an EKS cluster up or down. Returns the new desired count and a synthetic rollout plan.",
    {
      clusterId: z.string().describe("Cluster id"),
      nodeGroup: z
        .string()
        .describe("Node group name (e.g. 'general' or 'burst')"),
      desired: z
        .number()
        .int()
        .nonnegative()
        .describe("New desired node count"),
    },
    async ({ clusterId, nodeGroup, desired }) => {
      const c = clusters.find((x) => x.id === clusterId);
      if (!c) {
        return {
          content: [{ type: "text", text: `Cluster not found: ${clusterId}` }],
          isError: true,
        };
      }
      const ng = c.nodeGroups.find((g) => g.name === nodeGroup);
      if (!ng) {
        return {
          content: [
            { type: "text", text: `Node group not found: ${nodeGroup}` },
          ],
          isError: true,
        };
      }
      const before = ng.desired;
      ng.desired = Math.min(Math.max(desired, ng.min), ng.max);
      return {
        content: [
          {
            type: "text",
            text: `Scaling ${c.name}/${nodeGroup} from ${before} → ${ng.desired} nodes.`,
          },
        ],
        structuredContent: {
          view: "scale-result",
          clusterId,
          nodeGroup,
          before,
          after: ng.desired,
          drainOrder: "youngest-first",
          estimatedDurationSeconds: 60 + Math.abs(ng.desired - before) * 90,
        },
      };
    },
  );

  // ─── lambda-invocations ────────────────────────────────────────────────
  server.tool(
    "lambda-invocations",
    "Returns invocation, error, throttle, and latency metrics for a Lambda function over the last 24 hours.",
    {
      name: z.string().describe("Lambda function name"),
    },
    async ({ name }) => {
      const fn = lambdas.find((l) => l.name === name);
      if (!fn) {
        return {
          content: [{ type: "text", text: `Lambda not found: ${name}` }],
          isError: true,
        };
      }
      const errorRate = fn.invocations24h
        ? +((fn.errors24h / fn.invocations24h) * 100).toFixed(2)
        : 0;
      return {
        content: [
          {
            type: "text",
            text: `${name}: ${fn.invocations24h.toLocaleString()} invocations, ${fn.errors24h} errors (${errorRate}%), p99 ${fn.p99Ms}ms over 24h.`,
          },
        ],
        structuredContent: {
          view: "lambda-metrics",
          name,
          invocations24h: fn.invocations24h,
          errors24h: fn.errors24h,
          errorRate,
          p99Ms: fn.p99Ms,
          throttles24h: Math.floor(fn.invocations24h * 0.0008),
        },
      };
    },
  );

  // ─── lambda-logs ───────────────────────────────────────────────────────
  server.tool(
    "lambda-logs",
    "Returns recent CloudWatch log entries for a Lambda function.",
    {
      name: z.string().describe("Lambda function name"),
      limit: z
        .number()
        .int()
        .positive()
        .max(50)
        .optional()
        .describe("Max log entries to return, default 10"),
    },
    async ({ name, limit }) => {
      const fn = lambdas.find((l) => l.name === name);
      if (!fn) {
        return {
          content: [{ type: "text", text: `Lambda not found: ${name}` }],
          isError: true,
        };
      }
      const now = Date.now();
      const entries = Array.from({ length: limit ?? 10 }, (_, i) => {
        const isError = i < Math.min(fn.errors24h, 2);
        return {
          ts: new Date(now - i * 60_000).toISOString(),
          level: isError ? "ERROR" : "INFO",
          message: isError
            ? `Handler threw: TimeoutError after ${fn.timeoutSeconds}s`
            : `Invocation completed in ${Math.floor(fn.p99Ms * Math.random())}ms`,
          requestId: Math.random().toString(36).slice(2, 12),
        };
      });
      return {
        content: [
          {
            type: "text",
            text: entries
              .map((e) => `[${e.ts}] ${e.level} ${e.message} (${e.requestId})`)
              .join("\n"),
          },
        ],
        structuredContent: { view: "lambda-logs", name, entries },
      };
    },
  );

  // ─── agent-traces ──────────────────────────────────────────────────────
  server.tool(
    "agent-traces",
    "Returns recent invocation traces for an AgentCore agent: prompts, tool calls, total latency, token usage.",
    {
      agentId: z.string().describe("Agent id, e.g. support-triage"),
      limit: z
        .number()
        .int()
        .positive()
        .max(20)
        .optional()
        .describe("Max traces to return, default 5"),
    },
    async ({ agentId, limit }) => {
      const a = agentCores.find((x) => x.id === agentId);
      if (!a) {
        return {
          content: [{ type: "text", text: `Agent not found: ${agentId}` }],
          isError: true,
        };
      }
      const now = Date.now();
      const traces = Array.from({ length: limit ?? 5 }, (_, i) => ({
        traceId: Math.random().toString(36).slice(2, 12),
        ts: new Date(now - i * 5 * 60_000).toISOString(),
        prompt:
          i % 2 === 0
            ? "Why is my order not arriving on time?"
            : "Cancel order #4731 and refund the customer",
        toolsCalled:
          i % 2 === 0
            ? ["lookup-order", "estimate-delivery"]
            : ["lookup-order", "issue-refund", "send-notification"],
        latencyMs: a.avgLatencyMs + Math.floor((Math.random() - 0.5) * 800),
        tokensIn: 1800 + Math.floor(Math.random() * 600),
        tokensOut: 320 + Math.floor(Math.random() * 200),
        status: i === 0 && Math.random() > 0.9 ? "error" : "success",
      }));
      return {
        content: [
          {
            type: "text",
            text: traces
              .map(
                (t) =>
                  `${t.ts} [${t.status}] "${t.prompt}" — tools: ${t.toolsCalled.join(", ")}, ${t.latencyMs}ms`,
              )
              .join("\n"),
          },
        ],
        structuredContent: { view: "agent-traces", agentId, traces },
      };
    },
  );

  // ─── rollback-deployment ───────────────────────────────────────────────
  server.tool(
    "rollback-deployment",
    "Rolls back the most recent deployment of a service to the previous version.",
    {
      serviceId: z.string().describe("Service id to roll back"),
    },
    async ({ serviceId }) => {
      const s = services.find((x) => x.id === serviceId);
      if (!s) {
        return {
          content: [{ type: "text", text: `Service not found: ${serviceId}` }],
          isError: true,
        };
      }
      const previous = deployments.find(
        (d) => d.serviceId === serviceId && d.status === "success",
      );
      const rollback = {
        id: `rollback-${Date.now()}`,
        serviceId,
        serviceName: s.name,
        from: deployments[0]?.commitSha ?? "unknown",
        to: previous?.commitSha ?? "previous",
        status: "success" as const,
        timestamp: new Date().toISOString(),
        durationMs: 22000,
      };
      return {
        content: [
          {
            type: "text",
            text: `Rolled back ${s.name} from ${rollback.from} to ${rollback.to}.`,
          },
        ],
        structuredContent: { view: "rollback", rollback },
      };
    },
  );

  // ─── cost-breakdown ────────────────────────────────────────────────────
  server.tool(
    "cost-breakdown",
    "Returns the current monthly cost breakdown across services, EKS clusters, Lambda functions, and AgentCore agents.",
    {
      groupBy: z
        .enum(["resource-type", "team"])
        .optional()
        .describe("How to group costs. Default 'resource-type'."),
    },
    async ({ groupBy }) => {
      const clusterTotal = clusters.reduce((s, c) => s + c.costMonthUsd, 0);
      const lambdaTotal = lambdas.reduce((s, l) => s + l.costMonthUsd, 0);
      const agentTotal = agentCores.reduce((s, a) => s + a.costMonthUsd, 0);
      const serviceTotal = services.reduce(
        (sum, s) => sum + s.replicas * 60,
        0,
      );
      const total = clusterTotal + lambdaTotal + agentTotal + serviceTotal;

      if (groupBy === "team") {
        const byTeam: Record<string, number> = {};
        for (const s of services) {
          byTeam[s.team] = (byTeam[s.team] ?? 0) + s.replicas * 60;
        }
        return {
          content: [
            {
              type: "text",
              text: `Total: $${total.toFixed(0)}/mo. ${Object.entries(byTeam)
                .map(([t, v]) => `${t} $${v.toFixed(0)}`)
                .join(", ")}`,
            },
          ],
          structuredContent: {
            view: "cost-by-team",
            total,
            breakdown: byTeam,
          },
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Total: $${total.toFixed(0)}/mo. EKS $${clusterTotal}, Lambda $${lambdaTotal.toFixed(0)}, AgentCore $${agentTotal}, Services $${serviceTotal}.`,
          },
        ],
        structuredContent: {
          view: "cost-by-resource-type",
          total,
          breakdown: {
            "EKS clusters": clusterTotal,
            "Lambda functions": +lambdaTotal.toFixed(2),
            "AgentCore agents": agentTotal,
            "Container services": serviceTotal,
          },
        },
      };
    },
  );

  // ─── UI resource ───────────────────────────────────────────────────────
  registerAppResource(
    server,
    "platform-catalog-ui",
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => {
      const distDir = getDistDir();
      const html = await fs.readFile(path.join(distDir, "mcp-app.html"), "utf-8");
      return {
        contents: [
          {
            uri: RESOURCE_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: html,
          },
        ],
      };
    },
  );

  return server;
}
