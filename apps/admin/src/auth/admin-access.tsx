export type AdminAccessState =
  | { readonly status: "loading" }
  | { readonly status: "signed_out" }
  | { readonly status: "forbidden" }
  | { readonly status: "unavailable" }
  | { readonly status: "allowed" };

type AdminAccessViewProps = {
  readonly children: React.ReactNode;
  readonly signIn: React.ReactNode;
  readonly state: AdminAccessState;
};

export function AdminAccessView({
  children,
  signIn,
  state,
}: AdminAccessViewProps) {
  if (state.status === "loading") {
    return (
      <main aria-busy="true" className="access-page">
        <section aria-live="polite" className="access-card" role="status">
          <span aria-hidden="true" className="access-spinner" />
          <h1>Vérification de ton accès</h1>
          <p>Le back-office se prépare.</p>
        </section>
      </main>
    );
  }

  if (state.status === "signed_out") {
    return signIn;
  }

  if (state.status === "forbidden") {
    return (
      <main className="access-page">
        <section className="access-card" role="alert">
          <p className="access-eyebrow">Accès refusé</p>
          <h1>Ce back-office est réservé aux admins</h1>
          <p>
            Ton compte est bien connecté, mais il n’a pas les droits requis ou
            il a été désactivé.
          </p>
        </section>
      </main>
    );
  }

  if (state.status === "unavailable") {
    return (
      <main className="access-page">
        <section className="access-card" role="alert">
          <p className="access-eyebrow">Service indisponible</p>
          <h1>Impossible de vérifier ton accès</h1>
          <p>Réessaie dans quelques instants.</p>
        </section>
      </main>
    );
  }

  return children;
}
