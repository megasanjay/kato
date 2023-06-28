<template>
  <div class="background-image-container relative bg-slate-800">
    <!-- Show the new image on the top and fade in after loading -->
    <nuxt-img
      :src="base64Image"
      class="absolute left-0 top-0 h-screen w-screen object-cover"
    />
    <nuxt-img
      :src="backgroundCookie"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-opacity duration-300"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onImgLoad"
    />

    <img
      :src="nextBackgroundCookie"
      class="absolute left-0 top-0 h-screen w-screen object-cover opacity-0 transition-opacity duration-500"
      :class="{
        'opacity-0': !transitionToNextImage,
        'opacity-100': transitionToNextImage,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const isLoaded = ref(false);
const transitionToNextImage = ref(false);

const imageSource = ref("");
const nextImageSource = ref("");

import { useBackgroundImageStore } from "~/stores/backgroundImage";

// cookies should be set to expire after 3 days
const backgroundCookie = useCookie("background", {
  maxAge: 60 * 60 * 24 * 3,
  watch: true,
  default: () =>
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
});

const base64Image = useCookie("base64Image", {
  maxAge: 60 * 60 * 24 * 2,
  watch: true,
  default: () =>
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
});

const nextBackgroundCookie = useCookie("nextBackground", {
  maxAge: 60 * 60 * 24 * 3,
  watch: true,
  default: () =>
    "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
});

console.log("backgroundCookie", backgroundCookie.value);
console.log("nextBackgroundCookie", nextBackgroundCookie.value);

const backgroundStore = useBackgroundImageStore();

imageSource.value = backgroundCookie.value;
nextImageSource.value = nextBackgroundCookie.value;

onMounted(async () => {
  backgroundStore.getDailyImages().then(() => {
    backgroundStore.setBackgroundImage();

    nextImageSource.value = backgroundStore.getNextBackgroundImage();
    nextBackgroundCookie.value = nextImageSource.value;
  });

  setInterval(() => {
    checkForNewImage();
  }, 1500);
});

const checkForNewImage = () => {
  if (
    "blurHash" in backgroundStore.backgroundImage &&
    backgroundStore.backgroundImage.blurHash !== ""
  ) {
    base64Image.value = backgroundStore.backgroundImage.blurHash;
  }

  if (
    imageSource.value === backgroundStore.backgroundImageUrl ||
    backgroundStore.backgroundImageUrl === ""
  ) {
    return;
  }

  transitionToNextImage.value = true;

  setTimeout(() => {
    backgroundCookie.value = backgroundStore.backgroundImageUrl;
    imageSource.value = backgroundStore.backgroundImageUrl;

    setTimeout(() => {
      transitionToNextImage.value = false;

      setTimeout(() => {
        nextImageSource.value = backgroundStore.getNextBackgroundImage();
        nextBackgroundCookie.value = nextImageSource.value;
      }, 500);
    }, 1500);
  }, 500);
};

const onImgLoad = () => {
  console.log("loaded");
  isLoaded.value = true;
};
</script>
