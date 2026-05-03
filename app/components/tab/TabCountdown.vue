<script setup lang="ts">
type RecurrenceUnit = "day" | "week" | "month" | "year";

interface Countdown {
  id: string;
  title: string;
  targetDate: string;
  recurring: boolean;
  recurrenceUnit: RecurrenceUnit | null;
  recurrenceValue: number | null;
  createdAt: string;
  updatedAt: string;
}

interface CountdownForm {
  title: string;
  targetDate: string;
  recurring: boolean;
  recurrenceUnit: RecurrenceUnit;
  recurrenceValue: number;
}

interface CountdownView extends Countdown {
  nextTargetAt: Date;
  progress: number;
  remainingMs: number;
  remainingLabel: string;
  hoverLabel: string;
  recurringLabel: string | null;
  isComplete: boolean;
}

const { loggedIn } = useUserSession();
const toast = useToast();

const TITLE_MAX_LENGTH = 120;
const ITEM_LIMIT = 100;

const { data, error } = await useFetch<Countdown[]>("/api/countdown");

const countdowns = ref<Countdown[]>(data.value ?? []);

if (error.value) {
  console.error("Error fetching countdowns:", error.value);
}

const now = ref(Date.now());
let timer: number | null = null;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer !== null) {
    window.clearInterval(timer);
  }
});

const isModalOpen = ref(false);
const isSaving = ref(false);
const editingId = ref<string | null>(null);

const form = reactive<CountdownForm>({
  title: "",
  targetDate: "",
  recurring: false,
  recurrenceUnit: "year",
  recurrenceValue: 1,
});

const resetForm = () => {
  form.title = "";
  form.targetDate = "";
  form.recurring = false;
  form.recurrenceUnit = "year";
  form.recurrenceValue = 1;
  editingId.value = null;
};

const toDateTimeLocal = (value: string | Date) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);

  return local.toISOString().slice(0, 16);
};

const openCreateModal = () => {
  resetForm();
  form.targetDate = toDateTimeLocal(new Date(Date.now() + 24 * 60 * 60 * 1000));
  isModalOpen.value = true;
};

const openEditModal = (countdown: Countdown) => {
  editingId.value = countdown.id;
  form.title = countdown.title;
  form.targetDate = toDateTimeLocal(countdown.targetDate);
  form.recurring = countdown.recurring;
  form.recurrenceUnit = countdown.recurrenceUnit ?? "year";
  form.recurrenceValue = countdown.recurrenceValue ?? 1;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const titleCharCount = computed(() => form.title.length);
const titleAtLimit = computed(() => titleCharCount.value >= TITLE_MAX_LENGTH);

const addInterval = (source: Date, unit: RecurrenceUnit, amount: number) => {
  const next = new Date(source);

  if (unit === "day") {
    next.setDate(next.getDate() + amount);
  } else if (unit === "week") {
    next.setDate(next.getDate() + amount * 7);
  } else if (unit === "month") {
    next.setMonth(next.getMonth() + amount);
  } else {
    next.setFullYear(next.getFullYear() + amount);
  }

  return next;
};

const getSchedule = (countdown: Countdown, referenceMs: number) => {
  const baseTarget = new Date(countdown.targetDate);
  const createdAt = new Date(countdown.createdAt);

  if (
    !countdown.recurring ||
    !countdown.recurrenceUnit ||
    !countdown.recurrenceValue
  ) {
    return {
      previousTargetAt: createdAt,
      nextTargetAt: baseTarget,
    };
  }

  let previousTargetAt = createdAt;
  let nextTargetAt = new Date(baseTarget);
  let guard = 0;

  while (nextTargetAt.getTime() <= referenceMs && guard < 1000) {
    previousTargetAt = new Date(nextTargetAt);
    nextTargetAt = addInterval(
      nextTargetAt,
      countdown.recurrenceUnit,
      countdown.recurrenceValue,
    );
    guard += 1;
  }

  return {
    previousTargetAt,
    nextTargetAt,
  };
};

const pluralize = (value: number, unit: string) => {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
};

const getTimeParts = (targetAt: Date, referenceMs: number) => {
  let cursor = new Date(referenceMs);
  const targetMs = targetAt.getTime();

  if (targetMs <= referenceMs) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    };
  }

  const countWholeUnits = (
    unit: "year" | "month",
    from: Date,
    endMs: number,
  ) => {
    let count = 0;
    let pointer = new Date(from);

    while (count < 1000) {
      const next = addInterval(pointer, unit, 1);

      if (next.getTime() > endMs) {
        break;
      }

      pointer = next;
      count += 1;
    }

    return { count, pointer };
  };

  const yearsResult = countWholeUnits("year", cursor, targetMs);
  cursor = yearsResult.pointer;

  const monthsResult = countWholeUnits("month", cursor, targetMs);
  cursor = monthsResult.pointer;

  let remaining = targetMs - cursor.getTime();
  const days = Math.floor(remaining / 86_400_000);
  remaining -= days * 86_400_000;
  const hours = Math.floor(remaining / 3_600_000);
  remaining -= hours * 3_600_000;
  const minutes = Math.floor(remaining / 60_000);
  remaining -= minutes * 60_000;
  const seconds = Math.floor(remaining / 1_000);

  return {
    years: yearsResult.count,
    months: monthsResult.count,
    days,
    hours,
    minutes,
    seconds,
    totalMs: targetMs - referenceMs,
  };
};

const formatRemaining = (countdown: Countdown, referenceMs: number) => {
  const { nextTargetAt } = getSchedule(countdown, referenceMs);
  const parts = getTimeParts(nextTargetAt, referenceMs);

  if (parts.totalMs <= 0) {
    return {
      remainingMs: 0,
      remainingLabel: "Completed",
      hoverLabel: "0 years, 0 months, 0 days, 0 hours, 0 minutes, 0 seconds",
      nextTargetAt,
    };
  }

  const concise = [
    parts.years > 0 ? pluralize(parts.years, "year") : null,
    parts.months > 0 ? pluralize(parts.months, "month") : null,
    parts.days > 0 ? pluralize(parts.days, "day") : null,
    parts.hours > 0 ? pluralize(parts.hours, "hour") : null,
    parts.minutes > 0 ? pluralize(parts.minutes, "minute") : null,
    pluralize(parts.seconds, "second"),
  ].filter(Boolean);

  return {
    remainingMs: parts.totalMs,
    remainingLabel: concise.slice(0, 2).join(", "),
    hoverLabel: [
      pluralize(parts.years, "year"),
      pluralize(parts.months, "month"),
      pluralize(parts.days, "day"),
      pluralize(parts.hours, "hour"),
      pluralize(parts.minutes, "minute"),
      pluralize(parts.seconds, "second"),
    ].join(", "),
    nextTargetAt,
  };
};

const formatRecurringLabel = (countdown: Countdown) => {
  if (
    !countdown.recurring ||
    !countdown.recurrenceUnit ||
    !countdown.recurrenceValue
  ) {
    return null;
  }

  return `Every ${countdown.recurrenceValue} ${countdown.recurrenceUnit}${countdown.recurrenceValue === 1 ? "" : "s"}`;
};

const getProgress = (countdown: Countdown, referenceMs: number) => {
  const { previousTargetAt, nextTargetAt } = getSchedule(
    countdown,
    referenceMs,
  );
  const startMs = previousTargetAt.getTime();
  const endMs = nextTargetAt.getTime();
  const total = Math.max(endMs - startMs, 1);
  const elapsed = Math.min(Math.max(referenceMs - startMs, 0), total);

  return Math.round((elapsed / total) * 100);
};

const sortedCountdowns = computed<CountdownView[]>(() => {
  const referenceMs = now.value;

  return countdowns.value
    .map((countdown) => {
      const timing = formatRemaining(countdown, referenceMs);

      return {
        ...countdown,
        nextTargetAt: timing.nextTargetAt,
        progress: getProgress(countdown, referenceMs),
        remainingMs: timing.remainingMs,
        remainingLabel: timing.remainingLabel,
        hoverLabel: timing.hoverLabel,
        recurringLabel: formatRecurringLabel(countdown),
        isComplete: timing.remainingMs <= 0,
      };
    })
    .sort((left, right) => {
      if (left.isComplete !== right.isComplete) {
        return left.isComplete ? 1 : -1;
      }

      if (left.remainingMs !== right.remainingMs) {
        return left.remainingMs - right.remainingMs;
      }

      return left.title.localeCompare(right.title);
    });
});

const saveCountdown = async () => {
  const title = form.title.trim();

  if (!title || !form.targetDate) {
    return;
  }

  isSaving.value = true;

  const payload = {
    title,
    targetDate: new Date(form.targetDate).toISOString(),
    recurring: form.recurring,
    recurrenceUnit: form.recurring ? form.recurrenceUnit : null,
    recurrenceValue: form.recurring ? form.recurrenceValue : null,
  };

  try {
    if (editingId.value) {
      const updated = await $fetch<Countdown>(
        `/api/countdown/${editingId.value}`,
        {
          method: "PATCH",
          body: payload,
        },
      );

      const index = countdowns.value.findIndex(
        (countdown) => countdown.id === updated.id,
      );

      if (index !== -1) {
        countdowns.value.splice(index, 1, updated);
      }
    } else {
      if (countdowns.value.length >= ITEM_LIMIT) {
        toast.add({
          title: "Limit reached",
          description: `You've reached the ${ITEM_LIMIT} countdown limit. Delete some to add more.`,
          color: "error",
        });

        return;
      }

      const created = await $fetch<Countdown>("/api/countdown", {
        method: "POST",
        body: payload,
      });

      countdowns.value.push(created);
    }

    closeModal();
  } catch (cause) {
    toast.add({
      title: editingId.value
        ? "Failed to update countdown"
        : "Failed to add countdown",
      description: "Please check the values and try again.",
      color: "error",
    });
    console.error("Failed to save countdown:", cause);
  } finally {
    isSaving.value = false;
  }
};

const deleteCountdown = async (id: string) => {
  const index = countdowns.value.findIndex((countdown) => countdown.id === id);

  if (index === -1) {
    return;
  }

  const removed = countdowns.value[index];

  if (!removed) {
    return;
  }

  countdowns.value.splice(index, 1);

  try {
    await $fetch(`/api/countdown/${id}`, {
      method: "DELETE",
    });
  } catch (cause) {
    countdowns.value.splice(index, 0, removed);
    console.error("Failed to delete countdown:", cause);
  }
};

watch(
  () => form.recurring,
  (recurring) => {
    if (!recurring) {
      form.recurrenceUnit = "year";
      form.recurrenceValue = 1;
    }
  },
);
</script>

<template>
  <div>
    <p v-if="!loggedIn" class="mt-2 ml-1 text-sm text-white/20">
      This feature is only available to logged-in users. <br />
      Please
      <NuxtLink
        to="/login"
        class="underline underline-offset-2 transition-colors hover:text-white/80"
        >log in</NuxtLink
      >
      or
      <NuxtLink
        to="/signup"
        class="underline underline-offset-2 transition-colors hover:text-white/80"
        >sign up</NuxtLink
      >
      for access to this feature!
    </p>

    <div v-else class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-white/25">
          Track important dates with a simple progress view.
        </p>

        <button
          type="button"
          class="cursor-pointer text-white/30 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="countdowns.length >= ITEM_LIMIT"
          @click="openCreateModal"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
        </button>
      </div>

      <UModal
        v-model:open="isModalOpen"
        :title="editingId ? 'Edit countdown' : 'Add countdown'"
      >
        <template #body>
          <div class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs tracking-[0.16em] text-white/25 uppercase">
                Title
              </label>

              <div class="relative">
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Anniversary"
                  :maxlength="TITLE_MAX_LENGTH"
                  class="w-full border-b border-white/10 bg-transparent pb-2 text-sm text-white/70 placeholder-white/40 transition-colors outline-none focus:border-white/30"
                />

                <span
                  v-if="form.title.length > 0"
                  class="absolute right-0 bottom-2 text-xs transition-colors"
                  :class="titleAtLimit ? 'text-red-400/70' : 'text-white/25'"
                >
                  {{ titleCharCount }}/{{ TITLE_MAX_LENGTH }}
                </span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs tracking-[0.16em] text-white/25 uppercase">
                Target date
              </label>

              <input
                v-model="form.targetDate"
                type="datetime-local"
                class="w-full border-b border-white/10 bg-transparent pb-2 text-sm text-white/70 transition-colors outline-none focus:border-white/30"
              />
            </div>

            <label
              class="flex items-center justify-between gap-3 text-sm text-white/55"
            >
              <span>Recurring</span>

              <input
                v-model="form.recurring"
                type="checkbox"
                class="size-4 rounded border border-white/20 bg-transparent accent-white/60"
              />
            </label>

            <div
              v-if="form.recurring"
              class="grid grid-cols-[minmax(0,1fr)_96px] gap-3"
            >
              <select
                v-model="form.recurrenceUnit"
                class="border-b border-white/10 bg-transparent pb-2 text-sm text-white/70 transition-colors outline-none focus:border-white/30"
              >
                <option value="day">Day</option>

                <option value="week">Week</option>

                <option value="month">Month</option>

                <option value="year">Year</option>
              </select>

              <input
                v-model.number="form.recurrenceValue"
                type="number"
                min="1"
                max="365"
                class="border-b border-white/10 bg-transparent pb-2 text-sm text-white/70 transition-colors outline-none focus:border-white/30"
              />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex w-full items-center justify-between gap-3">
            <button
              type="button"
              class="text-sm text-white/25 transition-colors hover:text-white/55"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              type="button"
              class="text-sm text-white/40 transition-colors hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="isSaving || !form.title.trim() || !form.targetDate"
              @click="saveCountdown"
            >
              {{
                isSaving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Add countdown"
              }}
            </button>
          </div>
        </template>
      </UModal>

      <TransitionGroup
        name="countdown-item"
        tag="ul"
        class="relative flex flex-col gap-3"
      >
        <li
          v-for="countdown in sortedCountdowns"
          :key="countdown.id"
          class="group/item flex items-start gap-3"
          :title="countdown.hoverLabel"
        >
          <button
            type="button"
            class="min-w-0 flex-1 cursor-pointer text-left"
            @click="openEditModal(countdown)"
          >
            <div class="mb-1 flex items-baseline justify-between gap-3">
              <div class="min-w-0">
                <p
                  class="truncate text-sm text-white/60 transition-colors group-hover/item:text-white/80"
                >
                  {{ countdown.title }}
                </p>

                <p class="text-xs text-white/30">
                  {{ countdown.remainingLabel }}
                  <span v-if="countdown.recurringLabel">
                    · {{ countdown.recurringLabel }}
                  </span>
                </p>
              </div>

              <p class="shrink-0 text-[11px] text-white/20">
                {{ countdown.nextTargetAt.toLocaleDateString() }}
              </p>
            </div>

            <UProgress
              :model-value="countdown.progress"
              status
              color="neutral"
              class="w-full"
            />
          </button>

          <button
            type="button"
            class="mt-1 shrink-0 cursor-pointer text-white/0 transition-colors group-hover/item:text-white/25 hover:!text-white/50"
            @click="deleteCountdown(countdown.id)"
          >
            <UIcon name="material-symbols:delete" class="size-3.5" />
          </button>
        </li>
      </TransitionGroup>

      <p v-if="sortedCountdowns.length === 0" class="text-sm text-white/25">
        No countdowns yet. Add one to start tracking.
      </p>
    </div>
  </div>
</template>

<style scoped>
.countdown-item-move,
.countdown-item-enter-active,
.countdown-item-leave-active {
  transition: all 0.25s ease;
}

.countdown-item-enter-from,
.countdown-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.countdown-item-leave-active {
  position: absolute;
  width: 100%;
}
</style>
