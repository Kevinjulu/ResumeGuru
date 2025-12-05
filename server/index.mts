import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.mts";
import { serveStatic } from "./static.mts";
import { createServer } from "http";
import { setupAuth, registerAuthRoutes } from "./auth.mts";
import { registerBillingRoutes } from "./billing.mts";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Serve uploaded files statically
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  setupAuth(app);
  registerAuthRoutes(app);
  registerBillingRoutes(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite.mts");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const initialPort = parseInt(process.env.PORT || "5000", 10);
  const maxPortAttempts = 5;

  async function startServer(currentPort: number, attempts: number) {
    if (attempts >= maxPortAttempts) {
      console.error(`All attempts to bind to a port failed. Exiting.`);
      process.exit(1);
    }

    const options: any = {
      port: currentPort,
      host: "0.0.0.0",
    };
    if (process.platform !== "win32") {
      options.reusePort = true;
    }

    httpServer.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        log(`Port ${currentPort} is in use, trying next port...`, "express");
        startServer(currentPort + 1, attempts + 1);
      } else {
        console.error("Server error:", error);
        throw error;
      }
    });

    httpServer.listen(options, () => {
      log(`serving on port ${currentPort}`, "express");
    });
  }

  startServer(initialPort, 0);
})();
