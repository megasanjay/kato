<template>
  <div
    class="relative flex h-screen w-full flex-col justify-between bg-cover bg-center bg-no-repeat p-4"
    :class="{ 'debug-screenss': devMode }"
    :style="{
      backgroundImage:
        'url(' + backgroundImageStore.previousBackgroundImage + ')',
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

    <header class="relative z-10 flex w-full bg-red-500 px-4 py-2">
      <div class="dropdown-item" @click="logout">
        <Icon name="majesticons:logout" size="20" />
        <span> Logout </span>
      </div>
    </header>

    <div
      class="content relative z-10 flex h-full items-start justify-start p-4"
    >
      <slot />
      <!-- <span>{{ backgroundImage }}</span>
      <n-button @click="changeImage"> change image </n-button> -->
    </div>

    <footer
      class="group relative z-10 flex w-full cursor-pointer items-center justify-between px-4 py-2"
    >
      <nuxt-link v-if="!loggedIn" to="/settings">
        <div
          class="flex flex-row items-center justify-start space-x-2 text-white transition-all hover:text-cyan-200"
        >
          <Icon
            name="material-symbols:settings-b-roll-outline-rounded"
            size="20"
          />
          <div class="w-0 overflow-hidden transition-all group-hover:w-[64px]">
            Settings
          </div>
        </div>
      </nuxt-link>
    </footer>
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

const imageSources = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format",
];

const backgroundImage = computed(() => backgroundImageStore.backgroundImage);

let index = 0;

const changeImage = () => {
  index = (index + 1) % 3;

  backgroundImageStore.setBackgroundImage(imageSources[index]);

  console.log("Background image changed");
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
