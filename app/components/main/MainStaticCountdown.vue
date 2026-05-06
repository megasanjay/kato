<script lang="ts" setup>
const dayjs = useDayjs();
const now = ref(dayjs());

type IntervalConfig = {
  label: string;
  durationMs: number;
  pointsPerInterval: number;
  pointStepMs: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const INTERVALS: Record<string, IntervalConfig> = {
  minute: {
    label: "Minute",
    durationMs: 60 * 1000,
    pointsPerInterval: 60,
    pointStepMs: 1000,
  },
  hour: {
    label: "Hour",
    durationMs: 60 * 60 * 1000,
    pointsPerInterval: 60,
    pointStepMs: 60 * 1000,
  },
  day: {
    label: "Day",
    durationMs: DAY_MS,
    pointsPerInterval: 24,
    pointStepMs: 60 * 60 * 1000,
  },
  week: {
    label: "Week",
    durationMs: 7 * DAY_MS,
    pointsPerInterval: 7,
    pointStepMs: DAY_MS,
  },
  month: {
    label: "Month",
    durationMs: 30 * DAY_MS,
    pointsPerInterval: 30,
    pointStepMs: DAY_MS,
  },
  quarter: {
    label: "Quarter",
    durationMs: 91 * DAY_MS,
    pointsPerInterval: 91,
    pointStepMs: DAY_MS,
  },
  year: {
    label: "Year",
    durationMs: 365 * DAY_MS,
    pointsPerInterval: 365,
    pointStepMs: DAY_MS,
  },
};

const DEFAULT_INTERVAL: IntervalConfig = {
  label: "Minute",
  durationMs: 60 * 1000,
  pointsPerInterval: 60,
  pointStepMs: 1000,
};

const currentInterval = ref<IntervalConfig>(DEFAULT_INTERVAL);

let timer: ReturnType<typeof setInterval> | null = null;

const { data, error } = await useFetch("/api/static-countdown", {
  method: "GET",
});

if (error.value) {
  console.error("Failed to load static countdown:", error.value);

  // set the default interval in case of error
  currentInterval.value = DEFAULT_INTERVAL;
}

if (data.value) {
  currentInterval.value =
    INTERVALS[data.value.intervalName] ?? DEFAULT_INTERVAL;
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = dayjs();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<template>
  <div class="flex justify-end p-3">
    <div class="space-y-1">
      <p class="text-right text-[10px] text-white/35">{{ data }}</p>

      <div
        class="debug flex w-full flex-row-reverse flex-wrap-reverse content-end"
      >
        <div
          v-for="dot in currentInterval.pointsPerInterval"
          :key="dot"
          class="m-px flex items-center justify-center pl-1 text-white"
        >
          {{ dot }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap-reverse;
  flex-direction: row-reverse;
  align-content: flex-end;
  width: 100%;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px;
}
</style>
