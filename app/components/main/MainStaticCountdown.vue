<script lang="ts" setup>
const dayjs = useDayjs();
const now = ref(dayjs());

type IntervalConfig = {
  label: string;
  pointsPerInterval: number;
  unitSingular: string;
  unitPlural: string;
};

const INTERVALS: Record<string, IntervalConfig> = {
  minute: {
    label: "minute",
    pointsPerInterval: 60,
    unitSingular: "second",
    unitPlural: "seconds",
  },
  hour: {
    label: "hour",
    pointsPerInterval: 60,
    unitSingular: "minute",
    unitPlural: "minutes",
  },
  day: {
    label: "day",
    pointsPerInterval: 24,
    unitSingular: "hour",
    unitPlural: "hours",
  },
  "day-minute": {
    label: "day-minute",
    pointsPerInterval: 1440, // 24 * 60
    unitSingular: "minute",
    unitPlural: "minutes",
  },
  week: {
    label: "week",
    pointsPerInterval: 7,
    unitSingular: "day",
    unitPlural: "days",
  },
  month: {
    label: "month",
    pointsPerInterval: 30,
    unitSingular: "day",
    unitPlural: "days",
  },
  quarter: {
    label: "quarter",
    pointsPerInterval: 91,
    unitSingular: "day",
    unitPlural: "days",
  },
  year: {
    label: "year",
    pointsPerInterval: 365,
    unitSingular: "day",
    unitPlural: "days",
  },
  "year-month": {
    label: "year-month",
    pointsPerInterval: 12,
    unitSingular: "month",
    unitPlural: "months",
  },
  workday: {
    label: "workday",
    pointsPerInterval: 8, // fixed 8-hour workday span
    unitSingular: "hour",
    unitPlural: "hours",
  },
};

const DEFAULT_INTERVAL: IntervalConfig = {
  label: "minute",
  pointsPerInterval: 60,
  unitSingular: "second",
  unitPlural: "seconds",
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

const currentIntervalUnit = computed(() => {
  const config = data.value
    ? (INTERVALS[data.value.intervalName] ?? DEFAULT_INTERVAL)
    : DEFAULT_INTERVAL;

  return currentIntervalPointsPerInterval.value === 1
    ? config.unitSingular
    : config.unitPlural;
});

const currentIntervalPointsPerInterval = computed(() => {
  if (currentIntervalLabel.value === "month") {
    return now.value.daysInMonth();
  }
  if (currentIntervalLabel.value === "workday") {
    const day = now.value.day();
    const hour = now.value.hour();
    const isWeekendSpan =
      (day === 5 && hour >= 17) ||
      day === 6 ||
      day === 0 ||
      (day === 1 && hour < 9);
    const isDuringWork = !isWeekendSpan && hour >= 9 && hour < 17;

    if (isDuringWork) {
      return 8;
    }
    if (isWeekendSpan) {
      // Fri 17:00 → Mon 09:00 = 7 + 24 + 24 + 9 = 64 hours
      return 64;
    }
    // Weekday off-hours countdown: hours until next 9 AM
    if (hour < 9) {
      return 9 - hour;
    }

    return 24 - hour + 9;
  }

  return data.value
    ? (INTERVALS[data.value.intervalName]?.pointsPerInterval ??
        DEFAULT_INTERVAL.pointsPerInterval)
    : DEFAULT_INTERVAL.pointsPerInterval;
});

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
    return (now.value.day() + 6) % 7;
  }
  if (currentIntervalLabel.value === "month") {
    return now.value.date() - 1;
  }
  if (currentIntervalLabel.value === "year") {
    // Return the number of days passed in the year (0-based)
    return now.value.dayOfYear() - 1;
  }
  if (currentIntervalLabel.value === "year-month") {
    return now.value.month(); // 0 = January, 11 = December
  }
  if (currentIntervalLabel.value === "workday") {
    const day = now.value.day();
    const hour = now.value.hour();
    const isWeekendSpan =
      (day === 5 && hour >= 17) ||
      day === 6 ||
      day === 0 ||
      (day === 1 && hour < 9);
    const isDuringWork = !isWeekendSpan && hour >= 9 && hour < 17;

    if (isDuringWork) {
      return hour - 9;
    }
    if (isWeekendSpan) {
      // Hours elapsed since Friday 17:00
      if (day === 5) return hour - 17;
      if (day === 6) return 7 + hour;
      if (day === 0) return 31 + hour;

      return 55 + hour; // Monday before 9
    }

    return 0; // weekday off-hours: full countdown bar
  }

  return dayjs().second();
});

const cursorIndex = computed(() => {
  const totalPoints = currentIntervalPointsPerInterval.value;
  const passedPoints = getPassedIntervalSegments.value;

  return totalPoints - passedPoints - 1;
});

const statsText = computed(() => {
  const passed = getPassedIntervalSegments.value;
  const total = currentIntervalPointsPerInterval.value;

  return {
    p: passed + 1, // 1-based position for the inline label
    t: total,
    remaining: total - passed, // units left including the current one
    percentage: ((passed / total) * 100).toFixed(1),
  };
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
      <div class="flex justify-end">
        <UTooltip
          :text="`${statsText.remaining} ${currentIntervalUnit} remaining · ${statsText.percentage}% complete`"
          mode="hover"
        >
          <p class="cursor-help text-right text-[8px] text-white/35">
            {{ statsText.p }}/{{ statsText.t }} - {{ statsText.percentage }}%
          </p>
        </UTooltip>
      </div>

      <div
        :key="
          currentIntervalLabel !== 'minute' && currentIntervalLabel !== 'hour'
            ? currentIntervalLabel
            : getPassedIntervalSegments // Force re-render every second for minute interval to keep cursor blinking
        "
        class="flex w-full flex-row-reverse flex-wrap-reverse content-end items-center"
      >
        <div
          v-for="(point, index) in currentIntervalPointsPerInterval"
          :key="`${point}-${index}`"
          class="mt-[2px] ml-[2px] flex h-[4px] w-[4px] origin-bottom items-center justify-center rounded-none border border-white/10 bg-white/5 text-xs transition-all duration-300 ease-in-out"
          :class="{
            'border-white/75 bg-white/30': index === cursorIndex,
            'cursor-blink':
              currentIntervalLabel !== 'minute' && index === cursorIndex, // Emphasize the cursor for non-minute and non-hour intervals
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

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}

.cursor-blink {
  animation: cursor-blink 2s ease-in-out infinite;
}
</style>
