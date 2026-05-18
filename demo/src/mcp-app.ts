import { App } from "@modelcontextprotocol/ext-apps";
import "./global.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyResult = { structuredContent?: any };

interface Service {
  id: string;
  name: string;
  description: string;
  team: string;
  language: string;
  health: "healthy" | "degraded" | "unhealthy";
  replicas: number;
  lastDeploy: string;
  endpoints?: string[];
  dependencies?: string[];
}

interface CatalogData {
  view: "catalog";
  services: Service[];
}

interface DetailData {
  view: "detail";
  service: Service;
}

interface DeployResultData {
  view: "deploy-result";
  deployment: {
    id: string;
    serviceId: string;
    serviceName: string;
    environment: string;
    status: string;
    timestamp: string;
  };
}

interface ClustersData {
  view: "clusters";
  clusters: EksCluster[];
}

interface ClusterProvisionData {
  view: "cluster-provision";
  cluster: EksCluster;
  phases: ProvisionPhase[];
}

interface LambdasData {
  view: "lambdas";
  lambdas: LambdaFn[];
}

interface LambdaProvisionData {
  view: "lambda-provision";
  lambda: LambdaFn;
  phases: ProvisionPhase[];
}

interface AgentsData {
  view: "agents";
  agents: AgentCoreDeployment[];
}

interface AgentProvisionData {
  view: "agent-provision";
  agent: AgentCoreDeployment;
  phases: ProvisionPhase[];
}

interface ProvisionPhase {
  name: string;
  status: "complete" | "in-progress" | "pending";
  durationMs: number;
}

interface EksCluster {
  id: string;
  name: string;
  region: string;
  version: string;
  status: string;
  nodeGroups: Array<{
    name: string;
    instanceType: string;
    desired: number;
    min: number;
    max: number;
  }>;
  podsRunning: number;
  servicesAttached: number;
  costMonthUsd: number;
  createdAt: string;
}

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
  status: string;
}

interface AgentCoreDeployment {
  id: string;
  name: string;
  model: string;
  status: string;
  region: string;
  invocations24h: number;
  avgLatencyMs: number;
  errorRate: number;
  costMonthUsd: number;
  guardrails: string[];
  knowledgeBases: string[];
  lastDeploy: string;
}

interface ClusterFormData {
  view: "cluster-form";
  defaults: {
    region: string;
    version: string;
    instanceType: string;
    desiredNodes: number;
  };
  regions: string[];
  versions: string[];
  instanceTypes: string[];
}

interface LambdaFormData {
  view: "lambda-form";
  defaults: {
    runtime: string;
    memoryMb: number;
    timeoutSeconds: number;
    trigger: string;
  };
  runtimes: string[];
  triggers: string[];
}

interface AgentFormData {
  view: "agent-form";
  defaults: { model: string };
  models: string[];
  availableGuardrails: string[];
  availableKnowledgeBases: string[];
}

type ViewData =
  | CatalogData
  | DetailData
  | DeployResultData
  | ClustersData
  | ClusterProvisionData
  | LambdasData
  | LambdaProvisionData
  | AgentsData
  | AgentProvisionData
  | ClusterFormData
  | LambdaFormData
  | AgentFormData;

const appEl = document.getElementById("app")!;
const app = new App({ name: "Platform Service Catalog", version: "1.0.0" });

function renderCatalog(data: CatalogData): void {
  const { services } = data;
  const healthy = services.filter((s) => s.health === "healthy").length;
  const degraded = services.filter((s) => s.health === "degraded").length;
  const unhealthy = services.filter((s) => s.health === "unhealthy").length;

  appEl.innerHTML = `
    <div class="catalog-header">
      <h1>Platform Service Catalog</h1>
      <p>${services.length} registered services</p>
      <div class="catalog-stats">
        <span class="stat"><span class="stat-dot healthy"></span>${healthy} healthy</span>
        <span class="stat"><span class="stat-dot degraded"></span>${degraded} degraded</span>
        <span class="stat"><span class="stat-dot unhealthy"></span>${unhealthy} unhealthy</span>
      </div>
    </div>
    <div class="service-grid">
      ${services
        .map(
          (s) => `
        <div class="service-card" data-id="${s.id}">
          <div class="service-card-header">
            <span class="service-card-name">${s.name}</span>
            <span class="health-badge ${s.health}">${s.health}</span>
          </div>
          <div class="service-card-desc">${s.description}</div>
          <div class="service-card-meta">
            <span class="service-card-tag">${s.language}</span>
            <span>${s.replicas} replicas</span>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;

  // Attach click handlers
  appEl.querySelectorAll<HTMLElement>(".service-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const serviceId = card.dataset.id!;
      card.style.opacity = "0.6";
      const result = await app.callServerTool({
        name: "show-service",
        arguments: { serviceId },
      });
      handleAnyResult(result);
    });
  });
}

function renderDetail(data: DetailData): void {
  const { service: s } = data;
  const deployDate = new Date(s.lastDeploy).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  appEl.innerHTML = `
    <div class="detail-view">
      <button class="back-btn" id="back-btn">&larr; Back to catalog</button>
      <div class="detail-header">
        <h1>${s.name}</h1>
        <span class="health-badge ${s.health}">${s.health}</span>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 20px;">${s.description}</p>

      <div class="detail-section">
        <h2>Overview</h2>
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-item-label">Team</div>
            <div class="detail-item-value">${s.team}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Language</div>
            <div class="detail-item-value">${s.language}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Replicas</div>
            <div class="detail-item-value">${s.replicas}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Last Deploy</div>
            <div class="detail-item-value">${deployDate}</div>
          </div>
        </div>
      </div>

      ${
        s.endpoints?.length
          ? `
        <div class="detail-section">
          <h2>Endpoints</h2>
          <ul class="endpoint-list">
            ${s.endpoints.map((e) => `<li>${e}</li>`).join("")}
          </ul>
        </div>
      `
          : ""
      }

      ${
        s.dependencies?.length
          ? `
        <div class="detail-section">
          <h2>Dependencies</h2>
          <div class="dep-list">
            ${s.dependencies.map((d) => `<span class="dep-chip">${d}</span>`).join("")}
          </div>
        </div>
      `
          : ""
      }

      <div class="detail-section">
        <h2>Deploy</h2>
        <div style="display: flex; gap: 8px;">
          <button class="deploy-btn" id="deploy-staging" data-id="${s.id}" data-env="staging">
            Deploy to Staging
          </button>
          <button class="deploy-btn" id="deploy-prod" data-id="${s.id}" data-env="production">
            Deploy to Production
          </button>
        </div>
        <div id="deploy-status" style="margin-top: 12px;"></div>
      </div>
    </div>
  `;

  document.getElementById("back-btn")!.addEventListener("click", async () => {
    const result = await app.callServerTool({
      name: "show-catalog",
      arguments: {},
    });
    handleAnyResult(result);
  });

  document.querySelectorAll<HTMLButtonElement>(".deploy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const serviceId = btn.dataset.id!;
      const environment = btn.dataset.env!;
      btn.disabled = true;
      btn.textContent = "Deploying...";
      const result = await app.callServerTool({
        name: "deploy-service",
        arguments: { serviceId, environment },
      });
      handleAnyResult(result);
    });
  });
}

function renderDeployResult(data: DeployResultData): void {
  const { deployment: d } = data;
  const statusEl = document.getElementById("deploy-status");
  const html = `
    <div class="deploy-result${d.status !== "success" ? " error" : ""}">
      <h2>${d.status === "success" ? "✓" : "✗"} Deployment ${d.status}</h2>
      <p><strong>${d.serviceName}</strong> deployed to <strong>${d.environment}</strong></p>
      <p style="margin-top: 4px; font-family: var(--font-mono); font-size: 0.75rem;">
        ID: ${d.id} &middot; ${new Date(d.timestamp).toLocaleString()}
      </p>
    </div>
  `;

  if (statusEl) {
    statusEl.innerHTML = html;
    // Re-enable deploy buttons
    document.querySelectorAll<HTMLButtonElement>(".deploy-btn").forEach((btn) => {
      btn.disabled = false;
      const env = btn.dataset.env!;
      btn.textContent = `Deploy to ${env.charAt(0).toUpperCase() + env.slice(1)}`;
    });
  } else {
    appEl.innerHTML = html;
  }
}

function handleAnyResult(result: AnyResult): void {
  const data = result.structuredContent as ViewData | undefined;
  if (!data) return;

  switch (data.view) {
    case "catalog":
      renderCatalog(data);
      break;
    case "detail":
      renderDetail(data);
      break;
    case "deploy-result":
      renderDeployResult(data);
      break;
    case "clusters":
      renderClusters(data);
      break;
    case "cluster-provision":
      renderClusterProvision(data);
      break;
    case "lambdas":
      renderLambdas(data);
      break;
    case "lambda-provision":
      renderLambdaProvision(data);
      break;
    case "agents":
      renderAgents(data);
      break;
    case "agent-provision":
      renderAgentProvision(data);
      break;
    case "cluster-form":
      renderClusterForm(data);
      break;
    case "lambda-form":
      renderLambdaForm(data);
      break;
    case "agent-form":
      renderAgentForm(data);
      break;
  }
}

// ─── Form renderers ────────────────────────────────────────────────────────

function renderClusterForm(data: ClusterFormData): void {
  appEl.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <h1>New EKS cluster</h1>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 18px;">
        Fill in the details. On submit, the MCP App will call <code>create-eks-cluster</code> via <code>app.callServerTool()</code>.
      </p>

      <form id="cluster-form" class="provision-form">
        <label class="form-field">
          <span class="form-label">Cluster name</span>
          <input type="text" name="name" required placeholder="platformops-eu" autocomplete="off" />
        </label>
        <label class="form-field">
          <span class="form-label">Region</span>
          <select name="region">
            ${data.regions.map((r) => `<option ${r === data.defaults.region ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Kubernetes version</span>
          <select name="version">
            ${data.versions.map((v) => `<option ${v === data.defaults.version ? "selected" : ""}>${v}</option>`).join("")}
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Instance type</span>
          <select name="instanceType">
            ${data.instanceTypes.map((t) => `<option ${t === data.defaults.instanceType ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Desired nodes</span>
          <input type="number" name="desiredNodes" min="1" max="32" value="${data.defaults.desiredNodes}" />
        </label>
        <div class="form-actions">
          <button type="submit" class="deploy-btn">Create cluster</button>
          <span class="form-status" id="form-status"></span>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById("cluster-form") as HTMLFormElement;
  const status = document.getElementById("form-status")!;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const args = {
      name: String(fd.get("name") ?? "").trim(),
      region: String(fd.get("region") ?? ""),
      version: String(fd.get("version") ?? ""),
      instanceType: String(fd.get("instanceType") ?? ""),
      desiredNodes: Number(fd.get("desiredNodes") ?? 3),
    };
    if (!args.name) return;
    status.textContent = "Provisioning…";
    status.classList.add("active");
    const submit = form.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    submit.disabled = true;
    const result = await app.callServerTool({
      name: "create-eks-cluster",
      arguments: args,
    });
    handleAnyResult(result);
  });
}

function renderLambdaForm(data: LambdaFormData): void {
  appEl.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <h1>New Lambda function</h1>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 18px;">
        Fill in the details. On submit the MCP App calls <code>create-lambda</code> through <code>app.callServerTool()</code>.
      </p>

      <form id="lambda-form" class="provision-form">
        <label class="form-field">
          <span class="form-label">Function name</span>
          <input type="text" name="name" required placeholder="order-webhook-handler" autocomplete="off" />
        </label>
        <label class="form-field">
          <span class="form-label">Runtime</span>
          <select name="runtime">
            ${data.runtimes.map((r) => `<option ${r === data.defaults.runtime ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Memory (MB)</span>
          <input type="number" name="memoryMb" min="128" max="10240" step="64" value="${data.defaults.memoryMb}" />
        </label>
        <label class="form-field">
          <span class="form-label">Timeout (seconds)</span>
          <input type="number" name="timeoutSeconds" min="1" max="900" value="${data.defaults.timeoutSeconds}" />
        </label>
        <label class="form-field">
          <span class="form-label">Trigger</span>
          <select name="trigger">
            ${data.triggers.map((t) => `<option ${t === data.defaults.trigger ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </label>
        <label class="form-field">
          <span class="form-label">Code source URL <span style="opacity: 0.5;">(optional)</span></span>
          <input type="url" name="codeUrl" placeholder="https://github.com/acme/order-webhook" autocomplete="off" />
        </label>
        <div class="form-actions">
          <button type="submit" class="deploy-btn">Create Lambda</button>
          <span class="form-status" id="form-status"></span>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById("lambda-form") as HTMLFormElement;
  const status = document.getElementById("form-status")!;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const args = {
      name: String(fd.get("name") ?? "").trim(),
      runtime: String(fd.get("runtime") ?? ""),
      memoryMb: Number(fd.get("memoryMb") ?? 512),
      timeoutSeconds: Number(fd.get("timeoutSeconds") ?? 30),
      trigger: String(fd.get("trigger") ?? "none"),
    };
    if (!args.name) return;
    status.textContent = "Provisioning…";
    status.classList.add("active");
    const submit = form.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    submit.disabled = true;
    const result = await app.callServerTool({
      name: "create-lambda",
      arguments: args,
    });
    handleAnyResult(result);
  });
}

function renderAgentForm(data: AgentFormData): void {
  appEl.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <h1>New AgentCore agent</h1>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 18px;">
        Pick a model and attach guardrails / knowledge bases. The MCP App will call <code>deploy-agentcore</code> with the values.
      </p>

      <form id="agent-form" class="provision-form">
        <label class="form-field">
          <span class="form-label">Agent name</span>
          <input type="text" name="name" required placeholder="support-triage-v2" autocomplete="off" />
        </label>
        <label class="form-field">
          <span class="form-label">Model</span>
          <select name="model">
            ${data.models.map((m) => `<option ${m === data.defaults.model ? "selected" : ""}>${m}</option>`).join("")}
          </select>
        </label>
        <fieldset class="form-field">
          <legend class="form-label">Guardrails</legend>
          <div class="checkbox-grid">
            ${data.availableGuardrails
              .map(
                (g) => `
              <label class="checkbox-row">
                <input type="checkbox" name="guardrails" value="${g}" />
                <span>${g}</span>
              </label>`,
              )
              .join("")}
          </div>
        </fieldset>
        <fieldset class="form-field">
          <legend class="form-label">Knowledge bases</legend>
          <div class="checkbox-grid">
            ${data.availableKnowledgeBases
              .map(
                (k) => `
              <label class="checkbox-row">
                <input type="checkbox" name="knowledgeBases" value="${k}" />
                <span>${k}</span>
              </label>`,
              )
              .join("")}
          </div>
        </fieldset>
        <div class="form-actions">
          <button type="submit" class="deploy-btn">Deploy agent</button>
          <span class="form-status" id="form-status"></span>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById("agent-form") as HTMLFormElement;
  const status = document.getElementById("form-status")!;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const guardrails = fd.getAll("guardrails").map((v) => String(v));
    const knowledgeBases = fd.getAll("knowledgeBases").map((v) => String(v));
    const args = {
      name: String(fd.get("name") ?? "").trim(),
      model: String(fd.get("model") ?? ""),
      guardrails,
      knowledgeBases,
    };
    if (!args.name) return;
    status.textContent = "Deploying…";
    status.classList.add("active");
    const submit = form.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    submit.disabled = true;
    const result = await app.callServerTool({
      name: "deploy-agentcore",
      arguments: args,
    });
    handleAnyResult(result);
  });
}

// ─── Renderers for cloud resource views ────────────────────────────────────

function renderClusters(data: ClustersData): void {
  const { clusters } = data;
  appEl.innerHTML = `
    <div class="catalog-header">
      <h1>EKS Clusters</h1>
      <p>${clusters.length} cluster${clusters.length === 1 ? "" : "s"}</p>
    </div>
    <div class="resource-list">
      ${clusters
        .map(
          (c) => `
        <div class="resource-row">
          <div class="resource-row-main">
            <div class="resource-row-name">${c.name}</div>
            <div class="resource-row-meta">${c.region} · k8s ${c.version} · ${c.podsRunning} pods · ${c.servicesAttached} services</div>
          </div>
          <div class="resource-row-side">
            <span class="health-badge ${c.status === "active" ? "healthy" : "degraded"}">${c.status}</span>
            <div class="resource-row-cost">$${c.costMonthUsd.toLocaleString()}/mo</div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function renderClusterProvision(data: ClusterProvisionData): void {
  const { cluster: c, phases } = data;
  appEl.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <h1>${c.name}</h1>
        <span class="health-badge healthy">${c.status}</span>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 18px;">
        Provisioned EKS cluster · ${c.region} · Kubernetes ${c.version}
      </p>

      <div class="detail-section">
        <h2>Provisioning steps</h2>
        <ol class="phase-list">
          ${phases
            .map(
              (p) => `
            <li>
              <span class="phase-check">✓</span>
              <span class="phase-name">${p.name}</span>
              <span class="phase-duration">${formatDuration(p.durationMs)}</span>
            </li>
          `,
            )
            .join("")}
        </ol>
      </div>

      <div class="detail-section">
        <h2>Node groups</h2>
        <div class="detail-grid">
          ${c.nodeGroups
            .map(
              (g) => `
            <div class="detail-item">
              <div class="detail-item-label">${g.name}</div>
              <div class="detail-item-value">${g.desired} × ${g.instanceType}</div>
              <div class="detail-item-foot">min ${g.min}, max ${g.max}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderLambdas(data: LambdasData): void {
  const { lambdas } = data;
  appEl.innerHTML = `
    <div class="catalog-header">
      <h1>Lambda Functions</h1>
      <p>${lambdas.length} function${lambdas.length === 1 ? "" : "s"}</p>
    </div>
    <div class="resource-list">
      ${lambdas
        .map(
          (l) => `
        <div class="resource-row">
          <div class="resource-row-main">
            <div class="resource-row-name">${l.name}</div>
            <div class="resource-row-meta">${l.runtime} · ${l.memoryMb}MB · ${l.invocations24h.toLocaleString()} inv/24h · p99 ${l.p99Ms}ms</div>
          </div>
          <div class="resource-row-side">
            <span class="health-badge ${l.errors24h === 0 ? "healthy" : l.errors24h < 50 ? "degraded" : "unhealthy"}">${l.errors24h} errors</span>
            <div class="resource-row-cost">$${l.costMonthUsd.toFixed(2)}/mo</div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function renderLambdaProvision(data: LambdaProvisionData): void {
  const { lambda: l, phases } = data;
  appEl.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <h1>${l.name}</h1>
        <span class="health-badge healthy">${l.status}</span>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 18px;">
        ${l.runtime} · ${l.memoryMb}MB · ${l.timeoutSeconds}s timeout · ${l.region}
      </p>

      <div class="detail-section">
        <h2>Provisioning steps</h2>
        <ol class="phase-list">
          ${phases
            .map(
              (p) => `
            <li>
              <span class="phase-check">✓</span>
              <span class="phase-name">${p.name}</span>
              <span class="phase-duration">${formatDuration(p.durationMs)}</span>
            </li>
          `,
            )
            .join("")}
        </ol>
      </div>

      ${
        l.triggers.length
          ? `
        <div class="detail-section">
          <h2>Triggers</h2>
          <div class="dep-list">
            ${l.triggers.map((t) => `<span class="dep-chip">${t}</span>`).join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `;
}

function renderAgents(data: AgentsData): void {
  const { agents } = data;
  appEl.innerHTML = `
    <div class="catalog-header">
      <h1>AgentCore Agents</h1>
      <p>${agents.length} agent${agents.length === 1 ? "" : "s"} deployed</p>
    </div>
    <div class="resource-list">
      ${agents
        .map(
          (a) => `
        <div class="resource-row">
          <div class="resource-row-main">
            <div class="resource-row-name">${a.name}</div>
            <div class="resource-row-meta">
              <span class="model-chip">${a.model}</span>
              · ${a.invocations24h} inv/24h · p50 ${a.avgLatencyMs}ms · err ${a.errorRate}%
            </div>
          </div>
          <div class="resource-row-side">
            <span class="health-badge ${a.status === "active" ? "healthy" : "degraded"}">${a.status}</span>
            <div class="resource-row-cost">$${a.costMonthUsd}/mo</div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function renderAgentProvision(data: AgentProvisionData): void {
  const { agent: a, phases } = data;
  appEl.innerHTML = `
    <div class="detail-view">
      <div class="detail-header">
        <h1>${a.name}</h1>
        <span class="health-badge healthy">${a.status}</span>
      </div>
      <p style="color: var(--color-text-secondary); margin-bottom: 18px;">
        Bedrock AgentCore · ${a.model} · ${a.region}
      </p>

      <div class="detail-section">
        <h2>Deployment steps</h2>
        <ol class="phase-list">
          ${phases
            .map(
              (p) => `
            <li>
              <span class="phase-check">✓</span>
              <span class="phase-name">${p.name}</span>
              <span class="phase-duration">${formatDuration(p.durationMs)}</span>
            </li>
          `,
            )
            .join("")}
        </ol>
      </div>

      ${
        a.guardrails.length
          ? `
        <div class="detail-section">
          <h2>Guardrails</h2>
          <div class="dep-list">
            ${a.guardrails.map((g) => `<span class="dep-chip">${g}</span>`).join("")}
          </div>
        </div>
      `
          : ""
      }

      ${
        a.knowledgeBases.length
          ? `
        <div class="detail-section">
          <h2>Knowledge bases</h2>
          <div class="dep-list">
            ${a.knowledgeBases.map((k) => `<span class="dep-chip">${k}</span>`).join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `;
}

function formatDuration(ms: number): string {
  if (ms === 0) return "instant";
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = s / 60;
  return `${m.toFixed(1)}m`;
}

// Event handlers
app.ontoolinput = () => {
  appEl.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
};

app.ontoolresult = (result) => {
  handleAnyResult(result as AnyResult);
};

app.onhostcontextchanged = (ctx) => {
  if (ctx.themeMode === "dark") {
    document.documentElement.style.colorScheme = "dark";
  } else if (ctx.themeMode === "light") {
    document.documentElement.style.colorScheme = "light";
  }
};

// Connect to host
await app.connect();
const hostCtx = app.getHostContext();
if (hostCtx?.themeMode) {
  document.documentElement.style.colorScheme = hostCtx.themeMode as string;
}
