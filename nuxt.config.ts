import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";

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
      title: "Kato",
    },
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },

  build: {
    transpile:
      process.env.NODE_ENV === "production"
        ? [
            "naive-ui",
            "vueuc",
            "@css-render/vue3-ssr",
            "@juggle/resize-observer",
          ]
        : ["@juggle/resize-observer"],
  },

  css: ["@/assets/css/tailwind.css"],
  devtools: { enabled: true },

  imports: {
    dirs: ["stores"],
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", [
    "@nuxt/image",
    {
      domains: ["nuxtjs.org", "unsplash.com"],
    },
  ], // icons are found here: https://icones.js.org/
  "@pinia-plugin-persistedstate/nuxt", "@nuxt/icon", "nuxtjs-naive-ui", "nuxt-auth-utils"],

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

  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === "development" ? ["naive-ui", "vueuc"] : [],
    },
    plugins: [
      AutoImport({
        imports: [
          {
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    server: {
      hmr: {
        clientPort: 3000,
      },
    },
  },

  compatibilityDate: "2024-10-16",
});