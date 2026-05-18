<script lang="ts" setup>
import type { RadioGroupItem } from "@nuxt/ui";
import { useRouter } from "vue-router";

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

const INTERVAL_OPTIONS = [
  {
    value: "minute",
    label: "Minute",
    description:
      "Shows the current minute split into 60 seconds. Updates every second.",
  },
  {
    value: "hour",
    label: "Hour",
    description:
      "Shows the current hour split into 60 minutes. Updates every minute.",
  },
  {
    value: "day",
    label: "Day (Hourly)",
    description:
      "Shows the current day split into 24 hours. Updates every hour.",
  },
  {
    value: "day-minute",
    label: "Day (Minute-by-Minute)",
    description:
      "Shows the full day split into 1,440 minutes. Updates every minute.",
  },
  {
    value: "week",
    label: "Week",
    description:
      "Shows the current week split into 7 days. Updates once per day.",
  },
  {
    value: "month",
    label: "Month",
    description:
      "Shows the current month split into 30 daily intervals. Updates once per day.",
  },
  {
    value: "quarter",
    label: "Quarter",
    description:
      "Shows the current quarter split into 3 months. Updates once per month.",
    disabled: true,
  },
  {
    value: "year",
    label: "Year (Daily)",
    description:
      "Shows the current year split into 365 days. Updates once per day.",
  },
  {
    value: "year-month",
    label: "Year (Monthly)",
    description:
      "Shows the current year split into 12 months. Updates once per month.",
  },
  {
    value: "workday",
    label: "Workday (9 AM - 5 PM)",
    description:
      "Tracks an 8-hour workday during business hours. Outside work hours, it counts down to the next workday - or to Monday on weekends.",
  },
];

const intervalItems = computed<RadioGroupItem[]>(() => INTERVAL_OPTIONS);
const toast = useToast();
const saving = ref(false);
const selectedInterval = ref("minute");
const router = useRouter();

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

const saveInterval = async (value: string) => {
  if (saving.value) {
    return;
  }

  saving.value = true;

  try {
    await $fetch("/api/static-countdown", {
      method: "PATCH",
      body: {
        intervalName: value,
      },
    });

    await refresh();

    toast.add({
      title: "Countdown updated",
      description: `Static countdown interval set to ${selectedInterval.value}.`,
      color: "success",
    });

    router.push("/"); // Navigate to the homepage after saving
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
  <div class="space-y-5 pb-6">
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
          Choose one setting that tracks your progress throughout the day, week,
          month, or year. The countdown widget will update at regular intervals
          based on your selection.
        </p>

        <URadioGroup
          v-model="selectedInterval"
          variant="card"
          color="secondary"
          :items="intervalItems"
          @update:model-value="(value) => saveInterval(value as string)"
        />
      </div>
    </UCard>
  </div>
</template>
