import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_SERVER_URL = process.env.MCP_SERVER_URL ?? "http://localhost:3001/mcp";

/**
 * Proxy for MCP `resources/read`.
 *
 * The CopilotKit MCP Apps middleware also supports proxied requests through
 * the agent runtime, but for the canvas iframe (rendered outside the chat),
 * a dedicated server route is simpler and still goes through MCP.
 */
export async function GET(request: Request) {
  const uri = new URL(request.url).searchParams.get("uri");
  if (!uri) return new Response("Missing uri query param", { status: 400 });

  const client = new Client(
    { name: "copilotkit-canvas-resource", version: "1.0.0" },
    { capabilities: {} },
  );
  const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));

  try {
    await client.connect(transport);
    const result = await client.readResource({ uri });
    const first = result.contents[0];
    if (!first || !("text" in first) || typeof first.text !== "string") {
      return new Response("Resource has no text content", { status: 404 });
    }
    return new Response(first.text, {
      headers: {
        "Content-Type":
          (first.mimeType as string | undefined) ?? "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(
      `MCP resource read failed: ${err instanceof Error ? err.message : String(err)}`,
      { status: 502 },
    );
  } finally {
    await client.close().catch(() => {});
  }
}
