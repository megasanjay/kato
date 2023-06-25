<template>
  <div
    class="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-cover bg-center bg-no-repeat p-4"
    :class="{ 'debug-screenss': devMode }"
    :style="{
      backgroundImage:
        'url(' + backgroundImageStore.previousBackgroundImage.url + ')',
    }"
  >
    <transition name="blur" appear mode="out-in">
      <img
        :key="backgroundImage"
        :src="backgroundImage"
        alt=""
        class="fixed inset-0 z-0 h-full w-full object-cover"
      />
    </transition>

    <UiHeader />

    <div
      class="content relative z-10 flex h-full items-start justify-start p-4"
    >
      <slot />
      <!-- <span>{{ backgroundImage }}</span>
      <n-button @click="changeImage"> change image </n-button> -->
    </div>

    <UiFooter />
  </div>
</template>

<script setup>
import { useBackgroundImageStore } from "~/stores/backgroundImage";
const { auth } = useSupabaseAuthClient();

const devMode = process.env.NODE_ENV === "development";

const backgroundImageStore = useBackgroundImageStore();

const logout = async () => {
  await auth.signOut();
  window.location.href = "/";
};

const backgroundImage = computed(
  () => backgroundImageStore.backgroundImage.url
);
</script>

<style scoped>
.navigation-item {
  @apply font-semibold text-slate-600 transition-all hover:text-slate-800;
}

.dropdown-item {
  @apply flex w-full cursor-pointer items-center justify-start space-x-2 px-2 py-1 text-base font-normal text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800;
}
</style>
