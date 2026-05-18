// OpenUI by Thesys — Token-efficient component rendering
import { defineComponent, createLibrary } from "@openuidev/react-lang";
import { z } from "zod";

// Platform team defines components with Zod schemas
const ServiceCard = defineComponent({
  name: "ServiceCard",
  props: z.object({
    name: z.string(),
    health: z.enum(["healthy", "degraded", "unhealthy"]),
    team: z.string(),
  }),
  description: "Displays a platform service with its health status",
  component: ({ props }) => (
    <div className={`card ${props.health}`}>
      <h3>{props.name}</h3>
      <span>{props.team}</span>
    </div>
  ),
});

// Bundle into a library — auto-generates LLM system prompts
const platformLibrary = createLibrary({
  components: [ServiceCard],
  root: "ServiceCard",
});
// platformLibrary.prompt → ready-to-use system prompt for the LLM

// LLM generates compact OpenUI Lang (~40 tokens):
// <ServiceCard name="Payment API" health="healthy" team="Commerce" />

// vs. raw HTML generation (~2000 tokens):
// <div class="card healthy"><h3>Payment API</h3>...
