<template>
  <div class="background-image-container relative z-0 bg-slate-800">
    <!-- Show the new image on the top and fade in after loading -->

    <img
      ref="backgroundImageRef"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-all"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      @load="onImgLoad"
    />

    <img
      ref="nextBackgroundImageRef"
      class="absolute left-0 top-0 h-screen w-screen object-cover opacity-0 transition-opacity duration-500"
      :class="{
        'opacity-0': !transitionToNextImage,
        'opacity-100': transitionToNextImage,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const backgroundImageRef = ref<HTMLImageElement | null>(null);
const nextBackgroundImageRef = ref<HTMLImageElement | null>(null);

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

if (backgroundImageRef.value) {
  backgroundImageRef.value.src = backgroundCookie.value;

  // if the image is already loaded, set the opacity to 100
  if (backgroundImageRef.value.complete) {
    isLoaded.value = true;
  }
}

if (nextBackgroundImageRef.value) {
  nextBackgroundImageRef.value.src = nextBackgroundCookie.value;
}

const backgroundStore = useBackgroundImageStore();

const setNextBackgroundImage = () => {
  const nextBackgroundImage = backgroundStore.getNextBackgroundImage();

  nextBackgroundCookie.value = nextBackgroundImage;

  if (nextBackgroundImageRef.value) {
    nextBackgroundImageRef.value.src = nextBackgroundCookie.value;
  }
};

onMounted(async () => {
  backgroundStore.getDailyImages().then(() => {
    backgroundStore.setBackgroundImage();

    if (backgroundImageRef.value) {
      backgroundImageRef.value.src = backgroundCookie.value;
    }

    setNextBackgroundImage();
  });

  setInterval(() => {
    // if the image is already loaded, set the opacity to 100
    if (backgroundImageRef.value && backgroundImageRef.value.complete) {
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

    if (backgroundImageRef.value) {
      backgroundImageRef.value.src = backgroundStore.backgroundImageUrl;
    }

    setTimeout(() => {
      transitionToNextImage.value = false;

      setTimeout(setNextBackgroundImage, 500);
    }, 1500);
  }, 500);
};

const onImgLoad = () => {
  isLoaded.value = true;
};
</script>
