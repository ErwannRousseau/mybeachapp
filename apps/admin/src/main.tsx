import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ACTIVITY_CATEGORIES } from "@mybeach/shared";

import "./styles.css";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AdminDashboard
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AdminDashboard() {
  return (
    <main className="admin-shell">
      <section>
        <p className="eyebrow">Back-office MVP</p>
        <h1>My Beach App Admin</h1>
        <p>
          Base Vite + React + TanStack Router prete pour superviser activites,
          utilisateurs et metriques Convex.
        </p>
      </section>
      <section className="admin-panel" aria-label="Categories MVP">
        <h2>Categories partagees</h2>
        <ul>
          {ACTIVITY_CATEGORIES.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root introuvable");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
