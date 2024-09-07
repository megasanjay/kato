<template>
  <footer
    class="footer-container relative z-10 flex w-full items-center justify-end px-8 pb-4"
  >
    <nuxt-link
      to="/settings"
      class="group relative z-10 cursor-pointer text-white hover:text-cyan-200"
    >
      <div
        class="flex flex-row items-center justify-start space-x-2 transition-all"
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

    <pre class="text-white"></pre>

    <transition name="fast-fade-blur" appear>
      <div v-show="showLoader" class="absolute -top-[60px] right-6">
        <LoadersSunLoader />
      </div>
    </transition>
  </footer>
</template>

<script setup lang="ts">
import { useLoaderStore } from "@/stores/loader";

const loaderStore = useLoaderStore();

const showLoader = computed(() => loaderStore.loadingQueue.length > 0);
</script>
