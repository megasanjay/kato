<template>
 <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <NuxtLayout>
        <NuxtLoadingIndicator color="#be185d" :height="5" />
        <NuxtPage />
      </NuxtLayout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import "vue3-lottie/dist/style.css";
import { NConfigProvider, type GlobalThemeOverrides } from "naive-ui";

/**
 * Theme: https://realtimecolors.com/?colors=021d1c-f5fefe-07518d-ffffff-02042c
 */

const themeOverrides: GlobalThemeOverrides = {
  
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
    Layout: {
      color: "#ffffff00",
      textColor: "#ffffff",
      siderColor: "#ffffff00",
    },
    Menu: {
      itemTextColor: "#ffffff",
      itemIconColor: "#ffffff",
      itemIconColorCollapsed: "#ffffff",
      itemColorHover: "#e0f2fe",
      itemTextColorHover: "#0369a1",
      itemTextColorActive: "#0284c7",
      itemTextColorActiveHover: "#0c4a6e",
      itemColorActive: "#e0f2fe",
      itemIconColorActive: "#0284c7",
      itemIconColorActiveHover: "#0c4a6e",
      itemColorActiveHover: "#bae6fd",
      itemIconColorHover: "#0369a1",
    },
    Tabs: {
      barColor: "#07518d",
      tabTextColorActiveBar: "#eff6ff",
      tabTextColorBar: "#fff",
      tabTextColorHoverBar: "#bae6fd",
    },
    Switch: {
      railColor: "#e0f2fe",
    },
 
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
