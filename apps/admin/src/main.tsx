import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "#/providers/auth-provider";
import { getRouter } from "./router";

const router = getRouter();

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element #app was not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}
