"use client";

import { useState } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import { Canvas } from "./Canvas";
import { useDashboardStore, type SelectedResource } from "./store";

/**
 * PlatformOps — the agent-driven canvas.
 *
 * The sidebar is context-aware (Backstage-style):
 * - When nothing is selected, it shows global sections (Day 1 / Day 2).
 * - When a resource is selected (service, cluster, lambda, agent), it
 *   switches to a resource-specific action list with quick-prompts.
 *
 * The agent drives the canvas; the sidebar provides shortcuts that send
 * prompts to the agent via agent.runAgent().
 */
export function Dashboard() {
  const [section, setSection] = useState<Section>("catalog");
  const selectedResource = useDashboardStore((s) => s.selectedResource);

  return (
    <div className="min-h-screen flex bg-nord-0 text-nord-6">
      <Sidebar
        active={section}
        onSelect={setSection}
        selectedResource={selectedResource}
      />
      <main className="flex-1 px-10 py-8 overflow-auto">
        <Header />
        {selectedResource ? (
          <ResourceContext resource={selectedResource} />
        ) : (
          <>
            <SectionIntro section={section} />
            <QuickPrompts section={section} />
          </>
        )}
        <div className="mt-8">
          <Canvas />
        </div>
      </main>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────

type Section =
  | "catalog"
  | "clusters"
  | "lambdas"
  | "agents"
  | "golden-paths"
  | "self-service"
  | "deployments"
  | "oncall"
  | "cost"
  | "governance";

function Sidebar({
  active,
  onSelect,
  selectedResource,
}: {
  active: Section;
  onSelect: (s: Section) => void;
  selectedResource: SelectedResource;
}) {
  const clearSelectedResource = useDashboardStore(
    (s) => s.clearSelectedResource,
  );
  const clearCanvas = useDashboardStore((s) => s.clearCanvas);

  return (
    <aside className="w-64 border-r border-nord-2 bg-nord-1 flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-nord-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nord-frost2 to-nord-frost4 flex items-center justify-center text-nord-0 font-bold text-lg">
            P
          </div>
          <div>
            <div className="font-semibold text-base leading-tight">PlatformOps</div>
            <div className="text-[11px] opacity-50 leading-tight">
              Internal Developer Portal
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-auto">
        {selectedResource ? (
          <ResourceSidebar
            resource={selectedResource}
            onExit={() => {
              clearSelectedResource();
              clearCanvas();
            }}
          />
        ) : (
          <GlobalSidebar active={active} onSelect={onSelect} />
        )}
      </nav>

      <div className="px-6 py-4 border-t border-nord-2 leading-relaxed">
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold mb-1">
          Conversation-native IDP
        </div>
        <div className="text-[10px] uppercase tracking-wider opacity-40">
          Catalog · Golden paths · Self-service · Operate
        </div>
        <div className="text-[9px] uppercase tracking-wider opacity-30 mt-1.5">
          Built on MCP Apps · A2UI · AG-UI · CopilotKit
        </div>
      </div>
    </aside>
  );
}

function GlobalSidebar({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (s: Section) => void;
}) {
  const items: Array<{ id: Section; label: string; group: string }> = [
    { id: "catalog", label: "Services", group: "Service Catalog" },
    { id: "clusters", label: "EKS Clusters", group: "Service Catalog" },
    { id: "lambdas", label: "Lambda Functions", group: "Service Catalog" },
    { id: "agents", label: "AgentCore Agents", group: "Service Catalog" },
    { id: "golden-paths", label: "Scaffold from template", group: "Golden Paths" },
    { id: "self-service", label: "Day 1 / Day 2 actions", group: "Self-Service" },
    { id: "deployments", label: "Recent deployments", group: "Operations" },
    { id: "oncall", label: "On-call & Runbooks", group: "Operations" },
    { id: "cost", label: "Cost dashboard", group: "Cost & Governance" },
    { id: "governance", label: "Audit & policy", group: "Cost & Governance" },
  ];
  const groups = [
    "Service Catalog",
    "Golden Paths",
    "Self-Service",
    "Operations",
    "Cost & Governance",
  ];

  return (
    <div className="space-y-4 text-sm">
      {groups.map((g) => (
        <div key={g}>
          <div className="px-3 mb-1 text-[10px] uppercase tracking-[0.2em] opacity-40">
            {g}
          </div>
          <div className="space-y-0.5">
            {items
              .filter((i) => i.group === g)
              .map((it) => (
                <button
                  key={it.id}
                  onClick={() => onSelect(it.id)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    active === it.id
                      ? "bg-nord-2 text-nord-frost2 font-semibold"
                      : "text-nord-4 hover:bg-nord-2/40"
                  }`}
                >
                  {it.label}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceSidebar({
  resource,
  onExit,
}: {
  resource: NonNullable<SelectedResource>;
  onExit: () => void;
}) {
  const { agent } = useAgent();
  const actions = ACTIONS_FOR_RESOURCE[resource.kind];
  const resourceLabel = labelForResource(resource);
  const typeLabel = TYPE_LABELS[resource.kind];

  const dispatch = async (prompt: string) => {
    agent.addMessage({
      id: `ctx-${Date.now()}`,
      role: "user",
      content: prompt.replace(/\{id\}/g, resourceId(resource)),
    });
    await agent.runAgent();
  };

  return (
    <div className="text-sm space-y-4">
      <button
        onClick={onExit}
        className="w-full text-left px-3 py-2 rounded text-xs text-nord-4 hover:bg-nord-2/40 flex items-center gap-2"
      >
        <span className="opacity-60">←</span> Back to all
      </button>

      <div className="px-3">
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-40">
          {typeLabel}
        </div>
        <div className="text-base font-semibold truncate">{resourceLabel}</div>
        <div className="text-[11px] opacity-50 font-mono truncate">
          {resourceId(resource)}
        </div>
      </div>

      <div>
        <div className="px-3 mb-1 text-[10px] uppercase tracking-[0.2em] opacity-40">
          Actions
        </div>
        <div className="space-y-0.5">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => dispatch(a.prompt)}
              className={`w-full text-left px-3 py-2 rounded text-nord-4 hover:bg-nord-2/40 transition-colors flex items-center justify-between gap-2`}
            >
              <span className="truncate">{a.label}</span>
              <span
                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${TAG_TONES[a.tag]}`}
              >
                {a.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────

function Header() {
  const { agent } = useAgent();
  const clearCanvas = useDashboardStore((s) => s.clearCanvas);
  const clearSelectedResource = useDashboardStore(
    (s) => s.clearSelectedResource,
  );
  const resetConversation = () => {
    agent.setMessages([]);
    clearCanvas();
    clearSelectedResource();
  };
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] opacity-50 mb-1">
          PlatformOps
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          What do you want to ship today?
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={resetConversation}
          className="text-[11px] px-3 py-1.5 rounded border border-nord-2 hover:bg-nord-2/40 text-nord-4 transition-colors"
          title="Clear the conversation and the canvas — useful if the chat gets stuck on an orphaned tool call"
        >
          Reset conversation
        </button>
        <div className="text-[11px] opacity-50">engin.diri@platformops.dev</div>
        <div className="w-8 h-8 rounded-full bg-nord-frost3 flex items-center justify-center text-nord-0 text-xs font-bold">
          ED
        </div>
      </div>
    </header>
  );
}

// ─── Resource-context header in main area ────────────────────────────────

function ResourceContext({
  resource,
}: {
  resource: NonNullable<SelectedResource>;
}) {
  const { agent } = useAgent();
  const openSelfService = async () => {
    agent.addMessage({
      id: `self-service-${Date.now()}`,
      role: "user",
      content: `What can I do with ${resourceId(resource)}?`,
    });
    await agent.runAgent();
  };

  const gov = governanceFor(resource);

  return (
    <div className="mb-6 rounded-2xl border border-nord-frost2/30 bg-nord-frost2/5 p-5">
      <div className="text-[10px] uppercase tracking-[0.25em] text-nord-frost2 mb-1">
        {TYPE_LABELS[resource.kind]} · focused
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">
            {labelForResource(resource)}
          </h2>
          <p className="text-sm opacity-65 mt-1 max-w-2xl">
            Sidebar now shows actions for this {TYPE_LABELS[resource.kind].toLowerCase()}. Or
            open the Day 1 / Day 2 self-service board.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={openSelfService}
            className="text-[11px] px-3 py-1.5 rounded border border-nord-ok/40 bg-nord-ok/10 hover:bg-nord-ok/20 text-nord-ok transition-colors font-semibold"
            title="Render the Day 1 / Day 2 self-service action board for this resource as an A2UI surface"
          >
            Self-service actions ↗
          </button>
          <div className="text-[11px] opacity-50 font-mono">
            {resourceId(resource)}
          </div>
        </div>
      </div>

      {/* Governance & audit row — what makes this an IDP, not a chatbot. */}
      <div className="mt-4 pt-4 border-t border-nord-frost2/20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-[11px]">
        <GovCell label="Acting as" value="engin.diri@" valueClass="font-mono" />
        <GovCell label="Owning team" value={gov.team} />
        <GovCell
          label="Policy checks"
          value={gov.policyStatus}
          valueClass={
            gov.policyStatus === "all green"
              ? "text-nord-ok"
              : gov.policyStatus === "approval required"
                ? "text-nord-warn"
                : "text-nord-accent"
          }
        />
        <GovCell label="Last audit event" value={gov.lastAuditId} valueClass="font-mono opacity-70" />
        <GovCell label="Source catalog" value={gov.sourceCatalog} valueClass="font-mono opacity-70" />
        <GovCell label="Change approval" value={gov.approval} />
        <GovCell label="SLO" value={gov.slo} valueClass={gov.sloOk ? "text-nord-ok" : "text-nord-warn"} />
        <GovCell label="Cost / mo" value={gov.cost} valueClass="font-mono" />
      </div>
    </div>
  );
}

function GovCell({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-[9px] uppercase tracking-[0.18em] opacity-40">
        {label}
      </div>
      <div className={`text-xs mt-0.5 ${valueClass ?? "text-nord-6"}`}>
        {value}
      </div>
    </div>
  );
}

/**
 * Mock governance signals per resource id. In real life these would come
 * from the catalog backend, the policy engine, and the audit store —
 * separate MCP servers, all surfaced through the same agent. We hard-code
 * a small mapping so the IDP header has truthful-feeling values on stage
 * instead of "—" placeholders.
 */
function governanceFor(r: NonNullable<SelectedResource>): {
  team: string;
  policyStatus: "all green" | "approval required" | "1 finding";
  lastAuditId: string;
  sourceCatalog: string;
  approval: string;
  slo: string;
  sloOk: boolean;
  cost: string;
} {
  const id = resourceId(r);
  // Deterministic-ish lookup by id so the same resource shows the same
  // values across renders. Falls back to safe defaults.
  const KNOWN: Record<
    string,
    Partial<ReturnType<typeof governanceFor>>
  > = {
    "payment-api": {
      team: "Payments Platform",
      policyStatus: "all green",
      lastAuditId: "evt_01HQXZ4F",
      sourceCatalog: "catalog/services.yaml#L142",
      approval: "Not required (staging)",
      slo: "99.94% / 99.9%",
      sloOk: true,
      cost: "$1,820",
    },
    "user-service": {
      team: "Identity Platform",
      policyStatus: "1 finding",
      lastAuditId: "evt_01HQXY1B",
      sourceCatalog: "catalog/services.yaml#L201",
      approval: "Not required (staging)",
      slo: "99.91% / 99.9%",
      sloOk: true,
      cost: "$1,140",
    },
    "notification-service": {
      team: "Comms Platform",
      policyStatus: "all green",
      lastAuditId: "evt_01HQXT9D",
      sourceCatalog: "catalog/services.yaml#L278",
      approval: "Required for prod (CAB)",
      slo: "99.87% / 99.9%",
      sloOk: false,
      cost: "$640",
    },
    "platformops-prod": {
      team: "Platform Engineering",
      policyStatus: "all green",
      lastAuditId: "evt_01HQXR0C",
      sourceCatalog: "infra/eks/prod.tf",
      approval: "Required for scale > 16 nodes",
      slo: "99.99% control plane",
      sloOk: true,
      cost: "$8,420",
    },
    "webhook-fanout": {
      team: "Integrations",
      policyStatus: "all green",
      lastAuditId: "evt_01HQXM2A",
      sourceCatalog: "catalog/lambdas.yaml#L42",
      approval: "Not required",
      slo: "p99 < 250ms",
      sloOk: true,
      cost: "$210",
    },
  };
  const known = KNOWN[id] ?? {};
  return {
    team: known.team ?? "Platform Engineering",
    policyStatus: known.policyStatus ?? "all green",
    lastAuditId: known.lastAuditId ?? "evt_pending",
    sourceCatalog: known.sourceCatalog ?? "catalog/registry.yaml",
    approval: known.approval ?? "Not required",
    slo: known.slo ?? "—",
    sloOk: known.sloOk ?? true,
    cost: known.cost ?? "—",
  };
}

// ─── Section intro (global mode) ──────────────────────────────────────────

function SectionIntro({ section }: { section: Section }) {
  const intros: Record<Section, { title: string; desc: string }> = {
    "self-service": {
      title: "Day 1 / Day 2 actions",
      desc: "What can you do with the resource in front of you? Provisioning on the left, operations on the right. Pick one — clicks fire back through the agent loop, no full-page navigation.",
    },
    "golden-paths": {
      title: "Golden paths",
      desc: "Scaffold a new service, cluster, lambda, or agent from a vetted template. Same opinionated paths your platform team would walk you through, just driven by conversation.",
    },
    governance: {
      title: "Audit & policy",
      desc: "Every action you take goes on an audit trail. Every change passes the policy checks the platform team owns. Ask 'who deployed payment-api last' or 'which services failed the IAM policy check' and the agent will tell you.",
    },
    catalog: {
      title: "Service Catalog",
      desc: "Every service is one prompt away. Open one to focus the sidebar on its actions.",
    },
    clusters: {
      title: "EKS Clusters",
      desc: "Provision new clusters, inspect existing ones, scale node groups.",
    },
    lambdas: {
      title: "Lambda Functions",
      desc: "Create functions, watch invocations, tail logs.",
    },
    agents: {
      title: "Bedrock AgentCore",
      desc: "Deploy new agents, audit traces, swap models.",
    },
    deployments: {
      title: "Deployments",
      desc: "Recent deploys across the platform — streaming, rolling back, comparing.",
    },
    oncall: {
      title: "On-call & Runbooks",
      desc: "Who's primary, who's secondary, and what to do at 3am.",
    },
    cost: {
      title: "Cost & Metrics",
      desc: "Where the money goes, and which SLOs are burning.",
    },
  };
  const i = intros[section];
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight">{i.title}</h2>
      <p className="text-sm opacity-65 max-w-3xl mt-1">{i.desc}</p>
    </div>
  );
}

// ─── Quick prompts (global mode) ──────────────────────────────────────────

interface QuickPrompt {
  label: string;
  prompt: string;
  tag: "MCP App" | "A2UI" | "AG-UI";
  subtext?: string;
}

const TAG_TONES: Record<QuickPrompt["tag"], string> = {
  "MCP App": "bg-nord-frost2/20 text-nord-frost2",
  A2UI: "bg-nord-ok/20 text-nord-ok",
  "AG-UI": "bg-nord-warn/20 text-nord-warn",
};

const PATTERN_FOR_TAG: Record<QuickPrompt["tag"], string> = {
  "MCP App": "Open-ended",
  A2UI: "Declarative",
  "AG-UI": "Controlled",
};

// Prompts are intent-only: say WHAT the user wants to know, not HOW to render
// it. The primary agent picks the tool family (MCP App / generate_a2ui /
// deploy-streaming / stream-action / render-chart) and the secondary A2UI
// designer picks the actual component shape. Mentioning "Card", "Column",
// "PlatformChart", "catalogId", etc. in the user prompt collapses the
// architecture back into one big LLM call deciding everything.
const QUICK_PROMPTS: Record<Section, QuickPrompt[]> = {
  catalog: [
    { label: "Open service catalog", prompt: "Show me the service catalog", tag: "MCP App", subtext: "Catalog page with health + ownership" },
    { label: "Show payment-api", prompt: "Show me the payment-api service details", tag: "MCP App", subtext: "Service detail page from the catalog" },
    { label: "Is payment-api safe to deploy?", prompt: "Is payment-api safe to deploy right now?", tag: "A2UI", subtext: "Agent gathers SLO, deploys, on-call, deps; designer picks the surface" },
    { label: "Deploy payment-api to staging", prompt: "Deploy payment-api to staging", tag: "AG-UI", subtext: "Streams Validate → Push → Roll out → Health check" },
  ],
  clusters: [
    { label: "List EKS clusters", prompt: "List the EKS clusters", tag: "MCP App", subtext: "Cluster catalog with health + monthly cost" },
    { label: "Provision new cluster", prompt: "I want to create a new EKS cluster. Open the form.", tag: "MCP App", subtext: "Provisioning form, opens in the canvas" },
    { label: "Status of platformops-prod", prompt: "What's the current status of platformops-prod?", tag: "A2UI", subtext: "Composed status surface from live cluster data" },
    { label: "Scale prod cluster", prompt: "Scale the general node group on platformops-prod to 12 nodes.", tag: "AG-UI", subtext: "Live node-drain rollout, phases tick in the canvas" },
  ],
  lambdas: [
    { label: "List Lambda functions", prompt: "List the Lambda functions", tag: "MCP App", subtext: "Lambda catalog with invocations + errors" },
    { label: "Create new Lambda", prompt: "I want to create a new Lambda. Open the form.", tag: "MCP App", subtext: "Provisioning form, opens in the canvas" },
    { label: "Tail invoice-processor logs", prompt: "Show me the last 10 log entries for invoice-processor.", tag: "A2UI", subtext: "Designer picks the log-feed shape" },
    { label: "Run webhook-fanout test", prompt: "Run a test invocation of webhook-fanout.", tag: "AG-UI", subtext: "Streaming test invocation with phases" },
  ],
  agents: [
    { label: "List AgentCore agents", prompt: "List the AgentCore agents", tag: "MCP App", subtext: "AgentCore catalog with model + cost" },
    { label: "Deploy new agent", prompt: "I want to deploy a new AgentCore agent. Open the form.", tag: "MCP App", subtext: "Provisioning form, opens in the canvas" },
    { label: "Recent support-triage traces", prompt: "Show me the 5 most recent traces for support-triage.", tag: "A2UI", subtext: "Designer composes trace cards from telemetry" },
    { label: "Probe support-triage", prompt: "Run a test invocation of support-triage with the prompt 'where is my order'.", tag: "AG-UI", subtext: "Streams tool calls + tokens as they happen" },
  ],
  "golden-paths": [
    { label: "Scaffold a new service", prompt: "I want to scaffold a new service from the platform template. Open the form.", tag: "MCP App", subtext: "Opinionated scaffold form, registers into the catalog" },
    { label: "Provision new EKS cluster", prompt: "Provision a new EKS cluster from the golden template. Open the form.", tag: "MCP App", subtext: "Provisioning form with vetted defaults" },
    { label: "Bootstrap a new Lambda", prompt: "Bootstrap a new Lambda function from the platform template. Open the form.", tag: "MCP App", subtext: "Includes IAM, DLQ, tracing wired" },
    { label: "Deploy AgentCore agent", prompt: "Deploy a new AgentCore agent from the platform template. Open the form.", tag: "MCP App", subtext: "Includes guardrails + knowledge base wiring" },
  ],
  "self-service": [
    { label: "What can I do (global)?", prompt: "What can I do on the platform right now? Show me the global Day 1 / Day 2 self-service board.", tag: "A2UI", subtext: "Day 1 / Day 2 board for the whole platform" },
    { label: "Self-service for payment-api", prompt: "Open payment-api, then show me what I can do with it.", tag: "A2UI", subtext: "Focus a service, then surface its actions" },
    { label: "Self-service for platformops-prod", prompt: "Show me the status of platformops-prod, then what I can do with it.", tag: "A2UI", subtext: "Cluster-scoped Day 1 / Day 2 board" },
    { label: "Self-service for webhook-fanout", prompt: "Show me invocation metrics for webhook-fanout, then what I can do with it.", tag: "A2UI", subtext: "Lambda-scoped Day 1 / Day 2 board" },
  ],
  deployments: [
    { label: "Recent production deploys", prompt: "Show me the 10 most recent production deployments.", tag: "A2UI", subtext: "Designer composes the deploy history with attribution + audit" },
    { label: "Deploys this week", prompt: "How many deployments happened each day this week?", tag: "A2UI", subtext: "Designer picks the chart shape" },
    { label: "Roll back data-pipeline", prompt: "Roll back the most recent data-pipeline deployment.", tag: "A2UI", subtext: "Rollback confirmation with audit details" },
    { label: "Deploy notification-service", prompt: "Deploy notification-service to staging.", tag: "AG-UI", subtext: "Streaming deploy with 4 phases" },
  ],
  oncall: [
    { label: "Who's on-call this week?", prompt: "Who's on-call across all teams right now?", tag: "A2UI", subtext: "Designer composes the rotation surface" },
    { label: "payment-api runbook", prompt: "Pull the payment-api runbook.", tag: "A2UI", subtext: "Designer composes Symptoms / First 5 minutes / Escalation" },
    { label: "Page primary on-call", prompt: "Page the primary on-call for Platform Team about a notification-service incident.", tag: "AG-UI", subtext: "Streaming incident page with phases" },
  ],
  cost: [
    { label: "Cost by resource type", prompt: "Show me the monthly cost broken down by resource type.", tag: "A2UI", subtext: "Designer picks the chart shape" },
    { label: "Cost by team", prompt: "Show me the monthly cost broken down by team.", tag: "A2UI", subtext: "Designer picks the chart shape" },
    { label: "Lambda invocations trend", prompt: "Show me Lambda invocations over the last 7 days.", tag: "A2UI", subtext: "Designer picks the chart shape" },
    { label: "SLO health for payment-api", prompt: "How healthy is payment-api against its SLO?", tag: "A2UI", subtext: "Designer composes the SLO surface" },
  ],
  governance: [
    { label: "Recent audit events", prompt: "Show me the 10 most recent audit events across the platform.", tag: "A2UI", subtext: "Designer composes the audit log surface" },
    { label: "Who deployed payment-api last?", prompt: "Who deployed payment-api last, and did it pass the policy checks?", tag: "A2UI", subtext: "Single-event accountability surface" },
    { label: "Policy status across catalog", prompt: "What is the current policy posture across all services? IAM, network, encryption-at-rest, SBOM.", tag: "A2UI", subtext: "Compliance snapshot across the catalog" },
    { label: "Services failing IAM policy", prompt: "Which services are currently failing the IAM least-privilege policy?", tag: "A2UI", subtext: "Filtered policy failures grouped by service" },
  ],
};

function QuickPrompts({ section }: { section: Section }) {
  const prompts = QUICK_PROMPTS[section];
  const { agent } = useAgent();

  const onClick = async (p: QuickPrompt) => {
    agent.addMessage({
      id: `qp-${Date.now()}`,
      role: "user",
      content: p.prompt,
    });
    await agent.runAgent();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {prompts.map((p) => (
        <button
          key={p.label}
          onClick={() => onClick(p)}
          className={`text-left rounded-xl border bg-nord-1 hover:bg-nord-2/50 transition-colors px-4 py-3 ${
            p.tag === "A2UI"
              ? "border-nord-ok/30 hover:border-nord-ok/60"
              : p.tag === "AG-UI"
                ? "border-nord-warn/30 hover:border-nord-warn/60"
                : "border-nord-frost2/30 hover:border-nord-frost2/60"
          }`}
        >
          <div className="text-sm font-semibold leading-snug">{p.label}</div>
          {p.subtext && (
            <div className="text-[11px] opacity-50 mt-1 leading-snug">
              {p.subtext}
            </div>
          )}
          <div className={`text-[9px] uppercase tracking-[0.15em] mt-2 opacity-60 ${TAG_TONES[p.tag].split(" ")[1]}`}>
            {PATTERN_FOR_TAG[p.tag]} · {p.tag}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Resource-context action sets ─────────────────────────────────────────

interface ResourceAction {
  label: string;
  prompt: string;
  tag: "MCP App" | "A2UI" | "AG-UI";
}

// Same principle as QUICK_PROMPTS: intent only. The agent picks the
// rendering family; the secondary A2UI designer picks the component shape.
const ACTIONS_FOR_RESOURCE: Record<NonNullable<SelectedResource>["kind"], ResourceAction[]> = {
  service: [
    { label: "Self-service actions", prompt: "What can I do with {id}?", tag: "A2UI" },
    { label: "Overview", prompt: "Show me the {id} service details", tag: "MCP App" },
    { label: "Is it safe to deploy?", prompt: "Is {id} safe to deploy right now?", tag: "A2UI" },
    { label: "SLO health", prompt: "How healthy is {id} against its SLO?", tag: "A2UI" },
    { label: "Deploy to staging", prompt: "Deploy {id} to staging", tag: "AG-UI" },
    { label: "Deploy to production", prompt: "Deploy {id} to production", tag: "AG-UI" },
    { label: "Recent deploys", prompt: "Show me the recent deployments for {id}.", tag: "A2UI" },
    { label: "Roll back", prompt: "Roll back the most recent {id} deployment.", tag: "A2UI" },
    { label: "Runbook", prompt: "Pull the {id} runbook.", tag: "A2UI" },
    { label: "On-call for owning team", prompt: "Who's on-call for the team that owns {id}?", tag: "A2UI" },
  ],
  cluster: [
    { label: "Self-service actions", prompt: "What can I do with {id}?", tag: "A2UI" },
    { label: "Cluster overview", prompt: "What's the current status of {id}?", tag: "A2UI" },
    { label: "Scale general node group", prompt: "Scale the general node group on {id} to 12 nodes.", tag: "AG-UI" },
    { label: "Pod health", prompt: "Show me the pod health summary for {id}, grouped by node group.", tag: "A2UI" },
    { label: "Cost", prompt: "What does {id} cost per month?", tag: "A2UI" },
    { label: "List services on cluster", prompt: "Which platform services run on {id}?", tag: "A2UI" },
  ],
  lambda: [
    { label: "Self-service actions", prompt: "What can I do with {id}?", tag: "A2UI" },
    { label: "Invocation metrics", prompt: "Give me 24h invocation metrics for {id}: invocations, errors, error rate, p99, throttles.", tag: "A2UI" },
    { label: "Tail logs", prompt: "Show me the last 10 CloudWatch log entries for {id}.", tag: "A2UI" },
    { label: "Invoke", prompt: "Run a test invocation of {id}.", tag: "AG-UI" },
    { label: "Cold-start budget", prompt: "How does {id}'s cold-start budget look this week?", tag: "A2UI" },
  ],
  agent: [
    { label: "Self-service actions", prompt: "What can I do with {id}?", tag: "A2UI" },
    { label: "Recent traces", prompt: "Show me the 5 most recent traces for {id}: prompt, tools called, latency, tokens.", tag: "A2UI" },
    { label: "Run a probe", prompt: "Run a test invocation of {id} with prompt 'where is my order'.", tag: "AG-UI" },
    { label: "Cost & latency", prompt: "What is {id}'s cost, average latency, error rate, and invocation volume?", tag: "A2UI" },
    { label: "Swap model", prompt: "What would change if {id} switched to claude-haiku-4-5?", tag: "A2UI" },
  ],
};

const TYPE_LABELS: Record<NonNullable<SelectedResource>["kind"], string> = {
  service: "Service",
  cluster: "EKS Cluster",
  lambda: "Lambda",
  agent: "AgentCore",
};

function labelForResource(r: NonNullable<SelectedResource>): string {
  if (r.kind === "lambda") return r.name;
  return r.name ?? r.id;
}

function resourceId(r: NonNullable<SelectedResource>): string {
  if (r.kind === "lambda") return r.name;
  return r.id;
}
