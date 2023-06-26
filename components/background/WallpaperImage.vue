<template>
  <div class="relative bg-slate-800">
    <!-- Show the real image on the top and fade in after loading -->

    <nuxt-img
      :src="imageSource"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-opacity duration-500"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onImgLoad"
    />
  </div>
</template>

<script setup lang="ts">
const isLoaded = ref(false);

const imageSource = ref("");
import { useBackgroundImageStore } from "~/stores/backgroundImage";

const backgroundCookie = useCookie("background");

const backgroundStore = useBackgroundImageStore();

backgroundCookie.value =
  backgroundCookie.value ||
  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

imageSource.value = backgroundCookie.value;

onMounted(() => {
  setInterval(() => {
    checkForNewImage();
  }, 1000);
});

const checkForNewImage = () => {
  if (backgroundCookie.value === backgroundStore.backgroundImageUrl) {
    return;
  }

  backgroundCookie.value = backgroundStore.backgroundImageUrl;

  isLoaded.value = false;
  imageSource.value = backgroundStore.backgroundImageUrl;
};

const onImgLoad = () => {
  isLoaded.value = true;
};
</script>
