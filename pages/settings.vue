<template>
  <main class="vignette h-full w-full px-4 py-3 backdrop-blur-sm">
    <div class="mb-2 mt-8 flex items-center justify-start space-x-3 text-white">
      <Icon name="material-symbols:settings-account-box-rounded" size="33" />
      <h1 class="text-2xl font-bold drop-shadow-lg sm:text-4xl">Settings</h1>
    </div>

    <n-divider />

    <div class="mt-8">
      <n-tabs
        type="line"
        animated
        placement="left"
        @before-leave="handleBeforeLeave"
      >
        <n-tab-pane name="oasis" tab="Oasis">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon
                name="material-symbols:settings-account-box-rounded"
                size="25"
              />
              <span class="text-base">General</span>
            </div>
          </template>

          <div class="text-white">General</div>
        </n-tab-pane>

        <n-tab-pane name="myProfile" tab="MyProfile">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon name="mdi:account-settings-variant" size="25" />
              <span class="text-base">My Profile</span>
            </div>
          </template>

          <div class="text-white">My Profile</div>
        </n-tab-pane>

        <n-tab-pane name="todo" tab="Todo">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon name="pajamas:todo-done" size="25" />
              <span class="text-base">Todo</span>
            </div>
          </template>

          <div class="text-white">Todo</div>
        </n-tab-pane>

        <n-tab-pane name="help" tab="Help">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon name="material-symbols:help-rounded" size="25" />
              <span class="text-base">Help</span>
            </div>
          </template>

          <div class="text-white">Help</div>
        </n-tab-pane>

        <n-tab-pane name="about" tab="About">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon name="material-symbols:info-rounded" size="25" />
              <span class="text-base">About</span>
            </div>
          </template>

          <div class="text-white">About</div>
        </n-tab-pane>

        <n-tab-pane name="changelog" tab="Oasis">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon name="simple-icons:keepachangelog" size="25" />
              <span class="text-base">Changelog</span>
            </div>
          </template>

          <div class="text-white">Changelog</div>
        </n-tab-pane>

        <n-tab-pane name="logout" tab="Logout">
          <template #tab>
            <div class="flex items-center justify-start space-x-2 text-white">
              <Icon name="ion:log-out" size="25" />
              <span class="text-base">Log Out</span>
            </div>
          </template>

          <div class="text-white">Log Out</div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
const user = useSupabaseUser();

const message = useMessage();

const handleBeforeLeave = (tabName: string) => {
  const loggedIn = user.value?.id;

  if (!loggedIn) {
    switch (tabName) {
      case "myProfile":
        message.error("You must be logged in to view this section!");
        return false;

      default:
        return true;
    }
  }

  return true;
};
</script>
