<template>
  <div v-if="currentTime" class="font-black text-white drop-shadow-lg">
    <span class="text-[160px]">
      {{ currentTime }}
    </span>
    <span class="text-[50px]"> % </span>
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

const timeZone = computed(() => clockStore.timeZone);

const getCurrentTime = () => {
  // set start time to 9;30 today
  const startTime = dayjs()
    .tz(timeZone.value)
    .set("hour", 9)
    .set("minute", 30)
    .set("second", 0);

  // set end time to 18:00 today
  const endTime = dayjs()
    .tz(timeZone.value)
    .set("hour", 17)
    .set("minute", 0)
    .set("second", 0);

  // get current time
  const now = dayjs();

  // get total time
  const totalTime = endTime.diff(startTime, "second");

  // get current time
  const elapsedTime = now.diff(startTime, "second");

  // get current percent
  const percent = Math.floor((elapsedTime / totalTime) * 100);

  // set current time
  if (percent > 100) {
    currentTime.value = `+${percent - 100}`;
  } else {
    currentTime.value = percent.toString();
  }

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
