import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AdminAccessView } from "../admin-access";

afterEach(cleanup);

describe("AdminAccessView", () => {
  it("masque le back-office pendant la résolution de l'accès", () => {
    // Given
    const state = { status: "loading" } as const;

    // When
    render(
      <AdminAccessView signIn={null} state={state}>
        <p>Contenu protégé</p>
      </AdminAccessView>,
    );

    // Then
    expect(screen.queryByText("Contenu protégé")).toBeNull();
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("affiche la connexion sans contenu back-office hors session", () => {
    // Given
    const state = { status: "signed_out" } as const;

    // When
    render(
      <AdminAccessView
        signIn={
          <form>
            <label>
              Adresse e-mail
              <input type="email" />
            </label>
          </form>
        }
        state={state}
      >
        <p>Contenu protégé</p>
      </AdminAccessView>,
    );

    // Then
    expect(screen.queryByText("Contenu protégé")).toBeNull();
    expect(
      screen.getByRole("textbox", { name: "Adresse e-mail" }),
    ).toBeTruthy();
  });

  it("refuse le contenu back-office à un utilisateur sans accès admin", () => {
    // Given
    const state = { status: "forbidden" } as const;

    // When
    render(
      <AdminAccessView signIn={null} state={state}>
        <p>Contenu protégé</p>
      </AdminAccessView>,
    );

    // Then
    expect(screen.queryByText("Contenu protégé")).toBeNull();
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("affiche le back-office après validation de l'accès admin", () => {
    // Given
    const state = { status: "allowed" } as const;

    // When
    render(
      <AdminAccessView signIn={null} state={state}>
        <p>Contenu protégé</p>
      </AdminAccessView>,
    );

    // Then
    expect(screen.getByText("Contenu protégé")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
