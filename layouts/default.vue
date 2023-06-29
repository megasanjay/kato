<template>
  <div
    class="relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-slate-900"
    :class="{ 'debug-screenss': devMode }"
  >
    <BackgroundWallpaperImage />

    <div class="grid-container vignette h-full w-full">
      <UiHeader />

      <div class="main-content-container">
        <div
          class="relative z-10 flex h-full items-start justify-start p-8 lg:px-16 lg:py-0"
        >
          <slot />
        </div>
      </div>

      <UiFooter />
    </div>
  </div>
</template>

<script setup>
const devMode = process.env.NODE_ENV === "development";
</script>

<style scoped>
.navigation-item {
  @apply font-semibold text-slate-600 transition-all hover:text-slate-800;
}

.dropdown-item {
  @apply flex w-full cursor-pointer items-center justify-start space-x-2 px-2 py-1 text-base font-normal text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800;
}
</style>
