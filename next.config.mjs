import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js configurations can go here
};

const sentryWebpackPluginOptions = {
  org: "ashish-projects-hub",
  project: "medica-nextjs",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  hideSourceMaps: true,

  disableLogger: true,

  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
