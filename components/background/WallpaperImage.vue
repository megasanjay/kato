<template>
  <div class="background-image-container relative bg-slate-800">
    <!-- Show the new image on the top and fade in after loading -->

    <img
      ref="backgroundImage"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-all"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onImgLoad"
    />

    <img
      ref="nextBackgroundImage"
      class="absolute left-0 top-0 h-screen w-screen object-cover opacity-0 transition-opacity duration-500"
      :class="{
        'opacity-0': !transitionToNextImage,
        'opacity-100': transitionToNextImage,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const backgroundImage = ref<HTMLImageElement | null>(null);
const nextBackgroundImage = ref<HTMLImageElement | null>(null);

const isLoaded = ref(false);
const transitionToNextImage = ref(false);

import { useBackgroundImageStore } from "~/stores/backgroundImage";

// cookies should be set to expire after 3 days
const backgroundCookie = useCookie("background", {
  maxAge: 60 * 60 * 24 * 3,
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

if (backgroundImage.value) {
  backgroundImage.value.src = backgroundCookie.value;

  // if the image is already loaded, set the opacity to 100
  if (backgroundImage.value.complete) {
    isLoaded.value = true;
  }
}

console.log("nextBackgroundCookie", nextBackgroundCookie.value);

if (nextBackgroundImage.value) {
  nextBackgroundImage.value.src = nextBackgroundCookie.value;
}

const backgroundStore = useBackgroundImageStore();

onMounted(async () => {
  backgroundStore.getDailyImages().then(() => {
    backgroundStore.setBackgroundImage();

    if (backgroundImage.value) {
      backgroundImage.value.src = backgroundCookie.value;
    }

    nextBackgroundCookie.value = backgroundStore.getNextBackgroundImage();

    if (nextBackgroundImage.value) {
      nextBackgroundImage.value.src = nextBackgroundCookie.value;
    }
  });

  setInterval(() => {
    // if the image is already loaded, set the opacity to 100
    if (backgroundImage.value && backgroundImage.value.complete) {
      isLoaded.value = true;
    }
  }, 100);

  setInterval(() => {
    checkForNewImage();
  }, 1500);
});

const checkForNewImage = () => {
  if (
    backgroundCookie.value === backgroundStore.backgroundImageUrl ||
    backgroundStore.backgroundImageUrl === ""
  ) {
    return;
  }

  transitionToNextImage.value = true;

  setTimeout(() => {
    backgroundCookie.value = backgroundStore.backgroundImageUrl;

    if (backgroundImage.value) {
      backgroundImage.value.src = backgroundCookie.value;
    }

    setTimeout(() => {
      transitionToNextImage.value = false;

      setTimeout(() => {
        nextBackgroundCookie.value = backgroundStore.getNextBackgroundImage();
      }, 500);
    }, 1500);
  }, 500);
};

const onImgLoad = () => {
  console.log("loaded");
  isLoaded.value = true;
};
</script>
