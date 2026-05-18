"use client";

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

/**
 * Data-only frontend tools.
 *
 * These bridge the gap left by the disabled `BuiltInAgent.mcpServers`
 * connection (see route.ts) — plain `server.tool` MCP registrations are
 * currently invisible to the LLM. Rather than ship demo prompts that
 * silently hallucinate ("I don't have that tool, let me fake it"), we
 * expose the data the demo actually needs as `useFrontendTool`s with
 * realistic mocked payloads. The agent uses them like any other tool: it
 * fetches the data, then composes an A2UI surface with the result.
 *
 * The mocked data is intentionally consistent with the per-resource
 * governance values in Dashboard.tsx `governanceFor()` so a stage walk
 * through any one service produces a coherent story (e.g. notification-
 * service is the one with the burning SLO across every screen).
 */
export function DataTools() {
  useCostBreakdownTool();
  useServiceMetricsTool();
  useListDeploymentsTool();
  useGetRunbookTool();
  useGetOncallTool();
  return null;
}

// ─── cost-breakdown ────────────────────────────────────────────────────────

function useCostBreakdownTool() {
  useFrontendTool(costBreakdownTool);
}

const costBreakdownTool = {
  name: "cost-breakdown",
  description:
    "Returns the current monthly cost breakdown across the platform. Use this whenever the user asks about cost, spend, or where the money is going. Pass groupBy='team' to get per-team cost, or omit for the per-resource-type default.",
  parameters: z.object({
    groupBy: z
      .enum(["resource-type", "team"])
      .optional()
      .describe(
        "How to group costs. Default 'resource-type' (EKS / Lambda / AgentCore / Services).",
      ),
  }),
  handler: async ({ groupBy }: { groupBy?: "resource-type" | "team" }) => {
    if (groupBy === "team") {
      return {
        currency: "USD",
        period: "current month",
        total: 15350,
        groupBy: "team",
        items: [
          { label: "Platform Engineering", value: 8420 },
          { label: "Payments Platform", value: 1820 },
          { label: "Customer Insights", value: 1620 },
          { label: "Identity Platform", value: 1140 },
          { label: "ML Platform", value: 920 },
          { label: "Comms Platform", value: 640 },
          { label: "Data Platform", value: 580 },
          { label: "Integrations", value: 210 },
        ],
      };
    }
    return {
      currency: "USD",
      period: "current month",
      total: 14160,
      groupBy: "resource-type",
      items: [
        { label: "EKS Clusters", value: 8420 },
        { label: "Services (compute)", value: 3640 },
        { label: "Lambda Functions", value: 1180 },
        { label: "AgentCore Agents", value: 920 },
      ],
    };
  },
};

// ─── service-metrics ───────────────────────────────────────────────────────

const SERVICE_METRICS: Record<
  string,
  {
    sloTargetPct: number;
    sloCurrentPct: number;
    sloWindow: string;
    p99Ms: number;
    errors24h: number;
    requests24h: number;
    errorRatePct: number;
    trafficRpm: number;
    activeAlerts: number;
    dependencies: { id: string; status: "healthy" | "degraded" | "down" }[];
  }
> = {
  "payment-api": {
    sloTargetPct: 99.9,
    sloCurrentPct: 99.94,
    sloWindow: "30d rolling",
    p99Ms: 188,
    errors24h: 12,
    requests24h: 1_200_000,
    errorRatePct: 0.001,
    trafficRpm: 14_300,
    activeAlerts: 0,
    dependencies: [
      { id: "stripe-api", status: "healthy" },
      { id: "user-service", status: "healthy" },
      { id: "postgres-payments", status: "healthy" },
    ],
  },
  "user-service": {
    sloTargetPct: 99.9,
    sloCurrentPct: 99.91,
    sloWindow: "30d rolling",
    p99Ms: 142,
    errors24h: 87,
    requests24h: 980_000,
    errorRatePct: 0.009,
    trafficRpm: 11_400,
    activeAlerts: 0,
    dependencies: [
      { id: "auth0", status: "healthy" },
      { id: "postgres-users", status: "healthy" },
    ],
  },
  "notification-service": {
    sloTargetPct: 99.9,
    sloCurrentPct: 99.87,
    sloWindow: "30d rolling",
    p99Ms: 612,
    errors24h: 1240,
    requests24h: 540_000,
    errorRatePct: 0.23,
    trafficRpm: 6_100,
    activeAlerts: 2,
    dependencies: [
      { id: "twilio", status: "degraded" },
      { id: "ses", status: "healthy" },
      { id: "redis-fanout", status: "healthy" },
    ],
  },
  "data-pipeline": {
    sloTargetPct: 99.5,
    sloCurrentPct: 99.62,
    sloWindow: "30d rolling",
    p99Ms: 4200,
    errors24h: 3,
    requests24h: 18_000,
    errorRatePct: 0.017,
    trafficRpm: 210,
    activeAlerts: 0,
    dependencies: [
      { id: "s3-events", status: "healthy" },
      { id: "snowflake", status: "healthy" },
    ],
  },
};

function useServiceMetricsTool() {
  useFrontendTool(serviceMetricsTool);
}

const serviceMetricsTool = {
  name: "service-metrics",
  description:
    "Returns current SLO + traffic + error + latency metrics for a single platform service. Use this when the user asks about service health, SLO status, or deploy readiness.",
  parameters: z.object({
    serviceId: z
      .string()
      .describe(
        "The service id, e.g. 'payment-api', 'user-service', 'notification-service'.",
      ),
  }),
  handler: async ({ serviceId }: { serviceId: string }) => {
    const found = SERVICE_METRICS[serviceId];
    if (!found) {
      return {
        serviceId,
        notFound: true,
        message: `No metrics on file for ${serviceId}. Known: ${Object.keys(SERVICE_METRICS).join(", ")}.`,
      };
    }
    return {
      serviceId,
      ...found,
      headroomPct: +(found.sloCurrentPct - found.sloTargetPct).toFixed(3),
      sloOk: found.sloCurrentPct >= found.sloTargetPct,
    };
  },
};

// ─── list-deployments ──────────────────────────────────────────────────────

function useListDeploymentsTool() {
  useFrontendTool(listDeploymentsTool);
}

const listDeploymentsTool = {
  name: "list-deployments",
  description:
    "Returns recent deployments across the platform. Optionally filter by serviceId or environment. Use this for deploy-readiness, rollback decisions, deploy history dashboards, and audit queries.",
  parameters: z.object({
    serviceId: z
      .string()
      .optional()
      .describe("Filter to a single service, e.g. 'payment-api'."),
    environment: z
      .enum(["staging", "production"])
      .optional()
      .describe("Filter by environment."),
    limit: z.number().optional().describe("Max number of records, default 10."),
  }),
  handler: async ({
    serviceId,
    environment,
    limit,
  }: {
    serviceId?: string;
    environment?: "staging" | "production";
    limit?: number;
  }) => {
    const all = ALL_DEPLOYMENTS.filter((d) => {
      if (serviceId && d.serviceId !== serviceId) return false;
      if (environment && d.environment !== environment) return false;
      return true;
    });
    return {
      count: all.length,
      deployments: all.slice(0, limit ?? 10),
    };
  },
};

interface DeploymentRecord {
  id: string;
  serviceId: string;
  environment: "staging" | "production";
  initiatedBy: string;
  team: string;
  commitSha: string;
  durationMs: number;
  status: "success" | "rolled-back";
  timestamp: string;
  auditEventId: string;
  policyChecksPassed: boolean;
}

const ALL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: "deploy-9201",
    serviceId: "payment-api",
    environment: "staging",
    initiatedBy: "engin.diri@",
    team: "Payments Platform",
    commitSha: "a4f1e29",
    durationMs: 84_000,
    status: "success",
    timestamp: hoursAgo(2),
    auditEventId: "evt_01HQXZ4F",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9198",
    serviceId: "payment-api",
    environment: "production",
    initiatedBy: "sam.lin@",
    team: "Payments Platform",
    commitSha: "9d2b71c",
    durationMs: 112_000,
    status: "success",
    timestamp: hoursAgo(27),
    auditEventId: "evt_01HQXY7K",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9189",
    serviceId: "user-service",
    environment: "production",
    initiatedBy: "alex.park@",
    team: "Identity Platform",
    commitSha: "f70a2d8",
    durationMs: 96_000,
    status: "success",
    timestamp: hoursAgo(8),
    auditEventId: "evt_01HQXY1B",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9186",
    serviceId: "notification-service",
    environment: "production",
    initiatedBy: "riley.cohen@",
    team: "Comms Platform",
    commitSha: "31b4e0a",
    durationMs: 71_000,
    status: "rolled-back",
    timestamp: hoursAgo(14),
    auditEventId: "evt_01HQXT9D",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9180",
    serviceId: "data-pipeline",
    environment: "production",
    initiatedBy: "morgan.lee@",
    team: "Data Platform",
    commitSha: "c8e91f3",
    durationMs: 142_000,
    status: "success",
    timestamp: hoursAgo(20),
    auditEventId: "evt_01HQXR4F",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9176",
    serviceId: "webhook-fanout",
    environment: "production",
    initiatedBy: "taylor.singh@",
    team: "Integrations",
    commitSha: "6f0c812",
    durationMs: 38_000,
    status: "success",
    timestamp: hoursAgo(34),
    auditEventId: "evt_01HQXM2A",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9174",
    serviceId: "payment-api",
    environment: "production",
    initiatedBy: "priya.rao@",
    team: "Payments Platform",
    commitSha: "2d7a019",
    durationMs: 102_000,
    status: "success",
    timestamp: hoursAgo(72),
    auditEventId: "evt_01HQXJ7P",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9170",
    serviceId: "user-service",
    environment: "staging",
    initiatedBy: "jordan.wu@",
    team: "Identity Platform",
    commitSha: "b91c044",
    durationMs: 79_000,
    status: "success",
    timestamp: hoursAgo(48),
    auditEventId: "evt_01HQXH8M",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9165",
    serviceId: "notification-service",
    environment: "staging",
    initiatedBy: "devon.james@",
    team: "Comms Platform",
    commitSha: "5a3e711",
    durationMs: 66_000,
    status: "success",
    timestamp: hoursAgo(56),
    auditEventId: "evt_01HQXG2Q",
    policyChecksPassed: true,
  },
  {
    id: "deploy-9160",
    serviceId: "payment-api",
    environment: "staging",
    initiatedBy: "engin.diri@",
    team: "Payments Platform",
    commitSha: "08bf24e",
    durationMs: 88_000,
    status: "success",
    timestamp: hoursAgo(96),
    auditEventId: "evt_01HQXD5N",
    policyChecksPassed: true,
  },
];

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

// ─── get-runbook ───────────────────────────────────────────────────────────

const RUNBOOKS: Record<
  string,
  {
    serviceId: string;
    symptoms: string[];
    firstFiveMinutes: string[];
    escalation: string[];
    knownPlaybooks: { name: string; url: string }[];
  }
> = {
  "payment-api": {
    serviceId: "payment-api",
    symptoms: [
      "Elevated 5xx on /payments/charge",
      "Latency > 1s for /payments/* endpoints",
      "3DS callback timeouts > 5%",
      "Stripe webhook backlog growing",
    ],
    firstFiveMinutes: [
      "Page primary on-call (Payments Platform)",
      "Check Stripe status page at status.stripe.com",
      "Verify postgres-payments pool utilisation in Grafana",
      "Roll back to last green sha if introduced in last 30 min",
      "Open incident channel #inc-payments and link Stripe dashboard",
    ],
    escalation: [
      "Tier 1: primary on-call (Payments Platform)",
      "Tier 2: payments-platform-leads@",
      "Tier 3: CTO + Finance (revenue-impacting only)",
    ],
    knownPlaybooks: [
      { name: "Stripe outage", url: "runbooks/payments/stripe-outage.md" },
      { name: "DB connection storm", url: "runbooks/payments/db-storm.md" },
    ],
  },
  "user-service": {
    serviceId: "user-service",
    symptoms: [
      "Auth0 rate-limit responses",
      "Login latency > 800ms",
      "Token refresh failures",
    ],
    firstFiveMinutes: [
      "Page primary on-call (Identity Platform)",
      "Check Auth0 status page",
      "Verify session redis cluster health",
      "Roll back if introduced in last 30 min",
    ],
    escalation: [
      "Tier 1: primary on-call (Identity Platform)",
      "Tier 2: identity-platform-leads@",
      "Tier 3: Security + CTO",
    ],
    knownPlaybooks: [
      { name: "Auth0 outage", url: "runbooks/identity/auth0-outage.md" },
    ],
  },
  "notification-service": {
    serviceId: "notification-service",
    symptoms: [
      "Twilio SMS delivery failures",
      "Email bounce rate spike",
      "Fanout queue depth > 10k",
    ],
    firstFiveMinutes: [
      "Page primary on-call (Comms Platform)",
      "Check Twilio + SES status pages",
      "Drain fanout queue manually if backlog persistent",
      "Disable non-critical notification channels",
    ],
    escalation: [
      "Tier 1: primary on-call (Comms Platform)",
      "Tier 2: comms-platform-leads@",
      "Tier 3: Marketing + Customer Success",
    ],
    knownPlaybooks: [
      { name: "Twilio outage", url: "runbooks/comms/twilio-outage.md" },
      { name: "Queue backlog", url: "runbooks/comms/queue-backlog.md" },
    ],
  },
};

function useGetRunbookTool() {
  useFrontendTool(getRunbookTool);
}

const getRunbookTool = {
  name: "get-runbook",
  description:
    "Returns the operational runbook for a service: symptoms to watch for, first-5-minutes actions, escalation tiers, and known playbook links. Use this when the user asks for a runbook, incident response steps, or 'what do I do at 3am for X'.",
  parameters: z.object({
    serviceId: z
      .string()
      .describe(
        "The service id, e.g. 'payment-api', 'user-service', 'notification-service'.",
      ),
  }),
  handler: async ({ serviceId }: { serviceId: string }) => {
    const rb = RUNBOOKS[serviceId];
    if (!rb) {
      return {
        serviceId,
        notFound: true,
        message: `No runbook on file for ${serviceId}. Known: ${Object.keys(RUNBOOKS).join(", ")}.`,
      };
    }
    return rb;
  },
};

// ─── get-oncall ────────────────────────────────────────────────────────────

const ONCALL_BY_TEAM: Record<
  string,
  {
    team: string;
    primary: { name: string; handle: string; pager: string };
    secondary: { name: string; handle: string; pager: string };
    rotationStarted: string;
    rotationEnds: string;
    escalationPolicy: string;
  }
> = {
  "Platform Engineering": {
    team: "Platform Engineering",
    primary: {
      name: "Engin Diri",
      handle: "engin.diri@",
      pager: "+1-415-555-0142",
    },
    secondary: {
      name: "Maya Chen",
      handle: "maya.chen@",
      pager: "+1-415-555-0173",
    },
    rotationStarted: daysAgo(2),
    rotationEnds: daysAhead(5),
    escalationPolicy: "platform-engineering-tier1",
  },
  "Payments Platform": {
    team: "Payments Platform",
    primary: { name: "Sam Lin", handle: "sam.lin@", pager: "+1-415-555-0181" },
    secondary: {
      name: "Priya Rao",
      handle: "priya.rao@",
      pager: "+1-415-555-0194",
    },
    rotationStarted: daysAgo(4),
    rotationEnds: daysAhead(3),
    escalationPolicy: "payments-platform-tier1",
  },
  "Identity Platform": {
    team: "Identity Platform",
    primary: {
      name: "Alex Park",
      handle: "alex.park@",
      pager: "+1-415-555-0203",
    },
    secondary: {
      name: "Jordan Wu",
      handle: "jordan.wu@",
      pager: "+1-415-555-0216",
    },
    rotationStarted: daysAgo(1),
    rotationEnds: daysAhead(6),
    escalationPolicy: "identity-platform-tier1",
  },
  "Comms Platform": {
    team: "Comms Platform",
    primary: {
      name: "Riley Cohen",
      handle: "riley.cohen@",
      pager: "+1-415-555-0224",
    },
    secondary: {
      name: "Devon James",
      handle: "devon.james@",
      pager: "+1-415-555-0237",
    },
    rotationStarted: daysAgo(3),
    rotationEnds: daysAhead(4),
    escalationPolicy: "comms-platform-tier1",
  },
  Integrations: {
    team: "Integrations",
    primary: {
      name: "Taylor Singh",
      handle: "taylor.singh@",
      pager: "+1-415-555-0245",
    },
    secondary: {
      name: "Casey Reed",
      handle: "casey.reed@",
      pager: "+1-415-555-0258",
    },
    rotationStarted: daysAgo(0),
    rotationEnds: daysAhead(7),
    escalationPolicy: "integrations-tier1",
  },
};

function useGetOncallTool() {
  useFrontendTool(getOncallTool);
}

const getOncallTool = {
  name: "get-oncall",
  description:
    "Returns the current on-call rotation. Pass team to scope to one team; omit team to get the full platform rotation across all teams. Use this for incident-response coordination and deploy-readiness ('do we have on-call coverage if this breaks?').",
  parameters: z.object({
    team: z
      .string()
      .optional()
      .describe(
        "Team name, e.g. 'Payments Platform', 'Identity Platform'. Omit to list all teams.",
      ),
  }),
  handler: async ({ team }: { team?: string }) => {
    if (team) {
      const found = ONCALL_BY_TEAM[team];
      if (!found) {
        return {
          team,
          notFound: true,
          message: `No on-call rotation on file for team '${team}'. Known teams: ${Object.keys(ONCALL_BY_TEAM).join(", ")}.`,
        };
      }
      return found;
    }
    return {
      teams: Object.values(ONCALL_BY_TEAM),
    };
  },
};

export const DATA_FRONTEND_TOOLS = [
  costBreakdownTool,
  serviceMetricsTool,
  listDeploymentsTool,
  getRunbookTool,
  getOncallTool,
] as any;

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString();
}
function daysAhead(d: number): string {
  return new Date(Date.now() + d * 86_400_000).toISOString();
}
