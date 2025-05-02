import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./lib/i18n"; // Import i18n configuration before app
import "./index.css";
import App from "./App";
import { RTLProvider } from "./components/RTLProvider";
import { ThemeProvider } from "./lib/contexts/ThemeContext";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ThemeProvider>
        <RTLProvider>
          <App />
        </RTLProvider>
      </ThemeProvider>
    </ConvexAuthProvider>
  </StrictMode>,
);