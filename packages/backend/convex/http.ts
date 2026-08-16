import { httpRouter } from "convex/server";
import { createAuth } from "./betterAuth/auth";
import { authComponent } from "./betterAuth/component";

const http = httpRouter();

authComponent.registerRoutesLazy(http, createAuth, { cors: true });

export default http;
