<template>
  <div
    class="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-slate-900"
    :class="{ 'debug-screenss': devMode }"
  >
    <BackgroundWallpaperImage />

    <UiHeader />

    <div
      class="content relative z-10 flex h-full items-start justify-start p-4"
    >
      <slot />
    </div>

    <UiFooter />
  </div>
</template>

<script setup>
const { auth } = useSupabaseAuthClient();

const devMode = process.env.NODE_ENV === "development";

const logout = async () => {
  await auth.signOut();
  window.location.href = "/";
};
</script>

<style scoped>
.navigation-item {
  @apply font-semibold text-slate-600 transition-all hover:text-slate-800;
}

.dropdown-item {
  @apply flex w-full cursor-pointer items-center justify-start space-x-2 px-2 py-1 text-base font-normal text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800;
}
</style>
