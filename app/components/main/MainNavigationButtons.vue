<script setup lang="ts">
const { clear } = useUserSession();

const isLogoutConfirmOpen = ref(false);

const handleLogout = async () => {
  await clear();
  isLogoutConfirmOpen.value = false;
};
</script>

<template>
  <div class="flex h-full items-end justify-end">
    <div class="flex items-center gap-1">
      <UColorModeButton />

      <UTooltip text="Adjust Kato settings" placement="top">
        <UButton
          to="/settings"
          variant="ghost"
          size="lg"
          icon="mingcute:settings-3-fill"
          class="text-white/75 transition-colors hover:text-white"
        />
      </UTooltip>

      <AuthState>
        <template #default="{ loggedIn, user }">
          <div class="flex items-center gap-1">
            <UTooltip
              v-if="loggedIn && user.admin"
              text="View wallpaper admin dashboard"
              placement="top"
            >
              <UButton
                to="/admin/wallpaper"
                variant="ghost"
                size="lg"
                icon="hugeicons:microsoft-admin"
                class="text-white/75 transition-colors hover:text-white"
              />
            </UTooltip>

            <UTooltip v-if="loggedIn" text="Log out of your Kato account">
              <UPopover v-model:open="isLogoutConfirmOpen" mode="click">
                <UButton
                  size="lg"
                  icon="line-md:log-out"
                  variant="ghost"
                  class="text-white/75 transition-colors hover:text-white"
                />

                <template #content>
                  <div class="w-56 p-3">
                    <p class="text-sm">Log out of your Kato account?</p>

                    <div class="mt-3 flex justify-end gap-2">
                      <UButton
                        label="Cancel"
                        color="neutral"
                        variant="soft"
                        size="xs"
                        @click="isLogoutConfirmOpen = false"
                      />

                      <UButton
                        label="Log out"
                        color="error"
                        variant="solid"
                        size="xs"
                        @click="handleLogout"
                      />
                    </div>
                  </div>
                </template>
              </UPopover>
            </UTooltip>

            <UTooltip
              v-else
              text="Log in to sync your data across devices and access it on the web"
            >
              <UButton
                size="lg"
                icon="line-md:log-in"
                to="/login"
                variant="ghost"
                class="text-white/75 transition-colors hover:text-white"
              />
            </UTooltip>
          </div>
        </template>

        <template #placeholder>
          <!-- this will be rendered on server side -->
          <UIcon name="svg-spinners:pulse-rings-3" />
        </template>
      </AuthState>
    </div>
  </div>
</template>
