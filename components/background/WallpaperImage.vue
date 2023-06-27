<template>
  <div class="relative bg-slate-800">
    <!-- Show the new image on the top and fade in after loading -->
    <nuxt-img
      :src="imageSource"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-opacity duration-500"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onImgLoad"
    />

    <img
      :src="nextImageSource"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-opacity duration-500"
      :class="{
        'opacity-0': !transitionToNextImage,
        'opacity-100': transitionToNextImage,
      }"
    />

    <n-button @click="transitionElements"> skip </n-button>
  </div>
</template>

<script setup lang="ts">
const isLoaded = ref(false);
const transitionToNextImage = ref(false);

const imageSource = ref("");
const nextImageSource = ref("");

import { useBackgroundImageStore } from "~/stores/backgroundImage";

const backgroundCookie = useCookie("background");

const backgroundStore = useBackgroundImageStore();

backgroundCookie.value =
  backgroundCookie.value ||
  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

console.log(backgroundCookie.value);

imageSource.value = backgroundCookie.value;
nextImageSource.value = backgroundStore.getNextBackgroundImage();

onMounted(() => {
  backgroundStore.getDailyImages().then(() => {
    backgroundStore.setBackgroundImage();

    nextImageSource.value = backgroundStore.getNextBackgroundImage();

    console.log("updated daily images on mounted");
  });

  setInterval(() => {
    checkForNewImage();
  }, 1500);
});

const transitionElements = () => {
  transitionToNextImage.value = !transitionToNextImage.value;
};

const checkForNewImage = () => {
  if (
    imageSource.value === backgroundStore.backgroundImageUrl ||
    backgroundStore.backgroundImageUrl === ""
  ) {
    return;
  }

  console.log("new image found");

  transitionToNextImage.value = true;

  backgroundCookie.value = backgroundStore.backgroundImageUrl;
  imageSource.value = backgroundStore.backgroundImageUrl;

  setTimeout(() => {
    transitionToNextImage.value = false;

    setTimeout(() => {
      nextImageSource.value = backgroundStore.getNextBackgroundImage();
    }, 500);
  }, 1500);
};

const onImgLoad = () => {
  console.log("loaded");
  isLoaded.value = true;
};
</script>
