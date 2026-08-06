import { api } from "@mybeachapp/backend/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Component } from "react";
import { type AdminAccessState, AdminAccessView } from "#/auth/admin-access";
import { AdminSignIn } from "#/auth/admin-sign-in";
import { authClient } from "#/auth/auth-client";

type AdminAccessGateProps = {
  readonly children: React.ReactNode;
};

type AdminQueryBoundaryState = {
  readonly access?: AdminAccessState;
};

function accessStateForError(error: unknown): AdminAccessState {
  if (
    error instanceof ConvexError &&
    typeof error.data === "object" &&
    error.data !== null &&
    "code" in error.data &&
    error.data.code === "forbidden"
  ) {
    return { status: "forbidden" };
  }

  return { status: "unavailable" };
}

// biome-ignore lint/style/useReactFunctionComponents: React error boundaries require a class component.
class AdminQueryBoundary extends Component<
  React.PropsWithChildren,
  AdminQueryBoundaryState
> {
  state: AdminQueryBoundaryState = {};

  static getDerivedStateFromError(error: unknown): AdminQueryBoundaryState {
    return { access: accessStateForError(error) };
  }

  render() {
    if (this.state.access) {
      return (
        <AdminAccessView signIn={<AdminSignIn />} state={this.state.access}>
          {null}
        </AdminAccessView>
      );
    }

    return this.props.children;
  }
}

function AdminViewerGate({ children }: AdminAccessGateProps) {
  const viewer = useQuery(api.admin.viewer, {});

  return (
    <AdminAccessView
      signIn={<AdminSignIn />}
      state={{ status: viewer ? "allowed" : "loading" }}
    >
      {children}
    </AdminAccessView>
  );
}

export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const session = authClient.useSession();
  const convexAuth = useConvexAuth();

  if (session.isPending || convexAuth.isLoading || convexAuth.isRefreshing) {
    return (
      <AdminAccessView signIn={<AdminSignIn />} state={{ status: "loading" }}>
        {null}
      </AdminAccessView>
    );
  }

  if (!session.data?.user || !convexAuth.isAuthenticated) {
    return (
      <AdminAccessView
        signIn={<AdminSignIn />}
        state={{ status: "signed_out" }}
      >
        {null}
      </AdminAccessView>
    );
  }

  return (
    <AdminQueryBoundary key={session.data.user.id}>
      <AdminViewerGate>{children}</AdminViewerGate>
    </AdminQueryBoundary>
  );
}
