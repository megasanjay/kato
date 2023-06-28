<template>
  <div class="background-image-container relative bg-slate-800">
    <!-- Show the new image on the top and fade in after loading -->
    <img
      ref="backgroundPlaceholder"
      class="absolute left-0 top-0 h-screen w-screen object-cover"
    />

    <img
      ref="backgroundImage"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-opacity duration-300"
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
const backgroundPlaceholder = ref<HTMLImageElement | null>(null);
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

if (backgroundPlaceholder.value) {
  backgroundPlaceholder.value.src = base64Image.value;
}

console.log("backgroundCookie", backgroundCookie.value);

if (backgroundImage.value) {
  backgroundImage.value.src = backgroundCookie.value;
}

console.log("nextBackgroundCookie", nextBackgroundCookie.value);

if (nextBackgroundImage.value) {
  nextBackgroundImage.value.src = nextBackgroundCookie.value;
}

const backgroundStore = useBackgroundImageStore();

onMounted(async () => {
  backgroundStore.getDailyImages().then(() => {
    backgroundStore.setBackgroundImage();

    nextBackgroundCookie.value = backgroundStore.getNextBackgroundImage();

    if (nextBackgroundImage.value) {
      nextBackgroundImage.value.src = nextBackgroundCookie.value;
    }
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

    if (backgroundPlaceholder.value) {
      backgroundPlaceholder.value.src =
        backgroundStore.backgroundImage.blurHash;
    }
  }

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

        if (nextBackgroundImage.value) {
          nextBackgroundImage.value.src = nextBackgroundCookie.value;
        }
      }, 500);
    }, 1500);
  }, 500);
};

const onImgLoad = () => {
  console.log("loaded");
  isLoaded.value = true;
};
</script>
