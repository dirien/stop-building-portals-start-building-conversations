// json-render by Vercel Labs — Cross-platform streaming UI
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry, Renderer } from "@json-render/react";
import { z } from "zod";

// Step 1: Define a catalog with Zod schemas
const catalog = defineCatalog(schema, {
  components: {
    ServiceStatus: {
      props: z.object({
        name: z.string(),
        status: z.enum(["running", "stopped", "error"]),
        replicas: z.number(),
      }),
      description: "Displays a platform service status card",
    },
  },
  actions: {
    deploy: {
      params: z.object({ serviceId: z.string() }),
    },
  },
});

// Step 2: Map catalog to React components
const { registry } = defineRegistry(catalog, {
  components: {
    ServiceStatus: ({ props }) => (
      <div className="service-card">
        <h3>{props.name}</h3>
        <span>{props.status} — {props.replicas} replicas</span>
      </div>
    ),
  },
  actions: { deploy: async (p) => console.log("Deploy:", p.serviceId) },
});

// Step 3: LLM generates a JSON spec
const spec = {
  root: "s1",
  elements: {
    s1: {
      type: "ServiceStatus",
      props: { name: "API Gateway", status: "running", replicas: 4 },
      children: [],
    },
  },
};
// <Renderer spec={spec} registry={registry} />
// Renders on React, React Native, email, PDF — any target
