/**
 * Single source of truth for the PlatformOps A2UI catalog.
 *
 * Three consumers need to agree on what components exist and how their
 * props are shaped:
 *
 *   1. The React renderer (`components/platformA2UICatalog.tsx`) needs the
 *      zod schemas + React renderers to mount the catalog client-side.
 *   2. The A2UIMiddleware (`route.ts`) needs an inline JSON-ish schema in
 *      the form `{ catalogId, components: { Name: { summary } } }` to
 *      inject into the agent's context as a system-prompt addendum.
 *   3. The secondary A2UI designer (`a2uiGenerateTool.ts`) needs a
 *      human-readable catalog reference inside its own system prompt so
 *      it knows what component names to emit.
 *
 * This file owns the spec and exposes both derivation helpers. Update one
 * place; all three sides stay in sync.
 *
 * IMPORTANT: This module MUST NOT import React or `@copilotkit/a2ui-renderer`.
 * Both consumers (route.ts and a2uiGenerateTool.ts) run in the Node.js
 * server runtime, where pulling DOM-dependent code breaks the request
 * handlers. Zod is fine on both sides.
 */

import { z, type ZodTypeAny } from "zod/v3";

export const PLATFORM_A2UI_CATALOG_ID =
  "https://platformops.dev/a2ui/catalog/v0_9";

// ─── Shared schemas ──────────────────────────────────────────────────────

const chartSeriesSchema = z.object({
  label: z.string(),
  value: z.number().optional(),
  values: z.array(z.number()).optional(),
  color: z.string().optional(),
});

// ─── Spec for the CUSTOM components only ─────────────────────────────────
//
// The basic A2UI v0.9 catalog (Card, Column, Row, Text, Button, Icon, …)
// is owned by `@a2ui/web_core` and re-listed in the designer prompt for
// reference — we never need to re-implement those. This spec only carries
// the PlatformOps-specific additions.

export interface CustomComponentSpec {
  /** Component name as it appears in `component: "..."`. */
  name: string;
  /** One-line summary for the middleware schema + designer prompt. */
  summary: string;
  /** Zod schema for prop validation; also seeded into the React renderer. */
  props: ZodTypeAny;
  /**
   * Optional rendering caveats the secondary designer must follow.
   * Echoed verbatim into the designer system prompt under the component.
   */
  caveats?: string[];
}

export const PLATFORM_CUSTOM_COMPONENTS: CustomComponentSpec[] = [
  {
    name: "PlatformChart",
    summary:
      "A polished PlatformOps chart for A2UI surfaces. props: title (string), subtitle? (string), type: bar|line|stacked-bar|donut, unit? (string), series: [{label, value?, values?, color?}], xLabels? (string[]), caption? (string). Use for cost breakdowns, deploy frequency, SLO burn, invocation trends, and service health comparisons.",
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      type: z.enum(["bar", "line", "stacked-bar", "donut"]).default("bar"),
      unit: z.string().optional(),
      series: z.array(chartSeriesSchema).min(1),
      xLabels: z.array(z.string()).optional(),
      caption: z.string().optional(),
    }),
    caveats: [
      "PlatformChart is a custom catalog component. ALL of its props (title, unit, series, xLabels, caption, and every nested value inside series) MUST be LITERAL values, NEVER `{ path }` references. The A2UI framework only resolves path bindings for built-in components.",
      "If you want a chart per item in a list, COMPUTE the chart series at design time and emit ONE PlatformChart per item with literal numbers inline. Do NOT use `children: { componentId: 'chart-template', path: '/items' }` to template a chart.",
    ],
  },
];

// ─── Derivation: middleware schema (A2UIMiddleware({ schema })) ──────────

interface MiddlewareInlineSchema {
  catalogId: string;
  components: Record<string, { summary: string }>;
}

/**
 * Build the inline schema that A2UIMiddleware injects as context entry
 * "A2UI Component Schema". The middleware reads `components[name].summary`
 * (and ignores everything else), so we keep the shape minimal. The basic
 * A2UI v0.9 components are listed here too because the middleware does NOT
 * automatically include them — the agent only sees what we declare.
 */
export function toMiddlewareSchema(): MiddlewareInlineSchema {
  const components: Record<string, { summary: string }> = {
    // Basic A2UI v0.9 catalog (mirrored from @a2ui/web_core/v0_9).
    Text: { summary: "A run of text. props: text (string|{path}), variant?: h1|h2|h3|h4|h5|caption|body" },
    Image: { summary: "An image. props: url (string|{path}), fit?: contain|cover|fill" },
    Icon: {
      summary:
        "A Material Symbols icon. props: name (string). Valid: check, close, info, warning, error, favorite, refresh, settings, person, mail, calendarToday, home, lock, search, send, share, star, upload, download, visibility, edit.",
    },
    Video: { summary: "A video player. props: url" },
    AudioPlayer: { summary: "An audio player. props: url, description?" },
    Divider: { summary: "A divider line. props: axis?: horizontal|vertical" },
    Row: {
      summary:
        "A horizontal layout. props: children: string[] (component ids), justify?, align?",
    },
    Column: {
      summary:
        "A vertical layout. props: children: string[] (component ids), justify?, align?",
    },
    List: {
      summary:
        "A vertical or horizontal list. props: children: string[], direction?: vertical|horizontal",
    },
    Card: { summary: "A card container. props: child: string (one component id)" },
    Tabs: { summary: "Tabbed pages. props: tabItems: [{title, child}]" },
    Modal: { summary: "A modal. props: entryPointChild, contentChild" },
    Button: {
      summary:
        "A clickable button. props: child (text component id), action: {event:{name, context?}}, variant?: primary|secondary|text",
    },
    TextField: {
      summary:
        "A text input. props: label, text?, textFieldType?: shortText|longText|number|date|obscured",
    },
    CheckBox: { summary: "A checkbox. props: label, checked?" },
    Slider: { summary: "A numeric slider. props: value, minValue?, maxValue?" },
    ChoicePicker: {
      summary: "A dropdown / picker. props: selections, options: [{label, value}]",
    },
    DateTimeInput: {
      summary:
        "A date/time input. props: value, enableDate?, enableTime?",
    },
  };

  for (const spec of PLATFORM_CUSTOM_COMPONENTS) {
    components[spec.name] = { summary: spec.summary };
  }

  return {
    catalogId: PLATFORM_A2UI_CATALOG_ID,
    components,
  };
}

// ─── Derivation: designer system-prompt catalog block ────────────────────

/**
 * Build the catalog reference block the secondary A2UI designer's system
 * prompt embeds. Keeps the basic catalog summary stable while letting
 * `PLATFORM_CUSTOM_COMPONENTS` drive the custom additions, including any
 * caveats authored alongside each component.
 */
export function toDesignerCatalogText(): string {
  const basic = [
    "Catalog (only these component names are valid):",
    "  - Layout: Card { child }, Column { children, justify, align }, Row { children, justify, align }, List { children, direction }, Divider { axis }",
    "  - Content: Text { text, variant: h1|h2|h3|h4|h5|caption|body }, Icon { name }, Image { url, fit }, Video { url }, AudioPlayer { url, description }",
    "  - Interactive: Button { child, action: { event: { name, context } }, variant: primary|secondary|text }, TextField { label, text, textFieldType }, CheckBox { label, checked }, Slider { value, minValue, maxValue }, ChoicePicker { selections, options }, DateTimeInput { value, enableDate, enableTime }",
  ].join("\n");

  const customLines: string[] = [];
  for (const spec of PLATFORM_CUSTOM_COMPONENTS) {
    customLines.push(`  - Custom: ${spec.name} ${describeShape(spec.props)}`);
    customLines.push(`      ${spec.summary}`);
    for (const caveat of spec.caveats ?? []) {
      customLines.push(`      ⚠ ${caveat}`);
    }
  }

  return [basic, ...customLines].join("\n");
}

/**
 * Produce a tiny human-readable shape hint from a zod object schema.
 * Walks one level deep — that's enough for the designer to know the prop
 * names without reading the full schema serialization.
 */
function describeShape(schema: ZodTypeAny): string {
  const def = (schema as unknown as { _def?: { typeName?: string } })._def;
  if (def?.typeName !== "ZodObject") return "{ ... }";
  const shapeAccessor = (
    schema as unknown as {
      _def: { shape: () => Record<string, ZodTypeAny> };
    }
  )._def.shape;
  const shape =
    typeof shapeAccessor === "function" ? shapeAccessor() : ({} as Record<string, ZodTypeAny>);
  const keys = Object.keys(shape);
  if (keys.length === 0) return "{}";
  const summary = keys
    .map((k) => {
      const isOptional =
        (shape[k] as unknown as { isOptional?: () => boolean }).isOptional?.() ?? false;
      return isOptional ? `${k}?` : k;
    })
    .join(", ");
  return `{ ${summary} }`;
}
