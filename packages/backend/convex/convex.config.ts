import geospatial from "@convex-dev/geospatial/convex.config.js";
import { defineApp } from "convex/server";

import betterAuth from "./betterAuth/convex.config";

const app = defineApp();

app.use(betterAuth);
app.use(geospatial);

export default app;
