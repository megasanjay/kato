<template>
  <footer
    class="relative z-10 flex w-full items-center justify-between px-4 py-2"
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

    <transition name="fast-fade-blur" appear>
      <div v-if="requestsInFlight" class="absolute -top-[50px] left-0">
        <LoadersSunLoader />
      </div>
    </transition>
  </footer>
</template>

<script setup lang="ts">
import { useLoaderStore } from "@/stores/loader";

const { requestsInFlight } = useLoaderStore();
</script>
