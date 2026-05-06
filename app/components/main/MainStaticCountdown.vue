<script lang="ts" setup>
const dayjs = useDayjs();
const now = ref(dayjs());

type IntervalConfig = {
  label: string;
  pointsPerInterval: number;
};

const INTERVALS: Record<string, IntervalConfig> = {
  minute: {
    label: "minute",
    pointsPerInterval: 60,
  },
  hour: {
    label: "hour",
    pointsPerInterval: 60,
  },
  day: {
    label: "day",
    pointsPerInterval: 24,
  },
  "day-minute": {
    label: "day-minute",
    pointsPerInterval: 1440, // 24 * 60
  },
  week: {
    label: "week",
    pointsPerInterval: 7,
  },
  month: {
    label: "month",
    pointsPerInterval: 30,
  },
  quarter: {
    label: "quarter",
    pointsPerInterval: 91,
  },
  year: {
    label: "year",
    pointsPerInterval: 365,
  },
};

const DEFAULT_INTERVAL: IntervalConfig = {
  label: "minute",
  pointsPerInterval: 60,
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

const getPassedIntervalSegments = computed(() => {
  if (currentInterval.value.label === "minute") {
    return now.value.second();
  }

  if (currentInterval.value.label === "hour") {
    return now.value.minute();
  }

  if (currentInterval.value.label === "day") {
    return now.value.hour();
  }

  if (currentInterval.value.label === "day-minute") {
    return now.value.hour() * 60 + now.value.minute();
  }

  if (currentInterval.value.label === "week") {
    return (now.value.day() + 6) % 7; // day() returns sunday as 0, we want it to be monday as 0
  }

  if (currentInterval.value.label === "month") {
    return now.value.date() - 1; // date() returns 1-31, we want it to be 0-30
  }

  return dayjs().second();
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = dayjs();
  }, 500);
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
      <p class="text-right text-[10px] text-white/35">
        {{ getPassedIntervalSegments }} /
        {{ currentInterval.pointsPerInterval }}
      </p>

      <div class="flex w-full flex-row-reverse flex-wrap-reverse content-end">
        <div
          v-for="(point, index) in currentInterval.pointsPerInterval"
          :key="`${point}-${index}`"
          class="m-0.5 flex size-2 items-center justify-center rounded-full border text-xs transition-all"
          :class="{
            'border-white/75 bg-white/25':
              currentInterval.pointsPerInterval - index >
              getPassedIntervalSegments,
            'border-white/25 bg-transparent':
              currentInterval.pointsPerInterval - index <=
              getPassedIntervalSegments,
          }"
        />
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
