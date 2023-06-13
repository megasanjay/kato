<template>
  <div class="">
    <div class="text-[160px] font-black text-white drop-shadow-lg">
      {{ currentTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useClockStore } from "~/stores/clock";

const clockStore = useClockStore();

const currentTime = ref("");
const mounted = ref(true);

const getCurrentTime = () => {
  const format = clockStore.settingsDisplay24Hour ? "H:mm" : "h:mm";

  currentTime.value = dayjs().format(format);

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
