import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./betterAuth/auth";
import { env } from "./config/env";

const http = httpRouter();

authComponent.registerRoutesLazy(http, createAuth);

http.route({
  handler: httpAction(async (ctx, req) => {
    if (env.APP_ENV !== "development") {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    const email = new URL(req.url).searchParams.get("email")?.trim();

    if (!email) {
      return Response.json({ error: "email_required" }, { status: 400 });
    }

    const result = await createAuth(ctx).api.getVerificationOTP({
      query: {
        email,
        type: "sign-in",
      },
    });

    if (!result.otp) {
      return Response.json({ error: "otp_not_found" }, { status: 404 });
    }

    return Response.json({
      email,
      otp: result.otp,
    });
  }),
  method: "GET",
  path: "/dev/auth/last-email-otp",
});

export default http;
