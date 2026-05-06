// Central Nuxt configuration for modules, runtime settings, and Vite tuning.
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-16",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-utils", "dayjs-nuxt", "@nuxt/eslint"],
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "",
      maxAge: 60 * 60 * 24 * 30, // 1 month
    },
    emailVerificationDomain: process.env.EMAIL_VERIFICATION_DOMAIN || "",
    mailFrom: process.env.MAIL_FROM || "noreply@example.com",
    mailHost: process.env.MAIL_HOST || "smtp.example.com",
    mailPass: process.env.MAIL_PASS || "password",
    mailPort: process.env.MAIL_PORT || "587",
    mailUser: process.env.MAIL_USER || "user",
    public: {
      ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION
        ? process.env.ENABLE_EMAIL_VERIFICATION === "true"
        : false,
      limits: {
        itemLimit: 100,
        itemWarnThreshold: 90,
        text: {
          titleMaxLength: 120,
          noteMaxLength: 500,
          todoMaxLength: 500,
        },
        countdown: {
          recurrenceMin: 1,
          recurrenceMax: 365,
        },
        rss: {
          userFeedLimit: 10,
          itemsPerFeed: 20,
          staleHours: 6,
          feedTitleMaxLength: 200,
          itemTitleMaxLength: 500,
          itemDescriptionMaxLength: 1000,
        },
      },
    },
  },
  eslint: {},
  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "dayjs", // CJS
        "dayjs/plugin/updateLocale", // CJS
        "dayjs/plugin/relativeTime", // CJS
        "dayjs/plugin/utc", // CJS
      ],
    },
  },
});
