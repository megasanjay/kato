<template>
  <div
    v-if="currentTime"
    class="text-[160px] font-black text-white drop-shadow-lg"
  >
    {{ currentTime }}
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useClockStore } from "~/stores/clock";

const clockStore = useClockStore();

const currentTime = ref("");
const mounted = ref(true);

const display24Hours = computed(() => clockStore.display24Hours);

const getCurrentTime = () => {
  const timeFormat = display24Hours.value ? "H:mm" : "h:mm";

  currentTime.value = dayjs().format(timeFormat);

  if (mounted.value) {
    setTimeout(getCurrentTime, 1000);
  }
};

onMounted(() => {
  mounted.value = true;
});

getCurrentTime();

// destroy timer on unmount
onUnmounted(() => {
  mounted.value = false;
});
</script>
