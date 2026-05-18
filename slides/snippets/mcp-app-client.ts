import { App } from "@modelcontextprotocol/ext-apps";

const app = new App({
  name: "Platform Service Catalog",
  version: "1.0.0",
});

// Receive tool arguments as they stream in
app.ontoolinput = (request) => {
  showLoadingState();
};

// Receive the tool result with structured data
app.ontoolresult = (result) => {
  const data = result.structuredContent;
  if (data.view === "catalog") renderCatalog(data.services);
  if (data.view === "detail") renderDetail(data.service);
};

// Adapt to host theme (dark/light mode)
app.onhostcontextchanged = (ctx) => {
  document.documentElement.style.colorScheme = ctx.themeMode;
};

// Connect to the host iframe bridge
await app.connect();

// Call tools back to the server from the UI
deployBtn.addEventListener("click", async () => {
  const result = await app.callServerTool({
    name: "deploy-service",
    arguments: { serviceId: "user-service", environment: "staging" },
  });
  renderDeployResult(result.structuredContent);
});
