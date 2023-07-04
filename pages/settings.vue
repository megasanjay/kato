<template>
  <main
    class="vignette relative flex h-full w-full flex-grow flex-col rounded-xl px-6 py-4 backdrop-blur-sm transition-colors"
    :class="{
      'bg-slate-900/20': !darkenBackground,
      'bg-slate-900/80': darkenBackground,
    }"
  >
    <div class="mb-2 mt-8 flex items-center justify-between px-4">
      <div
        class="flex items-center justify-start space-x-3 text-white drop-shadow-lg"
      >
        <Icon name="ic:twotone-settings" size="33" />
        <h1 class="text-2xl font-bold sm:text-4xl">Settings</h1>
      </div>

      <div class="flex flex-col items-end justify-center text-white">
        <p class="text-base">Having trouble with reading the text?</p>
        <div class="mt-2 flex items-center">
          <span class="mr-2 text-sm">Darken background</span>

          <n-switch v-model:value="darkenBackground" size="small" />
        </div>
      </div>
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
            class="!font-medium"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="25"
            :options="menuOptions"
            @update:value="showSettingsPanel"
          />
        </n-layout-sider>
        <n-layout class="overflow-hidden overflow-y-auto px-4">
          <Transition name="fast-fade-blur" mode="out-in" appear>
            <component :is="renderComponent" />
          </Transition>
        </n-layout>
      </n-layout>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { Icon } from "#components";
import { ConcreteComponent } from "nuxt/dist/app/compat/capi";
const user = useSupabaseUser();
const collapsed = ref(false);

const isLoggedIn = computed(() => user.value);

const darkenBackground = ref(false);

const SettingsWallpaperOptions = resolveComponent("SettingsWallpaperOptions");
const SettingsClockOptions = resolveComponent("SettingsClockOptions");
const SettingsMyProfile = resolveComponent("SettingsMyProfile");
const SettingsAdvancedOptions = resolveComponent("SettingsAdvancedOptions");
const SettingsAuthOptions = resolveComponent("SettingsAuthOptions");
const SettingsChangelogComponent = resolveComponent(
  "SettingsChangelogComponent"
);

const renderComponent = shallowRef<string | ConcreteComponent | null>(null);

renderComponent.value = SettingsChangelogComponent;

const renderMenuIcon = (name: string) => {
  return h(Icon, {
    name,
    size: "25",
  });
};

const menuOptions: MenuOption[] = [
  {
    key: "Wallpaper",
    label: "Wallpaper",
    icon: () => renderMenuIcon("material-symbols:image-rounded"),
  },
  {
    key: "Clock",
    label: "Clock",
    icon: () => renderMenuIcon("mdi:web-clock"),
  },
  {
    disabled: !isLoggedIn.value,
    key: "My Profile",
    label: "My Profile",
    icon: () => renderMenuIcon("mdi:account-settings-variant"),
  },
  {
    disabled: true,
    key: "Todo",
    label: "Todo",
    icon: () => renderMenuIcon("mdi:format-list-checkbox"),
  },
  {
    disabled: true,
    key: "About",
    label: "About",
    icon: () => renderMenuIcon("material-symbols:info-outline-rounded"),
  },
  {
    disabled: true,
    key: "Help",
    label: "Help",
    icon: () => renderMenuIcon("material-symbols:help-outline-rounded"),
  },
  {
    key: "Changelog",
    label: "Changelog",
    icon: () => renderMenuIcon("simple-icons:keepachangelog"),
  },
  {
    key: "Advanced",
    label: "Advanced",
    icon: () => renderMenuIcon("fluent:developer-board-16-regular"),
  },
  {
    key: "Auth",
    label: isLoggedIn.value ? "Logout" : "Login",
    icon: () => renderMenuIcon("ion:log-out"),
  },
];

const showSettingsPanel = (key: string) => {
  console.log("Showing settings panel for", key);
  switch (key) {
    case "Wallpaper":
      renderComponent.value = SettingsWallpaperOptions;
      break;
    case "Clock":
      renderComponent.value = SettingsClockOptions;
      break;
    case "My Profile":
      renderComponent.value = SettingsMyProfile;
      break;
    case "Advanced":
      renderComponent.value = SettingsAdvancedOptions;
      break;
    case "Auth":
      renderComponent.value = SettingsAuthOptions;
      break;
    case "Changelog":
      renderComponent.value = SettingsChangelogComponent;
      break;
    default:
      renderComponent.value = SettingsWallpaperOptions;
      break;
  }
};
</script>

<style scoped>
.tab-pane-title {
  @apply flex items-center justify-start space-x-2 font-medium drop-shadow-lg;
}
</style>
