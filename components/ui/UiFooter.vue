<template>
  <footer
    class="footer-container relative z-10 flex w-full items-center justify-end px-8 pb-4"
  >
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
