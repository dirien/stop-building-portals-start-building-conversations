import { defineTool } from "@copilotkit/runtime/v2";
import Anthropic from "@anthropic-ai/sdk";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { z } from "zod";
import {
  PLATFORM_A2UI_CATALOG_ID as SHARED_CATALOG_ID,
  toDesignerCatalogText,
} from "../../../lib/a2uiCatalogSpec";

/**
 * Canonical `generate_a2ui` tool — mirrors the pattern from CopilotKit's
 * showcase `a2ui-factory.ts`. The primary agent never has to think about
 * A2UI structure; it just describes the surface it wants. A secondary
 * Anthropic call (forced into JSON-only mode) emits a strict
 * `{ surfaceId, catalogId, components, data }` object, which this tool
 * wraps as a v0.9 `a2ui_operations` container (createSurface +
 * updateComponents + updateDataModel).
 *
 * The A2UIMiddleware is configured with `injectA2UITool: false` and
 * `a2uiToolNames: ["generate_a2ui"]` so it tracks THIS tool's results and
 * emits ACTIVITY_SNAPSHOT events to the frontend renderer.
 *
 * Why this exists instead of leaving render_a2ui to the primary LLM:
 * - Forcing data + components into separate JSON keys at the schema level
 *   makes hardcoding values into components impossible.
 * - The secondary LLM's whole job is structured A2UI output, so it does
 *   not get distracted by audit narration, tool routing, or governance.
 */

const PLATFORM_A2UI_CATALOG_ID = SHARED_CATALOG_ID;

const SECONDARY_SYSTEM_PROMPT = `You are an A2UI v0.9 component designer for PlatformOps, an internal developer portal.

You MUST respond by calling the \`emit_a2ui_design\` tool with the structured surface design. Never reply with plain text — always invoke the tool.

A2UI v0.9 FLAT FORMAT — every single component object you emit MUST have BOTH:
  - "id": unique string identifier
  - "component": the catalog component name as a string (e.g. "Card", "Column", "Text", "Button")

All other properties go alongside as TOP-LEVEL keys on the same object. NEVER nest props under the component name. EVERY component, including the root, follows this shape.

VALID v0.9 (use this):
  { "id": "root",      "component": "Card",   "child": "main" }
  { "id": "main",      "component": "Column", "children": ["title", "body"] }
  { "id": "title",     "component": "Text",   "text": { "path": "/title" }, "variant": "h3" }
  { "id": "body",      "component": "Text",   "text": { "path": "/body" } }

INVALID v0.8 nested (NEVER emit this — it causes "Cannot create component root without a type"):
  { "id": "root", "Card": { "child": "main" } }            // missing "component" field
  { "id": "root", "child": "main" }                        // missing "component" field
  { "id": "root", "type": "Card", "child": "main" }        // "type" is wrong, must be "component"

Exactly ONE component must have id="root" — it is the entry point.

A2UI DATA-MODEL DISCIPLINE — non-negotiable:
1. Components describe SHAPE. The data model holds VALUES. Components reference values via path bindings:
     - Text content:  text: { "path": "/key" }
     - Icon name:     name: { "path": "/key" }
     - Repeated list children: children: { "componentId": "row-template", "path": "/items" }
     - Button action context:  action: { event: { name, context: { prompt: { "path": "prompt" } } } }
     - TextField text: text: { "path": "/form/name" }
2. NEVER hardcode user-facing values (resource ids, metrics, names, status messages) into component fields. They go in "data".
3. Static labels that NEVER change ("Day 1 — Provision", "Readiness checks") MAY be literals; everything else binds to data.
4. For a list of similar items, write ONE template component and use \`children: { componentId, path: "/yourArray" }\`. Inside the template, paths are RELATIVE to the current item (e.g. { "path": "label" } reads items[i].label).

${toDesignerCatalogText()}

Icon names (only these): check, close, info, warning, error, favorite, refresh, settings, person, mail, calendarToday, home, lock, search, send, share, star, upload, download, visibility, edit.

For self-service buttons: event name is "self_service_action" and context.prompt is a path binding ({ "path": "prompt" }) to the per-item prompt field.

The catalogId field MUST be exactly "${PLATFORM_A2UI_CATALOG_ID}".`;

/**
 * Anthropic input-schema for the secondary tool call. Enforces v0.9 flat
 * format at the schema level: every component MUST have `id` + `component`
 * fields. The model physically cannot return a malformed root.
 */
const EMIT_A2UI_DESIGN_TOOL: Tool = {
  name: "emit_a2ui_design",
  description:
    "Emit the A2UI v0.9 surface design. The runtime expands this into createSurface + updateComponents + updateDataModel operations. Every component must include both `id` and `component` (the catalog component type as a string).",
  input_schema: {
    type: "object",
    required: ["surfaceId", "catalogId", "components", "data"],
    properties: {
      surfaceId: {
        type: "string",
        description:
          "Short kebab-case identifier, e.g. 'deploy-readiness', 'self-service-actions', 'slo-metrics'.",
      },
      catalogId: {
        type: "string",
        description: `Must be exactly '${PLATFORM_A2UI_CATALOG_ID}'.`,
      },
      components: {
        type: "array",
        minItems: 1,
        description:
          "Flat A2UI v0.9 component array. Exactly one item must have id='root'.",
        items: {
          type: "object",
          required: ["id", "component"],
          properties: {
            id: { type: "string", minLength: 1 },
            component: {
              type: "string",
              description:
                "Catalog component name: Card, Column, Row, List, Divider, Text, Icon, Image, Video, AudioPlayer, Button, TextField, CheckBox, Slider, ChoicePicker, DateTimeInput, PlatformChart.",
            },
          },
          additionalProperties: true,
        },
      },
      data: {
        type: "object",
        description:
          "JSON document the components bind to via path references. Can be {} for static layouts.",
        additionalProperties: true,
      },
    },
    additionalProperties: false,
  },
};

type A2UIDesign = {
  surfaceId?: string;
  catalogId?: string;
  components?: unknown[];
  data?: Record<string, unknown>;
};

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Build the v0.9 a2ui_operations container the middleware unpacks into
 * ACTIVITY_SNAPSHOT events.
 */
function buildOperations(design: A2UIDesign) {
  const surfaceId = design.surfaceId?.trim() || "dynamic-surface";
  const catalogId = design.catalogId?.trim() || PLATFORM_A2UI_CATALOG_ID;
  const components = Array.isArray(design.components) ? design.components : [];
  const data = design.data ?? {};

  const ops: unknown[] = [
    { version: "v0.9", createSurface: { surfaceId, catalogId } },
    { version: "v0.9", updateComponents: { surfaceId, components } },
  ];
  // Always emit updateDataModel — even when empty — so the frontend
  // Source view never falls into the "agent hardcoded values" warning
  // path for a legitimately static surface.
  ops.push({
    version: "v0.9",
    updateDataModel: { surfaceId, path: "/", value: data },
  });
  return { a2ui_operations: ops };
}

export const generateA2uiTool = defineTool({
  name: "generate_a2ui",
  description:
    "Render a polished A2UI v0.9 surface in the dashboard canvas. Use this for any agent-composed work surface: deploy-readiness checklists, SLO cards, Day 1 / Day 2 self-service boards, cost summary cards, runbook cards, ownership cards, health comparisons. " +
    "REQUIRED WORKFLOW: BEFORE calling this tool, you MUST call the relevant data tools first (cost-breakdown, service-metrics, list-deployments, get-runbook, get-oncall, list-audit-events, policy-status, show-service) and pass their results in the `data` argument. The secondary A2UI designer renders SHAPE only — it has no access to your tools and CANNOT fetch data itself. Calling generate_a2ui with empty or invented data produces a surface bound to non-existent paths, which fails to render. " +
    "For self-service boards, the `data` object IS your action list — populate { title, day1Actions: [{label, prompt}, ...], day2Actions: [{label, prompt}, ...] } from the action catalogue in your system prompt. " +
    "Do NOT use this tool for live operational actions (use deploy-streaming / stream-action) or for catalog pages (use the MCP App tools).",
  parameters: z.object({
    brief: z
      .string()
      .min(8)
      .describe(
        "One- or two-sentence description of what the surface should communicate. Example: 'Deploy readiness for payment-api: Go verdict, SLO + recent deploys + on-call + dependency status as a checklist.' or 'Self-service Day 1 / Day 2 board for payment-api scoped to the Payments Platform team.'",
      ),
    data: z
      .record(z.string(), z.unknown())
      .describe(
        "REQUIRED. Structured data the surface should bind to. Pre-pull this from the relevant data tools and pass the merged object here. The secondary designer composes path bindings (e.g. { path: '/metrics/sloCurrentPct' }) that read values out of THIS object. Examples: deploy readiness → { service: 'payment-api', verdict: 'Go', metrics: {...}, deployments: [...], oncall: {...}, dependencies: [...] }; self-service → { title: '...', day1Actions: [{label, prompt}, ...], day2Actions: [...] }; cost summary → { groupBy: 'team', items: [...] }. NEVER pass an empty object — if you have nothing to bind to, you skipped the data-fetching step.",
      ),
    surfaceId: z
      .string()
      .optional()
      .describe(
        "Short kebab-case id for the surface. Recommended: 'deploy-readiness', 'self-service-actions', 'slo-metrics', 'cost-summary', 'runbook', 'ownership'. Defaults to 'dynamic-surface' if omitted.",
      ),
  }),
  execute: async ({ brief, data, surfaceId }) => {
    // Guardrail: empty/missing data almost always means the agent skipped
    // its data-fetching step. Refuse with an instructive error rather than
    // letting the secondary designer hallucinate values.
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return {
        a2ui_operations: [],
        error:
          "generate_a2ui was called with empty `data`. You MUST fetch the relevant data from the platform data tools (cost-breakdown, service-metrics, list-deployments, get-runbook, get-oncall, list-audit-events, policy-status, show-service) FIRST and pass their merged results as `data`. Path bindings in the rendered components read from this object — without it, the surface is empty.",
      };
    }
    const userPrompt = [
      `Brief: ${brief}`,
      surfaceId ? `Preferred surfaceId: ${surfaceId}` : null,
      data && Object.keys(data).length > 0
        ? `Pre-pulled data (rearrange for clean path bindings, then put the result in the design's "data" field):\n${JSON.stringify(data, null, 2)}`
        : null,
      "",
      "Call emit_a2ui_design now with the full surface design.",
    ]
      .filter(Boolean)
      .join("\n\n");

    let design: A2UIDesign;
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: SECONDARY_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
        tools: [EMIT_A2UI_DESIGN_TOOL],
        // Force the designer to call the tool — guarantees structured
        // output that matches the input_schema. Without this Claude could
        // reply with plain text and the parse step would have to guess.
        tool_choice: { type: "tool", name: "emit_a2ui_design" },
      });

      const toolUse = response.content.find((b) => b.type === "tool_use");
      if (!toolUse || !("input" in toolUse)) {
        return {
          a2ui_operations: [],
          error:
            "Secondary A2UI designer did not invoke emit_a2ui_design. Got: " +
            response.content.map((b) => b.type).join(", "),
        };
      }
      design = toolUse.input as A2UIDesign;
    } catch (err) {
      return {
        a2ui_operations: [],
        error: `Secondary A2UI designer call failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    if (surfaceId && !design.surfaceId) {
      design.surfaceId = surfaceId;
    }

    const validationError = validateDesign(design);
    if (validationError) {
      return {
        a2ui_operations: [],
        error: validationError,
        // Surface what we got back so the Source view can show the bad
        // shape; better than a silent empty surface.
        bad_design: design,
      };
    }

    return buildOperations(design);
  },
});

/**
 * Last-line-of-defense validator. Even with input_schema enforced by the
 * Anthropic tool API, double-check the v0.9 shape — specifically that the
 * root component exists and has both `id` and `component`. This is the
 * exact precondition the A2UI renderer asserts ("Cannot create component
 * root without a type").
 */
function validateDesign(design: A2UIDesign): string | null {
  if (!Array.isArray(design.components) || design.components.length === 0) {
    return "Design has no components.";
  }
  const root = design.components.find(
    (c): c is Record<string, unknown> =>
      typeof c === "object" && c !== null && (c as Record<string, unknown>).id === "root",
  );
  if (!root) {
    return "Design is missing a root component (id='root').";
  }
  if (typeof root.component !== "string" || root.component.length === 0) {
    return `Root component is missing the 'component' field (v0.9 flat format requires { id: 'root', component: '<Type>', ... }). Got root keys: ${Object.keys(root).join(", ")}.`;
  }
  for (const c of design.components) {
    if (typeof c !== "object" || c === null) {
      return "components[] contains a non-object entry.";
    }
    const co = c as Record<string, unknown>;
    if (typeof co.id !== "string" || co.id.length === 0) {
      return `A component is missing 'id'. Offender: ${JSON.stringify(c).slice(0, 200)}`;
    }
    if (typeof co.component !== "string" || co.component.length === 0) {
      return `Component '${co.id}' is missing the 'component' field (v0.9 flat format). Got keys: ${Object.keys(co).join(", ")}.`;
    }
  }
  return null;
}
