import { defineNuxtPlugin } from "#app";
import * as pkg from "~/package.json";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

export default defineNuxtPlugin((nuxtApp) => {
  const release = `<your-project-name>@${pkg.version}`;
  const environment = nuxtApp.$config.dev ? "development" : "production";

  Sentry.init({
    dsn: "https://d46d862de1c14458966c8dbda6b006bf@o4505439471665152.ingest.sentry.io/4505439684001792",
    release,
    environment,
    integrations: [new Integrations.BrowserTracing()],
    sampleRate: 0.5,
    tracesSampleRate: 0.5,
  });
});
