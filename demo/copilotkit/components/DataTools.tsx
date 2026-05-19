"use client";

import { useFrontendTool, ToolCallStatus } from "@copilotkit/react-core/v2";
import { z } from "zod";
import type { ComponentType } from "react";

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
  useListAuditEventsTool();
  usePolicyStatusTool();
  return null;
}

// ─── Shared chat breadcrumb for data-tool calls ──────────────────────────
//
// Each frontend data tool gets a `render` prop that drops one of these into
// the chat sidebar so the audience SEES the agent calling external APIs
// (mocked or not). Three states: in-progress (args still streaming),
// executing (handler running), complete (with a one-line summary of the
// result).

type ResultSummary = (result: unknown, args: Record<string, unknown>) => string;

function makeDataToolRender(opts: {
  /** Human display name shown on the chip, e.g. "service-metrics". */
  label: string;
  /** Short single-emoji or unicode glyph used as the chip icon. */
  glyph: string;
  /** Render a 1-line summary of args, e.g. "(payment-api)". Returns "" if none. */
  argsSummary: (args: Record<string, unknown>) => string;
  /** Render a 1-line summary of the result, e.g. "→ 10 events". */
  resultSummary: ResultSummary;
}): ComponentType<any> {
  // The CopilotKit `render` prop is typed as a discriminated union over
  // ToolCallStatus values; using ComponentType<any> here keeps the factory
  // ergonomic without re-implementing the union three times. The runtime
  // shape is { name, args, status, result?, ... } regardless of status.
  function DataToolBreadcrumb({
    args,
    status,
    result,
  }: {
    name: string;
    args: Partial<Record<string, unknown>>;
    status: ToolCallStatus;
    result?: unknown;
  }) {
    const argsText = opts.argsSummary(args as Record<string, unknown>);
    const isExecuting =
      status === ToolCallStatus.Executing ||
      status === ToolCallStatus.InProgress;
    const tone = isExecuting
      ? "border-nord-frost2/40 text-nord-frost2"
      : "border-nord-ok/40 text-nord-ok";
    const dot = isExecuting ? "animate-pulse" : "";
    const summary =
      status === ToolCallStatus.Complete
        ? opts.resultSummary(parseToolResult(result), args as Record<string, unknown>)
        : "";

    return (
      <div
        className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border bg-nord-1/60 my-1 ${tone}`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80 ${dot}`}
        />
        <span className="opacity-60">{opts.glyph}</span>
        <span>{opts.label}</span>
        {argsText && <span className="opacity-60 normal-case">{argsText}</span>}
        {summary && (
          <span className="opacity-80 normal-case font-medium">{summary}</span>
        )}
      </div>
    );
  }
  return DataToolBreadcrumb;
}

/**
 * Frontend tool results round-trip through the agent runtime as JSON
 * strings. Parse opportunistically so the summary functions can read
 * structured fields.
 */
function parseToolResult(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

// ─── cost-breakdown ────────────────────────────────────────────────────────

function useCostBreakdownTool() {
  useFrontendTool(costBreakdownTool);
}

const costBreakdownTool = {
  name: "cost-breakdown",
  description:
    "Returns the current monthly cost breakdown across the platform. Use this whenever the user asks about cost, spend, or where the money is going. Pass groupBy='team' to get per-team cost, or omit for the per-resource-type default.",
  render: makeDataToolRender({
    label: "cost-breakdown",
    glyph: "$",
    argsSummary: (args) =>
      args.groupBy ? `(groupBy=${args.groupBy})` : "(resource-type)",
    resultSummary: (result) => {
      const r = result as { items?: unknown[]; total?: number; currency?: string };
      const items = Array.isArray(r.items) ? r.items.length : 0;
      const total = typeof r.total === "number" ? r.total : 0;
      return `→ ${items} buckets, $${total.toLocaleString()}/mo`;
    },
  }),
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
  render: makeDataToolRender({
    label: "service-metrics",
    glyph: "📊",
    argsSummary: (args) => (args.serviceId ? `(${args.serviceId})` : ""),
    resultSummary: (result) => {
      const r = result as {
        sloCurrentPct?: number;
        sloTargetPct?: number;
        errors24h?: number;
        activeAlerts?: number;
        notFound?: boolean;
      };
      if (r.notFound) return "→ not found";
      const slo =
        typeof r.sloCurrentPct === "number" && typeof r.sloTargetPct === "number"
          ? `SLO ${r.sloCurrentPct}% / ${r.sloTargetPct}%`
          : "";
      const alerts =
        typeof r.activeAlerts === "number" && r.activeAlerts > 0
          ? `, ${r.activeAlerts} active alerts`
          : "";
      return `→ ${slo}${alerts}`;
    },
  }),
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
  render: makeDataToolRender({
    label: "list-deployments",
    glyph: "🚀",
    argsSummary: (args) => {
      const parts: string[] = [];
      if (args.serviceId) parts.push(String(args.serviceId));
      if (args.environment) parts.push(String(args.environment));
      if (args.limit) parts.push(`limit=${args.limit}`);
      return parts.length ? `(${parts.join(", ")})` : "";
    },
    resultSummary: (result) => {
      const r = result as { count?: number; deployments?: unknown[] };
      const n = Array.isArray(r.deployments) ? r.deployments.length : (r.count ?? 0);
      return `→ ${n} deployment${n === 1 ? "" : "s"}`;
    },
  }),
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
  render: makeDataToolRender({
    label: "get-runbook",
    glyph: "📖",
    argsSummary: (args) => (args.serviceId ? `(${args.serviceId})` : ""),
    resultSummary: (result) => {
      const r = result as {
        notFound?: boolean;
        symptoms?: unknown[];
        firstFiveMinutes?: unknown[];
      };
      if (r.notFound) return "→ no runbook on file";
      const s = Array.isArray(r.symptoms) ? r.symptoms.length : 0;
      const f = Array.isArray(r.firstFiveMinutes) ? r.firstFiveMinutes.length : 0;
      return `→ ${s} symptoms, ${f} first-5-min steps`;
    },
  }),
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
  render: makeDataToolRender({
    label: "get-oncall",
    glyph: "📟",
    argsSummary: (args) => (args.team ? `(${args.team})` : "(all teams)"),
    resultSummary: (result) => {
      const r = result as {
        team?: string;
        notFound?: boolean;
        teams?: unknown[];
        primary?: { name?: string };
      };
      if (r.notFound) return "→ no rotation on file";
      if (Array.isArray(r.teams)) return `→ ${r.teams.length} teams covered`;
      if (r.primary?.name) return `→ ${r.primary.name} primary`;
      return "→ ok";
    },
  }),
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

// ─── list-audit-events ─────────────────────────────────────────────────────

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  team: string;
  action:
    | "deploy"
    | "rollback"
    | "scale"
    | "provision"
    | "policy-scan"
    | "incident-page";
  resource: string;
  resourceType: "service" | "cluster" | "lambda" | "agent";
  environment?: "staging" | "production";
  outcome: "success" | "failed" | "rolled-back";
  policyChecksPassed: boolean;
  details?: string;
}

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "evt_01HQXZ4F",
    timestamp: hoursAgo(2),
    actor: "engin.diri@",
    team: "Payments Platform",
    action: "deploy",
    resource: "payment-api",
    resourceType: "service",
    environment: "staging",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit a4f1e29, duration 84s",
  },
  {
    id: "evt_01HQXY7K",
    timestamp: hoursAgo(27),
    actor: "sam.lin@",
    team: "Payments Platform",
    action: "deploy",
    resource: "payment-api",
    resourceType: "service",
    environment: "production",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit 9d2b71c",
  },
  {
    id: "evt_01HQXY1B",
    timestamp: hoursAgo(8),
    actor: "alex.park@",
    team: "Identity Platform",
    action: "deploy",
    resource: "user-service",
    resourceType: "service",
    environment: "production",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit f70a2d8",
  },
  {
    id: "evt_01HQXT9D",
    timestamp: hoursAgo(14),
    actor: "riley.cohen@",
    team: "Comms Platform",
    action: "rollback",
    resource: "notification-service",
    resourceType: "service",
    environment: "production",
    outcome: "rolled-back",
    policyChecksPassed: true,
    details: "elevated 5xx — rolled back to commit 0a4e22b",
  },
  {
    id: "evt_01HQXR4F",
    timestamp: hoursAgo(20),
    actor: "morgan.lee@",
    team: "Data Platform",
    action: "deploy",
    resource: "data-pipeline",
    resourceType: "service",
    environment: "production",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit c8e91f3",
  },
  {
    id: "evt_01HQXR0C",
    timestamp: hoursAgo(31),
    actor: "engin.diri@",
    team: "Platform Engineering",
    action: "scale",
    resource: "platformops-prod",
    resourceType: "cluster",
    outcome: "success",
    policyChecksPassed: true,
    details: "general node group 8 → 12 nodes",
  },
  {
    id: "evt_01HQXM2A",
    timestamp: hoursAgo(34),
    actor: "taylor.singh@",
    team: "Integrations",
    action: "deploy",
    resource: "webhook-fanout",
    resourceType: "lambda",
    environment: "production",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit 6f0c812",
  },
  {
    id: "evt_01HQXJ9N",
    timestamp: hoursAgo(40),
    actor: "platform-bot@",
    team: "Platform Engineering",
    action: "policy-scan",
    resource: "user-service",
    resourceType: "service",
    outcome: "failed",
    policyChecksPassed: false,
    details: "IAM least-privilege finding: payments:write granted but unused 30d",
  },
  {
    id: "evt_01HQXJ7P",
    timestamp: hoursAgo(72),
    actor: "priya.rao@",
    team: "Payments Platform",
    action: "deploy",
    resource: "payment-api",
    resourceType: "service",
    environment: "production",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit 2d7a019",
  },
  {
    id: "evt_01HQXH8M",
    timestamp: hoursAgo(48),
    actor: "jordan.wu@",
    team: "Identity Platform",
    action: "deploy",
    resource: "user-service",
    resourceType: "service",
    environment: "staging",
    outcome: "success",
    policyChecksPassed: true,
    details: "commit b91c044",
  },
];

// Hoisted to module scope. Inline tool registrations in the hook body would
// create a new tool object on every Dashboard render, which (a) trips
// CopilotKit's "frontendTools must be a stable array" warning and
// (b) loses in-flight tool calls → AI_MissingToolResultsError. Stable
// reference means stable registration.
const listAuditEventsTool = {
  name: "list-audit-events",
  description:
    "Returns recent audit events across the platform: deploys, rollbacks, scale operations, provisioning, policy scans, on-call pages. Each event has actor, team, action type, resource, outcome, policy-check status, and optional details. Use this for audit log questions, governance dashboards, and accountability queries.",
  render: makeDataToolRender({
    label: "list-audit-events",
    glyph: "📜",
    argsSummary: (args) => {
      const parts: string[] = [];
      if (args.resource) parts.push(String(args.resource));
      if (args.action) parts.push(String(args.action));
      if (args.team) parts.push(String(args.team));
      return parts.length ? `(${parts.join(", ")})` : "";
    },
    resultSummary: (result) => {
      const r = result as { count?: number; events?: unknown[] };
      const n = Array.isArray(r.events) ? r.events.length : (r.count ?? 0);
      return `→ ${n} event${n === 1 ? "" : "s"}`;
    },
  }),
  parameters: z.object({
    resource: z
      .string()
      .optional()
      .describe(
        "Filter to events affecting a specific resource id (service, cluster, lambda, or agent).",
      ),
    action: z
      .enum([
        "deploy",
        "rollback",
        "scale",
        "provision",
        "policy-scan",
        "incident-page",
      ])
      .optional()
      .describe("Filter by action type."),
    team: z
      .string()
      .optional()
      .describe("Filter to events initiated by members of one team."),
    limit: z
      .number()
      .optional()
      .describe("Max number of records, default 10."),
  }),
  handler: async ({
    resource,
    action,
    team,
    limit,
  }: {
    resource?: string;
    action?:
      | "deploy"
      | "rollback"
      | "scale"
      | "provision"
      | "policy-scan"
      | "incident-page";
    team?: string;
    limit?: number;
  }) => {
    const filtered = AUDIT_EVENTS.filter((e) => {
      if (resource && e.resource !== resource) return false;
      if (action && e.action !== action) return false;
      if (team && e.team !== team) return false;
      return true;
    });
    return {
      count: filtered.length,
      events: filtered.slice(0, limit ?? 10),
    };
  },
};

function useListAuditEventsTool() {
  useFrontendTool(listAuditEventsTool);
}

// ─── policy-status ─────────────────────────────────────────────────────────

interface PolicyCheck {
  name: "iam" | "network" | "encryption-at-rest" | "sbom-scan";
  status: "pass" | "fail" | "warn";
  finding?: string;
  lastEvaluated: string;
}

interface PolicyPosture {
  resource: string;
  resourceType: "service" | "cluster" | "lambda" | "agent";
  team: string;
  overall: "pass" | "fail" | "warn";
  checks: PolicyCheck[];
}

const POLICY_POSTURE: PolicyPosture[] = [
  {
    resource: "payment-api",
    resourceType: "service",
    team: "Payments Platform",
    overall: "pass",
    checks: [
      { name: "iam", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(12) },
    ],
  },
  {
    resource: "user-service",
    resourceType: "service",
    team: "Identity Platform",
    overall: "fail",
    checks: [
      {
        name: "iam",
        status: "fail",
        finding:
          "Role 'user-service-task' has 'payments:write' but the policy has not been exercised in 30+ days. Recommend removal under least-privilege.",
        lastEvaluated: hoursAgo(40),
      },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(18) },
    ],
  },
  {
    resource: "notification-service",
    resourceType: "service",
    team: "Comms Platform",
    overall: "warn",
    checks: [
      { name: "iam", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      {
        name: "sbom-scan",
        status: "warn",
        finding:
          "Transitive dependency 'libxml2@2.9.10' has a moderate-severity CVE (CVE-2024-25062). Upgrade path available.",
        lastEvaluated: hoursAgo(8),
      },
    ],
  },
  {
    resource: "data-pipeline",
    resourceType: "service",
    team: "Data Platform",
    overall: "pass",
    checks: [
      { name: "iam", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(24) },
    ],
  },
  {
    resource: "webhook-fanout",
    resourceType: "lambda",
    team: "Integrations",
    overall: "pass",
    checks: [
      { name: "iam", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(10) },
    ],
  },
  {
    resource: "invoice-processor",
    resourceType: "lambda",
    team: "Payments Platform",
    overall: "fail",
    checks: [
      {
        name: "iam",
        status: "fail",
        finding:
          "Lambda execution role uses 'AWSLambdaFullAccess' managed policy. Should be scoped down to specific S3 buckets + Stripe webhook endpoints.",
        lastEvaluated: hoursAgo(40),
      },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(14) },
    ],
  },
  {
    resource: "platformops-prod",
    resourceType: "cluster",
    team: "Platform Engineering",
    overall: "pass",
    checks: [
      { name: "iam", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(6) },
    ],
  },
  {
    resource: "support-triage",
    resourceType: "agent",
    team: "Customer Insights",
    overall: "pass",
    checks: [
      { name: "iam", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "network", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "encryption-at-rest", status: "pass", lastEvaluated: hoursAgo(6) },
      { name: "sbom-scan", status: "pass", lastEvaluated: hoursAgo(36) },
    ],
  },
];

// Hoisted for the same stable-reference reason as listAuditEventsTool.
const policyStatusTool = {
  name: "policy-status",
  description:
    "Returns the current policy posture across the platform: per-resource compliance for IAM least-privilege, network segmentation, encryption-at-rest, and SBOM (CVE) scanning. Each resource has an overall status (pass/fail/warn) and the four individual checks with findings when failing. Use this for governance dashboards, compliance audits, 'which services are failing X' queries, and 'what's our IAM exposure' questions.",
  render: makeDataToolRender({
    label: "policy-status",
    glyph: "🛡",
    argsSummary: (args) => {
      const parts: string[] = [];
      if (args.resource) parts.push(String(args.resource));
      if (args.check) parts.push(`check=${args.check}`);
      if (args.status) parts.push(`status=${args.status}`);
      return parts.length ? `(${parts.join(", ")})` : "(catalog-wide)";
    },
    resultSummary: (result) => {
      const r = result as {
        count?: number;
        summary?: { passing?: number; warning?: number; failing?: number };
      };
      const n = r.count ?? 0;
      const s = r.summary;
      if (s) {
        return `→ ${n} matches · ${s.passing ?? 0} pass · ${s.warning ?? 0} warn · ${s.failing ?? 0} fail`;
      }
      return `→ ${n} resource${n === 1 ? "" : "s"}`;
    },
  }),
  parameters: z.object({
    resource: z
      .string()
      .optional()
      .describe(
        "Filter to one resource id (e.g. 'payment-api', 'user-service'). Omit to return the whole catalog.",
      ),
    check: z
      .enum(["iam", "network", "encryption-at-rest", "sbom-scan"])
      .optional()
      .describe("Filter results to a specific check type."),
    status: z
      .enum(["pass", "fail", "warn"])
      .optional()
      .describe(
        "Filter to resources whose OVERALL status matches (e.g. status='fail' lists everything currently failing at least one check).",
      ),
    team: z
      .string()
      .optional()
      .describe("Filter to resources owned by one team."),
  }),
  handler: async ({
    resource,
    check,
    status,
    team,
  }: {
    resource?: string;
    check?: "iam" | "network" | "encryption-at-rest" | "sbom-scan";
    status?: "pass" | "fail" | "warn";
    team?: string;
  }) => {
    const filtered = POLICY_POSTURE.filter((p) => {
      if (resource && p.resource !== resource) return false;
      if (team && p.team !== team) return false;
      if (status && p.overall !== status) return false;
      if (check) {
        const c = p.checks.find((x) => x.name === check);
        if (!c) return false;
        // When `check` is given, prefer rows where THAT check is non-pass
        // if status filter is also fail/warn — otherwise return all.
        if (status && c.status !== status) return false;
      }
      return true;
    });
      return {
        count: filtered.length,
        resources: filtered,
        summary: {
          totalResources: POLICY_POSTURE.length,
          passing: POLICY_POSTURE.filter((p) => p.overall === "pass").length,
          warning: POLICY_POSTURE.filter((p) => p.overall === "warn").length,
          failing: POLICY_POSTURE.filter((p) => p.overall === "fail").length,
        },
      };
    },
};

function usePolicyStatusTool() {
  useFrontendTool(policyStatusTool);
}
