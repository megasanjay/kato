<template>
  <main
    class="vignette relative flex h-full w-full flex-grow flex-col rounded-xl bg-slate-900/20 px-6 py-4 backdrop-blur-sm"
  >
    <div class="mb-2 mt-8 flex items-center justify-start space-x-3 text-white">
      <Icon name="ic:twotone-settings" size="33" />
      <h1 class="text-2xl font-bold drop-shadow-lg sm:text-4xl">Settings</h1>
    </div>

    <n-divider />

    <div class="h-full overflow-hidden p-4">
      <n-layout has-sider class="h-full">
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="collapsed"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :render-label="renderMenuLabel"
            :render-icon="renderMenuIcon"
            :expand-icon="expandIcon"
          />
        </n-layout-sider>
        <n-layout class="overflow-hidden overflow-y-auto">
          <component :is="renderComponent" />
        </n-layout>
      </n-layout>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { ConcreteComponent, render } from "nuxt/dist/app/compat/capi";
const user = useSupabaseUser();

const isLoggedIn = computed(() => user.value);

const SettingsWallpaperOptions = resolveComponent("SettingsWallpaperOptions");

const renderComponent = shallowRef<string | ConcreteComponent | null>(null);

renderComponent.value = SettingsWallpaperOptions;

const menuOptions: MenuOption[] = [
  {
    key: "Wallpaper",
    label: "Wallpaper",
  },
  {
    key: "Clock",
    label: "Clock",
  },
  {
    disabled: !isLoggedIn.value,
    key: "My Profile",
    label: "My Profile",
  },
  {
    key: "About",
    label: "About",
  },
  {
    key: "Help",
    label: "Help",
  },
  {
    key: "Login",
    label: "Login",
  },
];
</script>

<style scoped>
.tab-pane-title {
  @apply flex items-center justify-start space-x-2 font-medium drop-shadow-lg;
}
</style>
