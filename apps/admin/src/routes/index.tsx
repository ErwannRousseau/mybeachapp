import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useCallback } from "react";

import { authClient } from "#/auth/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
  }, []);

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-brand">My Beach App</p>
          <p className="admin-context">Back-office</p>
        </div>
        <button className="ghost-button" onClick={handleSignOut} type="button">
          <LogOut aria-hidden="true" size={18} />
          Se déconnecter
        </button>
      </header>

      <main className="admin-main">
        <div className="page-heading">
          <div>
            <p className="access-eyebrow">Pilotage</p>
            <h1>Activités</h1>
          </div>
          <span className="status-badge">Accès admin actif</span>
        </div>

        <section className="admin-panel">
          <h2>Vue d’ensemble</h2>
          <p>
            Ton accès est validé. Les outils de gestion des activités seront
            ajoutés ici.
          </p>
        </section>
      </main>
    </div>
  );
}
