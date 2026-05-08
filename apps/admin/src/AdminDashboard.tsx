import { ACTIVITY_CATEGORIES } from "@mybeach/shared";

export function AdminDashboard() {
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
      <section aria-label="Categories MVP" className="admin-panel">
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
