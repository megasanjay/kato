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

let timer: ReturnType<typeof setInterval> | null = null;

const { data, error } = await useFetch("/api/static-countdown", {
  method: "GET",
});

if (error.value) {
  console.error("Failed to load static countdown:", error.value);
}

const currentIntervalLabel = computed(() =>
  data.value
    ? (INTERVALS[data.value.intervalName]?.label ?? DEFAULT_INTERVAL.label)
    : DEFAULT_INTERVAL.label,
);

const currentIntervalPointsPerInterval = computed(() =>
  data.value
    ? (INTERVALS[data.value.intervalName]?.pointsPerInterval ??
      DEFAULT_INTERVAL.pointsPerInterval)
    : DEFAULT_INTERVAL.pointsPerInterval,
);

const getPassedIntervalSegments = computed(() => {
  if (currentIntervalLabel.value === "minute") {
    return now.value.second();
  }

  if (currentIntervalLabel.value === "hour") {
    return now.value.minute();
  }

  if (currentIntervalLabel.value === "day") {
    return now.value.hour();
  }

  if (currentIntervalLabel.value === "day-minute") {
    return now.value.hour() * 60 + now.value.minute();
  }

  if (currentIntervalLabel.value === "week") {
    return (now.value.day() + 6) % 7; // day() returns sunday as 0, we want it to be monday as 0
  }

  if (currentIntervalLabel.value === "month") {
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
        {{ currentIntervalPointsPerInterval }}
      </p>

      <div
        :key="getPassedIntervalSegments"
        class="flex w-full flex-row-reverse flex-wrap-reverse content-end"
      >
        <div
          v-for="(point, index) in currentIntervalPointsPerInterval"
          :key="`${point}-${index}`"
          class="mt-0.5 ml-0.5 flex size-2 items-center justify-center rounded-full border text-xs transition-all"
          :class="{
            'border-white/75 bg-white/25':
              currentIntervalPointsPerInterval - index >
              getPassedIntervalSegments,
            'border-white/25 bg-transparent':
              currentIntervalPointsPerInterval - index <=
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
