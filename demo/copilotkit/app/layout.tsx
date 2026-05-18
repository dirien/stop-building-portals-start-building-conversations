import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platform Catalog",
  description: "Custom platform frontend hosting MCP Apps + AG-UI + A2UI via CopilotKit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Material Symbols — the @copilotkit/a2ui-renderer basic catalog
            renders Icon via this font + ligature mapping. Loading via <link>
            in <head> is more reliable than a CSS @import. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
