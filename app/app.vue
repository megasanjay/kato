<script setup lang="ts">
// Root app shell responsible for global document metadata and page rendering.
const colorMode = useColorMode();

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      href: "/favicon-96x96.png",
      rel: "icon",
      sizes: "96x96",
      type: "image/png",
    },
    { href: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
    { href: "/favicon.ico", rel: "shortcut icon" },
    {
      href: "/apple-touch-icon.png",
      rel: "apple-touch-icon",
      sizes: "180x180",
    },
    { href: "/site.webmanifest", rel: "manifest" },
  ],
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "theme-color",
      content: colorMode.value === "dark" ? "#111827" : "white",
      key: "theme-color",
    },
  ],
});

useSeoMeta({
  titleTemplate: "%s",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
