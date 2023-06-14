<template>
  <NaiveConfig :theme-config="themeConfig">
    <n-message-provider>
      <NuxtLayout>
        <NuxtLoadingIndicator color="#be185d" :height="5" />
        <NuxtPage />
      </NuxtLayout>
    </n-message-provider>
  </NaiveConfig>
</template>

<script setup lang="ts">
import "vue3-lottie/dist/style.css";

import { ThemeConfig } from "@bg-dev/nuxt-naiveui";

/**
 * Theme: https://realtimecolors.com/?colors=021d1c-f5fefe-07518d-ffffff-02042c
 */

const themeConfig: ThemeConfig = {
  dark: {}, // Theme options applied on dark mode
  light: {}, // Theme options applied on light mode
  mobile: {}, // Theme options applied on mobile only
  mobileOrTablet: {}, // Theme options applied on mobile and tablet
  shared: {
    Form: {
      labelFontSizeTopLarge: "16px",
      labelTextColor: "#ffffff",
    },
    Input: {
      color: "#ffffff00",
      colorFocus: "#ffffff00",
      iconColor: "#ffffff",
      placeholderColor: "#bfbeba",
      textColor: "#ffffff",
    },
    Tabs: {
      barColor: "#07518d",
      tabTextColorActiveBar: "#07518d",
      tabTextColorBar: "#fff",
      tabTextColorHoverBar: "#0369a1",
    },
  }, // Common theme options
};

useHead({
  title: "Kato",
  link: [
    { href: "/favicon.ico", rel: "icon", type: "image/x-icon" },
    {
      href: "/apple-touch-icon.png",
      rel: "apple-touch-icon",
      sizes: "180x180",
    },
    {
      href: "/favicon-16x16.png",
      rel: "icon",
      sizes: "16x16",
      type: "image/png",
    },
    {
      href: "/favicon-32x32.png",
      rel: "icon",
      sizes: "32x32",
      type: "image/png",
    },
    {
      color: "#5bbad5",
      href: "/safari-pinned-tab.svg",
      rel: "mask-icon",
    },
    {
      href: "/site.webmanifest",
      rel: "manifest",
    },
  ],
  meta: [
    {
      name: "description",
      content:
        "Scholar Stack is an application to help you manage your dependencies with ease",
    },
    {
      name: "msapplication-TileColor",
      content: "#2b5797",
    },
    {
      name: "theme-color",
      content: "#ffffff",
    },
  ],
});
</script>
