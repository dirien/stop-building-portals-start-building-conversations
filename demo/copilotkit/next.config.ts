import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Pin the tracing root so Next doesn't pick up /demo/package-lock.json.
  outputFileTracingRoot: path.join(__dirname),
  env: {
    MCP_SERVER_URL: process.env.MCP_SERVER_URL ?? "http://localhost:3001/mcp",
  },
};

export default nextConfig;
