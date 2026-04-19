<script setup lang="ts">
const devMode = process.env.NODE_ENV === "development";
</script>

<template>
  <div
    class="relative flex h-screen w-screen flex-col justify-start overflow-hidden bg-slate-900"
    :class="{ 'debug-screenss': devMode }"
  >
    <WallpaperImage />

    <div class="z-10 h-full">
      <slot />
    </div>
  </div>
</template>
