"use client";

import { createCatalog } from "@copilotkit/a2ui-renderer";
import {
  PLATFORM_A2UI_CATALOG_ID,
  PLATFORM_CUSTOM_COMPONENTS,
} from "../lib/a2uiCatalogSpec";

export { PLATFORM_A2UI_CATALOG_ID };

const CHART_COLORS = [
  "#88C0D0",
  "#A3BE8C",
  "#EBCB8B",
  "#BF616A",
  "#B48EAD",
  "#81A1C1",
];

// Build catalog definitions from the shared spec so adding a new component
// in lib/a2uiCatalogSpec.ts automatically wires it into the React renderer.
// Only thing that lives here is the renderer function for each component.
export const platformCatalogDefinitions = Object.fromEntries(
  PLATFORM_CUSTOM_COMPONENTS.map((spec) => [
    spec.name,
    { description: spec.summary, props: spec.props as any },
  ]),
);

type PlatformChartProps = {
  title: string;
  subtitle?: string;
  type: "bar" | "line" | "stacked-bar" | "donut";
  unit?: string;
  series: Array<{
    label: string;
    value?: number;
    values?: number[];
    color?: string;
  }>;
  xLabels?: string[];
  caption?: string;
};

export const platformA2UICatalog = createCatalog(
  platformCatalogDefinitions as any,
  {
    PlatformChart: ({ props }: { props: PlatformChartProps }) => {
      // The basic A2UI renderer resolves `{ path: ... }` references only
      // for built-in components. For custom catalog entries (like ours),
      // nested path bindings inside arrays/objects arrive here unresolved
      // and crash React with "Objects are not valid as a React child".
      // Sanitize before spreading so the demo degrades gracefully and the
      // audience can see WHICH paths were unresolved.
      const { sanitized, unresolved } = sanitizeProps(props);
      if (unresolved.length > 0) {
        return (
          <UnresolvedPathsNotice
            title={asString(sanitized.title) || "Chart"}
            unresolved={unresolved}
          />
        );
      }
      return <PlatformChart {...(sanitized as PlatformChartProps)} />;
    },
  } as any,
  {
    catalogId: PLATFORM_A2UI_CATALOG_ID,
    includeBasicCatalog: true,
  },
);

/**
 * Walk a props tree and detect `{ path: "..." }` reference objects that the
 * A2UI runtime did not resolve. Returns:
 *  - `sanitized`: a copy with each unresolved path replaced by a safe
 *    primitive of the right shape (0 for numbers, "" for strings) so the
 *    chart can render at all
 *  - `unresolved`: the list of paths that weren't resolved, for telemetry
 *
 * This is a defensive guard, not a real path resolver — we don't have the
 * per-item data context here. The right long-term fix is for the agent to
 * either compute literal values at design time or for `createCatalog` to
 * deep-resolve nested bindings.
 */
function sanitizeProps(props: unknown): {
  sanitized: Record<string, unknown>;
  unresolved: string[];
} {
  const unresolved: string[] = [];

  function walk(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      const o = value as Record<string, unknown>;
      // The A2UI v0.9 path-reference shape is `{ path: <string> }` with no
      // other meaningful keys. Treat it as unresolved.
      if (typeof o.path === "string" && Object.keys(o).length === 1) {
        unresolved.push(o.path);
        return o.path; // a string the chart can degrade to
      }
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(o)) out[k] = walk(v);
      return out;
    }
    return value;
  }

  const sanitized = walk(props) as Record<string, unknown>;
  return { sanitized, unresolved };
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function UnresolvedPathsNotice({
  title,
  unresolved,
}: {
  title: string;
  unresolved: string[];
}) {
  const unique = Array.from(new Set(unresolved));
  return (
    <section className="rounded-xl border border-nord-warn/40 bg-nord-warn/5 p-5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-nord-warn mb-1">
        PlatformChart — bindings unresolved
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-xs opacity-70 mt-2 leading-relaxed">
        The chart could not render because the agent bound props to data paths
        that the renderer did not resolve. Custom catalog components like
        PlatformChart should receive literal values, not <code>{"{ path }"}</code>{" "}
        references.
      </p>
      <ul className="mt-3 text-[11px] font-mono opacity-80 space-y-0.5">
        {unique.map((p) => (
          <li key={p}>· {p}</li>
        ))}
      </ul>
    </section>
  );
}

function PlatformChart({
  title,
  subtitle,
  type,
  unit,
  series,
  xLabels,
  caption,
}: PlatformChartProps) {
  const formatVal = (v: number) =>
    `${unit === "$" ? "$" : ""}${v.toLocaleString()}${unit && unit !== "$" ? unit : ""}`;

  return (
    <section className="rounded-xl border border-nord-frost2/30 bg-nord-0/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-nord-frost2 mb-1">
            PlatformChart
          </div>
          <h3 className="text-lg font-semibold tracking-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-nord-4 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-[0.16em] px-2 py-1 rounded bg-nord-ok/10 text-nord-ok border border-nord-ok/20">
          A2UI
        </span>
      </div>

      <div className="mt-5">
        {type === "bar" && (
          <A2UIBarChart series={series} format={formatVal} />
        )}
        {type === "line" && (
          <A2UILineChart
            series={series}
            xLabels={xLabels}
            format={formatVal}
          />
        )}
        {type === "stacked-bar" && (
          <A2UIStackedBarChart
            series={series}
            xLabels={xLabels}
            format={formatVal}
          />
        )}
        {type === "donut" && (
          <A2UIDonutChart series={series} format={formatVal} />
        )}
      </div>

      {caption && (
        <p className="mt-4 border-t border-nord-2/70 pt-3 text-[11px] leading-relaxed text-nord-4">
          {caption}
        </p>
      )}
    </section>
  );
}

function A2UIBarChart({
  series,
  format,
}: {
  series: PlatformChartProps["series"];
  format: (v: number) => string;
}) {
  const max = Math.max(...series.map((s) => s.value ?? 0), 1);

  return (
    <div className="space-y-3">
      {series.map((s, i) => {
        const value = s.value ?? 0;
        const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
        return (
          <div key={`${s.label}-${i}`} className="grid grid-cols-[8rem_1fr_4rem] items-center gap-3 text-xs">
            <div className="truncate text-nord-4">{s.label}</div>
            <div className="h-7 overflow-hidden rounded bg-nord-2/50">
              <div
                className="h-full rounded"
                style={{
                  width: `${(value / max) * 100}%`,
                  background: color,
                }}
              />
            </div>
            <div className="text-right font-mono text-nord-6">
              {format(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function A2UILineChart({
  series,
  xLabels,
  format,
}: {
  series: PlatformChartProps["series"];
  xLabels?: string[];
  format: (v: number) => string;
}) {
  const width = 640;
  const height = 220;
  const pad = 40;
  const allValues = series.flatMap((s) => s.values ?? []);
  const max = Math.max(...allValues, 1);
  const xCount = Math.max(...series.map((s) => s.values?.length ?? 0), 1);
  const xStep = (width - pad * 2) / Math.max(xCount - 1, 1);
  const yFor = (v: number) => height - pad - (v / max) * (height - pad * 2);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {[0, 0.5, 1].map((p) => {
          const y = height - pad - p * (height - pad * 2);
          return (
            <g key={p}>
              <line
                x1={pad}
                x2={width - pad}
                y1={y}
                y2={y}
                stroke="#434C5E"
                strokeWidth={1}
                opacity={0.45}
              />
              <text x={4} y={y + 4} fill="#D8DEE9" fontSize={10} opacity={0.62}>
                {format(max * p)}
              </text>
            </g>
          );
        })}
        {xLabels?.map((label, i) => (
          <text
            key={`${label}-${i}`}
            x={pad + i * xStep}
            y={height - 10}
            fill="#D8DEE9"
            fontSize={10}
            opacity={0.62}
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
        {series.map((s, i) => {
          if (!s.values?.length) return null;
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          const points = s.values
            .map((v, j) => `${j === 0 ? "M" : "L"} ${(pad + j * xStep).toFixed(1)} ${yFor(v).toFixed(1)}`)
            .join(" ");
          return (
            <g key={`${s.label}-${i}`}>
              <path d={points} fill="none" stroke={color} strokeWidth={2.5} />
              {s.values.map((v, j) => (
                <circle
                  key={j}
                  cx={pad + j * xStep}
                  cy={yFor(v)}
                  r={3}
                  fill={color}
                  stroke="#2E3440"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <ChartLegend series={series} />
    </div>
  );
}

function A2UIStackedBarChart({
  series,
  xLabels,
  format,
}: {
  series: PlatformChartProps["series"];
  xLabels?: string[];
  format: (v: number) => string;
}) {
  const xCount = Math.max(...series.map((s) => s.values?.length ?? 0), 1);
  const stacks = Array.from({ length: xCount }, (_, i) =>
    series.map((s) => ({
      label: s.label,
      value: s.values?.[i] ?? 0,
      color: s.color,
    })),
  );
  const totals = stacks.map((stack) =>
    stack.reduce((sum, item) => sum + item.value, 0),
  );
  const max = Math.max(...totals, 1);

  return (
    <div>
      <div className="flex h-52 items-end gap-3">
        {stacks.map((stack, i) => {
          const total = totals[i];
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
              <div className="mb-1 text-[10px] font-mono text-nord-4">
                {format(total)}
              </div>
              <div
                className="flex w-full flex-col-reverse overflow-hidden rounded bg-nord-2/40"
                style={{ height: `${(total / max) * 100}%` }}
              >
                {stack.map((segment, j) => (
                  <div
                    key={`${segment.label}-${j}`}
                    title={`${segment.label}: ${format(segment.value)}`}
                    style={{
                      height: `${total ? (segment.value / total) * 100 : 0}%`,
                      background:
                        segment.color ?? CHART_COLORS[j % CHART_COLORS.length],
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 max-w-16 truncate text-[10px] text-nord-4">
                {xLabels?.[i] ?? `#${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>
      <ChartLegend series={series} />
    </div>
  );
}

function A2UIDonutChart({
  series,
  format,
}: {
  series: PlatformChartProps["series"];
  format: (v: number) => string;
}) {
  const total = series.reduce((sum, s) => sum + (s.value ?? 0), 0);
  let cursor = 0;
  const gradient = series
    .map((s, i) => {
      const value = s.value ?? 0;
      const start = total ? (cursor / total) * 100 : 0;
      cursor += value;
      const end = total ? (cursor / total) * 100 : 0;
      const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
      return `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    })
    .join(", ");

  return (
    <div className="grid gap-5 md:grid-cols-[13rem_1fr] md:items-center">
      <div
        className="relative mx-auto h-48 w-48 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-nord-0 text-center">
          <div className="text-[10px] uppercase tracking-[0.18em] text-nord-4">
            Total
          </div>
          <div className="font-mono text-lg font-semibold text-nord-6">
            {format(total)}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {series.map((s, i) => {
          const value = s.value ?? 0;
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length];
          return (
            <div key={`${s.label}-${i}`} className="flex items-center gap-3 text-xs">
              <span
                className="h-3 w-3 flex-shrink-0 rounded-sm"
                style={{ background: color }}
              />
              <span className="min-w-0 flex-1 truncate text-nord-4">
                {s.label}
              </span>
              <span className="font-mono text-nord-6">{format(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({ series }: { series: PlatformChartProps["series"] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {series.map((s, i) => (
        <div key={`${s.label}-${i}`} className="flex min-w-0 items-center gap-2">
          <span
            className="h-3 w-3 flex-shrink-0 rounded-sm"
            style={{ background: s.color ?? CHART_COLORS[i % CHART_COLORS.length] }}
          />
          <span className="truncate text-nord-4">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
