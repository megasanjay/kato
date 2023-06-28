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

const localTimezone = ref("");
const local24Hour = ref(false);

const currentTime = ref("");
const mounted = ref(true);

const twentyFourHour = useCookie("twentyFourHour", {
  maxAge: 60 * 60 * 24 * 30,
});

const timeZone = useCookie("timeZone", {
  maxAge: 60 * 60 * 24 * 30,
});

const getCurrentTime = () => {
  timeZone.value =
    timeZone.value ||
    clockStore.timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "America/New_York";

  const timeFormat = twentyFourHour.value ? "H:mm" : "h:mm";

  if (timeZone.value !== null) {
    currentTime.value = dayjs().tz(timeZone.value).format(timeFormat);
  } else {
    currentTime.value = dayjs().format(timeFormat);
  }
};

onMounted(() => {
  mounted.value = true;

  localTimezone.value =
    clockStore.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  local24Hour.value = twentyFourHour.value === "true";

  setInterval(getCurrentTime, 100);
});

getCurrentTime();

// destroy timer on unmount
onUnmounted(() => {
  mounted.value = false;
});
</script>
