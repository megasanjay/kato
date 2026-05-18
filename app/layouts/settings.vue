<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }

  return route.path === path || route.path.startsWith(`${path}/`);
};

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Go back to Kato",
      icon: "material-symbols:arrow-back",
      to: "/",
    },
    {
      label: "Wallpaper",
      icon: "material-symbols:image",
      to: "/settings/wallpaper",
      active: isActive("/settings/wallpaper"),
    },
    {
      label: "Countdown",
      icon: "material-symbols:timer",
      to: "/settings/countdown",
      active: isActive("/settings/countdown"),
    },
    {
      label: "RSS Feeds",
      icon: "material-symbols:rss-feed",
      to: "/settings/rss",
      active: isActive("/settings/rss"),
    },
  ],
]);
</script>

<template>
  <div
    class="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-100 dark:bg-slate-950"
  >
    <WallpaperImage overlay-mode="full" />

    <main class="z-10 h-full overflow-y-auto p-5">
      <UContainer>
        <div class="flex items-center justify-between">
          <UNavigationMenu :items="items" />

          <UColorModeButton
            class="text-slate-700 hover:text-slate-900 dark:text-white/75 dark:hover:text-white"
          />
        </div>

        <div class="pb-4">
          <slot />
        </div>
      </UContainer>
    </main>
  </div>
</template>
