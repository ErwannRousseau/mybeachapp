declare const process: {
  env: {
    CONVEX_SITE_URL?: string;
  };
};

export default {
  providers: [
    {
      applicationID: "convex",
      domain: process.env.CONVEX_SITE_URL,
    },
  ],
};
