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
    class="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-950"
  >
    <WallpaperImage />

    <main class="z-10 h-full overflow-y-auto px-4 py-4 md:px-7 md:py-6">
      <UContainer>
        <div class="flex items-center justify-between">
          <UNavigationMenu :items="items" />

          <UColorModeButton class="text-white/75" />
        </div>

        <div class="pb-4">
          <slot />
        </div>
      </UContainer>
    </main>
  </div>
</template>
