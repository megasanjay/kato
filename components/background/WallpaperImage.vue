<template>
  <div class="background-image-container relative bg-slate-800">
    <!-- Show the new image on the top and fade in after loading -->
    <nuxt-img
      :src="foundation"
      class="absolute left-0 top-0 h-screen w-screen object-cover"
    />
    <nuxt-img
      :src="imageSource"
      class="absolute left-0 top-0 h-screen w-screen object-cover transition-opacity duration-300"
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
  </div>
</template>

<script setup lang="ts">
const isLoaded = ref(false);
const transitionToNextImage = ref(false);

const imageSource = ref("");
const nextImageSource = ref("");
const foundation = ref("");

import { useBackgroundImageStore } from "~/stores/backgroundImage";

// cookies should be set to expire after 3 days
const backgroundCookie = useCookie("background", {
  maxAge: 60 * 60 * 24 * 3,
});

const base64Image = useCookie("base64Image", {
  maxAge: 60 * 60 * 24 * 2,
});

const nextBackgroundCookie = useCookie("nextBackground", {
  maxAge: 60 * 60 * 24 * 3,
});

const backgroundStore = useBackgroundImageStore();

backgroundCookie.value =
  backgroundCookie.value ||
  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

nextBackgroundCookie.value =
  nextBackgroundCookie.value ||
  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

base64Image.value =
  base64Image.value ||
  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

imageSource.value = backgroundCookie.value;
nextImageSource.value = nextBackgroundCookie.value;
foundation.value = base64Image.value;

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
    foundation.value = base64Image.value;
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
      }, 500);
    }, 1500);
  }, 500);
};

const onImgLoad = () => {
  console.log("loaded");
  isLoaded.value = true;
};
</script>
