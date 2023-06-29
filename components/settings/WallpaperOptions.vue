<template>
  <section class="px-6">
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
              Skip to next wallpaper
            </n-button>
          </div>
        </div>
      </div>

      <n-divider />

      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="mdi:image-search" size="25" />
          <p class="ml-2 text-xl font-semibold">Wallpaper Information</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            Information about the current wallpaper is displayed below. You can
            also visit the source of the wallpaper at the Unsplash website.
          </p>

          <Transition name="fast-fade-blur" appear mode="out-in">
            <div class="flex flex-col space-y-2 py-3" v-if="!loading">
              <div
                class="flex items-center space-x-2 transition-all hover:text-sky-300"
              >
                <Icon name="icon-park-twotone:camera-three" size="20" />
                <a
                  class="text-base font-medium"
                  :href="imageUsernameLink"
                  target="_blank"
                  rel="noopener"
                >
                  {{ imageUsername }}
                </a>
              </div>

              <div class="flex items-center space-x-2">
                <Icon name="material-symbols:location-on-rounded" size="20" />
                <p class="text-base font-medium">
                  {{ city == "Unknown" ? "Unknown" : city + ", " + country }}
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <Icon name="fluent:text-description-20-filled" size="20" />
                <span class="text-base font-medium">
                  {{ description }}
                </span>
              </div>
            </div>
          </Transition>
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

const imageUsername = ref("");
const imageUsernameLink = ref("https://unsplash.com");

const city = ref("");
const country = ref("");

const description = ref("");

// const imageUsername = computed(() =>
//   "username" in backgroundStore.backgroundImage
//     ? backgroundStore.backgroundImage.username
//     : ""
// );

// const imageUsernameLink = computed(() =>
//   "username" in backgroundStore.backgroundImage
//     ? `https://unsplash.com/@${backgroundStore.backgroundImage.username}`
//     : "https://unsplash.com"
// );

const skipToNextWallpaper = () => {
  loaderStore.addToLoadingQueue("background");
  loading.value = true;

  backgroundStore.updateBackgroundImage();

  updateImageMetadata();

  setTimeout(() => {
    loaderStore.removeFromLoadingQueue("background");

    loading.value = false;
    message.success("Wallpaper updated!");
  }, 3000);
};

const updateImageMetadata = () => {
  if ("username" in backgroundStore.backgroundImage) {
    imageUsername.value = backgroundStore.backgroundImage.username;
    imageUsernameLink.value = `https://unsplash.com/@${backgroundStore.backgroundImage.username}`;
  }

  if ("city" in backgroundStore.backgroundImage) {
    city.value = backgroundStore.backgroundImage.city;
    country.value = backgroundStore.backgroundImage.country;
  }

  if ("description" in backgroundStore.backgroundImage) {
    description.value = backgroundStore.backgroundImage.description;
  }
};

onMounted(() => {
  updateImageMetadata();
});
</script>

<style scoped>
.settings-option {
  @apply flex flex-col;
}
</style>
```
