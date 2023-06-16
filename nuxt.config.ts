// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  alias: {},

  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      titleTemplate: "%pageTitle %titleSeparator %siteName",
    },
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },

  css: ["@/assets/css/tailwind.css"],

  devtools: { enabled: true },

  extends: ["nuxt-seo-kit"],

  imports: {
    dirs: ["stores"],
  },

  modules: [
    "@nuxtjs/supabase",
    "@nuxt/devtools",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    [
      "nuxt-lodash",
      {
        prefix: "_",
      },
    ],
    "@pinia-plugin-persistedstate/nuxt",
    "@bg-dev/nuxt-naiveui",
    "nuxt-icon", // icons are found here: https://icones.js.org/
  ],

  naiveui: {
    colorModePreference: "light",
    iconSize: 18,
    themeConfig: {},
  },

  nitro: {},

  runtimeConfig: {
    public: {
      // keys coming in from nuxt-seo-kit
      language: "en-US",
      siteDescription: "Welcome to my Kato!",
      siteName: "Kato",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://kato.day",
      titleSeparator: "|",
    },
  },
});
