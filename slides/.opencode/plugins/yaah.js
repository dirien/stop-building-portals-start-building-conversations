import { execFileSync } from "node:child_process";

// Map OpenCode camelCase args to yaah snake_case tool_input.
function toYaahInput(toolName, args) {
  const mapped = {};
  if (args) {
    for (const [k, v] of Object.entries(args)) {
      mapped[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
    }
  }
  return { tool_name: toolName, tool_input: mapped };
}

// Cache tool args from before hooks so after hooks can access them.
const pendingCalls = new Map();

export const YaahPlugin = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      pendingCalls.set(input.tool + ":" + Date.now(), output.args);
      try {
        execFileSync("yaah", ["hook", "PreToolUse"], {
          input: JSON.stringify(toYaahInput(input.tool, output.args)),
          cwd: ctx.directory,
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (e) {
        if (e.status === 2) throw new Error(e.stderr?.toString() || "blocked by yaah");
      }
    },
    "tool.execute.after": async (input) => {
      // Clean up pending cache for this tool.
      for (const [key] of pendingCalls) {
        if (key.startsWith(input.tool + ":")) {
          pendingCalls.delete(key);
          break;
        }
      }
      // Wait for file to be flushed to disk before linting.
      await new Promise((r) => setTimeout(r, 150));
      try {
        execFileSync("yaah", ["hook", "PostToolUse"], {
          input: JSON.stringify(toYaahInput(input.tool, input.args || {})),
          cwd: ctx.directory,
          stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (e) {
        throw new Error(e.stderr?.toString() || "blocked by yaah");
      }
    },
    event: async ({ event }) => {
      if (event.type === "session.created") {
        try {
          execFileSync("yaah", ["hook", "SessionStart"], {
            cwd: ctx.directory,
            stdio: ["pipe", "pipe", "pipe"],
          });
        } catch (e) {
          /* non-fatal */
        }
    }
  },
}};
