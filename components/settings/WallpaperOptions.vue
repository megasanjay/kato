<template>
  <section class="h-full px-6">
    <h1>Wallpaper</h1>
    <p class="pt-1">
      Use this page to change the wallpaper of your dashboard. You can choose
      from a variety of different wallpapers.
    </p>

    <n-divider />

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="ph:images-duotone" size="25" />
          <p class="ml-2 text-xl font-semibold">Update Wallpaper</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            A collection of beautiful backgrounds are generated each day. You
            can cycle through them by clicking the button below.
          </p>

          <div class="py-3">
            <n-button
              color="#07518d"
              size="large"
              strong
              :loading="loading"
              round
              @click="skipToNextWallpaper"
            >
              <template #icon>
                <Icon name="uil:image-redo" />
              </template>
              Skip to next wallpaper {{ loaderStore.requestsInFlight }}
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useBackgroundImageStore } from "~/stores/backgroundImage";
import { useLoaderStore } from "~/stores/loader";

const loading = ref(false);
const message = useMessage();

const backgroundStore = useBackgroundImageStore();
const loaderStore = useLoaderStore();

const skipToNextWallpaper = () => {
  loaderStore.addToLoadingQueue("background");
  loading.value = true;

  backgroundStore.updateBackgroundImage();

  setTimeout(() => {
    loaderStore.removeFromLoadingQueue("background");

    loading.value = false;
    message.success("Wallpaper updated!");
  }, 3000);
};
</script>

<style scoped>
.settings-option {
  @apply flex flex-col;
}
</style>
```
