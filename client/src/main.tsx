import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

const PUBLISHABLE_KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string) || "";

if (!PUBLISHABLE_KEY) {
  console.warn(
    "Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local or environment. " +
    "Clerk authentication will not be available. " +
    "Make sure .env.local is configured with your Clerk publishable key."
  );
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY || "pk_live_placeholder_for_dev"}
    afterSignOutUrl="/"
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ClerkProvider>
);
