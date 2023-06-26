<template>
  <main
    class="vignette h-full w-full rounded-xl bg-slate-900/20 px-4 py-3 backdrop-blur-sm"
  >
    <div class="mb-2 mt-8 flex items-center justify-start space-x-3 text-white">
      <Icon name="ic:twotone-settings" size="33" />
      <h1 class="text-2xl font-bold drop-shadow-lg sm:text-4xl">Settings</h1>
    </div>

    <n-divider />

    <div class="mt-8">
      <!-- <n-breadcrumb separator=">" class="my-4">
        <n-breadcrumb-item class="text-white"> Home </n-breadcrumb-item>
        <n-breadcrumb-item> Account </n-breadcrumb-item>
        <n-breadcrumb-item> Category </n-breadcrumb-item>
      </n-breadcrumb> -->

      <n-tabs
        type="bar"
        animated
        placement="left"
        size="large"
        @before-leave="handleBeforeLeave"
        @update:value="handleUpdateValue"
      >
        <n-tab-pane name="Clock" tab="Clock">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="mdi:web-clock" size="25" />
              <span class="text-base">Clock</span>
            </div>
          </template>

          <SettingsClockOptions />
        </n-tab-pane>

        <n-tab-pane name="My Profile" tab="My Profile">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="mdi:account-settings-variant" size="25" />
              <span class="text-base">My Profile</span>
            </div>
          </template>

          <SettingsMyProfile />
        </n-tab-pane>
        s
        <n-tab-pane name="Todo" tab="Todo">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="mdi:format-list-checkbox" size="25" />
              <span class="text-base">Todo</span>
            </div>
          </template>

          <div class="text-white">Todo</div>
        </n-tab-pane>

        <n-tab-pane name="Help" tab="Help">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="material-symbols:help-outline-rounded" size="25" />
              <span class="text-base">Help</span>
            </div>
          </template>

          <div class="text-white">Help</div>
        </n-tab-pane>

        <n-tab-pane name="About" tab="About">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="material-symbols:info-outline-rounded" size="25" />
              <span class="text-base">About</span>
            </div>
          </template>

          <div class="text-white">About</div>
        </n-tab-pane>

        <n-tab-pane name="Changelog" tab="Changelog">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="simple-icons:keepachangelog" size="25" />
              <span class="text-base">Changelog</span>
            </div>
          </template>

          <div class="text-white">Changelog</div>
        </n-tab-pane>

        <n-tab-pane name="Advanced" tab="Advanced">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="fluent:developer-board-16-regular" size="25" />
              <span class="text-base">Advanced</span>
            </div>
          </template>

          <SettingsAdvancedOptions />
        </n-tab-pane>

        <n-tab-pane v-if="isLoggedIn" name="Log Out" tab="Log Out">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="ion:log-out" size="25" />
              <span class="text-base">Log Out</span>
            </div>
          </template>

          <SettingsUserLogout />
        </n-tab-pane>

        <n-tab-pane v-if="!isLoggedIn" name="Login" tab="Login">
          <template #tab>
            <div class="tab-pane-title">
              <Icon name="ion:log-out" size="25" />
              <span class="text-base">Login</span>
            </div>
          </template>

          <div class="text-white">Redirecting to login page</div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
const user = useSupabaseUser();

const message = useMessage();

const isLoggedIn = computed(() => user.value);

const handleUpdateValue = (value: string) => {
  if (value === "Login") {
    navigateTo("/auth/login");
  }
};

const handleBeforeLeave = (tabName: string) => {
  console.log(tabName);
  if (!isLoggedIn.value) {
    switch (tabName) {
      case "My Profile":
        message.error("You must be logged in to view this section");
        return false;
      case "Log Out":
        message.error("You must be logged in to view this section");
        return false;

      default:
        return true;
    }
  }

  return true;
};
</script>

<style scoped>
.tab-pane-title {
  @apply flex items-center justify-start space-x-2 font-medium drop-shadow-lg;
}
</style>
