<template>
  <transition name="blur" appear mode="out-in">
    <img
      :key="backgroundImage"
      :src="backgroundImage"
      alt=""
      class="fixed inset-0 z-0 h-full w-full object-cover"
    />
  </transition>
</template>

<script setup>
import { useBackgroundImageStore } from "~/stores/backgroundImage";
const backgroundImageStore = useBackgroundImageStore();

const backgroundImage = computed(() => backgroundImageStore.backgroundImage);
</script>
