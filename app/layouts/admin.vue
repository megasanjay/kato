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
      label: "Wallpaper",
      icon: "material-symbols:image",
      to: "/admin/wallpaper",
      active: isActive("/admin/wallpaper"),
    },
    {
      label: "Users",
      icon: "material-symbols:group",
      to: "/admin/users",
      active: isActive("/admin/users"),
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
      <div class="mx-auto w-full max-w-7xl">
        <div class="pb-4">
          <UNavigationMenu :items="items" />
        </div>

        <div class="pb-4">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
