import { App } from "@/components/App";

// CopilotKit registers actions at module load. Skip prerender so the LLM-bound
// runtime only initializes when a real request comes in.
export const dynamic = "force-dynamic";

export default function Home() {
  return <App />;
}
