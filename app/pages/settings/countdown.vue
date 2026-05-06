<script lang="ts" setup>
import type { RadioGroupItem } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
  layout: "settings",
});

useSeoMeta({
  title: "Countdown Settings",
});

type StaticCountdownResponse = {
  intervalName: string;
};

type IntervalOption = {
  value: string;
  label: string;
  description: string;
};

const INTERVAL_OPTIONS: IntervalOption[] = [
  {
    value: "minute",
    label: "Minute",
    description: "60 intervals, updates every second",
  },
  {
    value: "hour",
    label: "Hour",
    description: "60 intervals, updates every minute",
  },
  {
    value: "day",
    label: "Day (hour updates)",
    description: "24 intervals, updates every hour",
  },
  {
    value: "day-minute",
    label: "Day (minute updates)",
    description: "1440 intervals, updates every minute",
  },
  {
    value: "week",
    label: "Week",
    description: "7 intervals, updates every day",
  },
  {
    value: "month",
    label: "Month",
    description: "30 intervals, updates every day",
  },
  {
    value: "quarter",
    label: "Quarter",
    description: "3 intervals, updates every month",
  },
  {
    value: "year",
    label: "Year",
    description: "365 intervals, updates every day",
  },
  {
    value: "year-month",
    label: "Year (Month updates)",
    description: "12 intervals, updates every month",
  },
];

const intervalItems = computed<RadioGroupItem[]>(() => INTERVAL_OPTIONS);

const toast = useToast();
const saving = ref(false);
const selectedInterval = ref("minute");

const { data, error, status, refresh } =
  await useFetch<StaticCountdownResponse>("/api/static-countdown", {
    method: "GET",
  });

if (error.value) {
  toast.add({
    title: "Unable to load countdown settings",
    description:
      error.value.data?.message ||
      "An error occurred while loading static countdown settings.",
    color: "error",
  });
}

watchEffect(() => {
  if (data.value?.intervalName) {
    selectedInterval.value = data.value.intervalName;
  }
});

const currentOption = computed(
  (): IntervalOption =>
    INTERVAL_OPTIONS.find(
      (option) => option.value === selectedInterval.value,
    ) || INTERVAL_OPTIONS[0]!,
);

const saveInterval = async () => {
  if (saving.value) {
    return;
  }

  saving.value = true;

  try {
    await $fetch("/api/static-countdown", {
      method: "PATCH",
      body: {
        intervalName: selectedInterval.value,
      },
    });

    await refresh();

    toast.add({
      title: "Countdown updated",
      description: `Static countdown interval set to ${currentOption.value.label}.`,
      color: "success",
    });
  } catch (cause: unknown) {
    const message =
      cause && typeof cause === "object" && "data" in cause
        ? (cause as { data?: { message?: string } }).data?.message
        : undefined;

    toast.add({
      title: "Update failed",
      description: message || "Could not update the static countdown interval.",
      color: "error",
    });
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-5 py-6">
    <UPageHeader
      title="Countdown Settings"
      description="Set the static interval used by the always-on countdown widget."
    />

    <UCard title="Static Interval">
      <div v-if="status === 'pending' && !data" class="py-4">
        Loading countdown settings...
      </div>

      <div v-else class="space-y-4">
        <p class=" ">
          Choose one settings that tracks your progress throughout the day,
          week, month, or year. The countdown widget will update at regular
          intervals based on your selection.
        </p>

        <URadioGroup
          v-model="selectedInterval"
          variant="card"
          color="secondary"
          :items="intervalItems"
        />

        <UCard>
          <div class="space-y-1">
            <p class="font-medium">
              {{ currentOption.label }}
            </p>

            <p class="text-xs">
              {{ currentOption.description }}
            </p>
          </div>
        </UCard>

        <div class="flex justify-end">
          <UButton
            color="success"
            icon="material-symbols:save"
            variant="subtle"
            :loading="saving"
            @click="saveInterval"
          >
            Save Interval
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
