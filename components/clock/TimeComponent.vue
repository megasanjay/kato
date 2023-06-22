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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useClockStore } from "~/stores/clock";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(timezone);

const clockStore = useClockStore();

const currentTime = ref("");
const mounted = ref(true);

const display24Hours = computed(() => clockStore.display24Hours);
const timeZone = computed(
  () => clockStore.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
);

const getCurrentTime = () => {
  const timeFormat = display24Hours.value ? "H:mm" : "h:mm";

  currentTime.value = dayjs().tz(timeZone.value).format(timeFormat);

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
