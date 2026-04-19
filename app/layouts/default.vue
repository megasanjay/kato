<script setup lang="ts">
const devMode = process.env.NODE_ENV === "development";
</script>

<template>
  <div
    class="relative flex h-screen w-screen flex-col justify-start overflow-hidden bg-slate-900"
    :class="{ 'debug-screenss': devMode }"
  >
    <BackgroundWallpaperImage />

    <div class="vignette h-full p-20 pt-2">
      <slot />
    </div>
  </div>
</template>
