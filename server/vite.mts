import { type Express } from "express";
import { createServer as createViteServer, createLogger, UserConfig } from "vite"; // Import UserConfig
import { type Server } from "http";
// import viteConfig from "../vite.config"; // Removed external viteConfig import
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { nanoid } from "nanoid";
import react from "@vitejs/plugin-react"; // Import react plugin
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal"; // Import runtimeErrorOverlay

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const projectRoot = process.cwd();

  // Inline Vite config
  const inlineViteConfig: UserConfig = {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      // Replit-specific plugins are conditionally loaded in vite.config.ts,
      // but for simplicity in server/vite.ts, we'll only include essential ones for now.
      // If needed, they should be loaded carefully here without top-level await.
    ],
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "client", "src"),
        "@shared": path.resolve(projectRoot, "shared"),
        "@assets": path.resolve(projectRoot, "attached_assets"),
      },
    },
    root: path.resolve(projectRoot, "client"),
    appType: "custom",
  };

  const vite = await createViteServer({
    ...inlineViteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Use __dirname equivalent for broader compatibility
      const currentDir = path.dirname(import.meta.url ? fileURLToPath(import.meta.url) : __filename);
      const clientTemplate = path.resolve(
        currentDir,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
