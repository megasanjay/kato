<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

// Pomodoro timer — fully local, no API.
// Synthesises a short tone via Web Audio API when each phase ends.

type Phase = "work" | "short-break" | "long-break";

const PHASES: Record<Phase, { label: string; duration: number }> = {
  work: { label: "Focus", duration: 25 * 60 },
  "short-break": { label: "Short break", duration: 5 * 60 },
  "long-break": { label: "Long break", duration: 15 * 60 },
};

const WORK_SESSIONS_BEFORE_LONG_BREAK = 4;

const _cookie = useCookie<{
  phase: Phase;
  remaining: number;
  sessionsCompleted: number;
  startedAt: number | null;
}>("pomodoro", {
  maxAge: 3600,
  default: () => ({
    phase: "work" as Phase,
    remaining: PHASES["work"].duration,
    sessionsCompleted: 0,
    startedAt: null,
  }),
});

const phase = ref<Phase>(_cookie.value.phase);
const remaining = ref(_cookie.value.remaining);
const running = ref(false);
const sessionsCompleted = ref(_cookie.value.sessionsCompleted);
const startedAt = ref<number | null>(null);

watch([phase, remaining, sessionsCompleted, startedAt], () => {
  _cookie.value = {
    phase: phase.value,
    remaining: remaining.value,
    sessionsCompleted: sessionsCompleted.value,
    startedAt: startedAt.value,
  };
});

let interval: ReturnType<typeof setInterval> | null = null;

const tabItems: TabsItem[] = [
  { label: "Focus", value: "work" },
  { label: "Short break", value: "short-break" },
  { label: "Long break", value: "long-break" },
];

const minutes = computed(() =>
  String(Math.floor(remaining.value / 60)).padStart(2, "0"),
);
const seconds = computed(() => String(remaining.value % 60).padStart(2, "0"));

const progressValue = computed(() =>
  Math.round((1 - remaining.value / PHASES[phase.value].duration) * 100),
);

const playTone = () => {
  try {
    const ctx = new AudioContext();
    const frequencies = [880, 660, 440];
    let offset = 0;

    for (const freq of frequencies) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + offset + 0.4,
      );

      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.4);
      offset += 0.18;
    }

    setTimeout(() => ctx.close(), 2000);
  } catch {
    // AudioContext unavailable (e.g. SSR) — silently skip.
  }
};

const nextPhase = () => {
  if (phase.value === "work") {
    sessionsCompleted.value += 1;

    const isLong =
      sessionsCompleted.value % WORK_SESSIONS_BEFORE_LONG_BREAK === 0;

    phase.value = isLong ? "long-break" : "short-break";
  } else {
    phase.value = "work";
  }

  remaining.value = PHASES[phase.value].duration;
};

const tick = () => {
  if (remaining.value <= 1) {
    remaining.value = 0;
    running.value = false;

    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    playTone();
    alert(`${PHASES[phase.value].label} session complete!`);
    nextPhase();

    return;
  }

  remaining.value -= 1;
};

const toggle = () => {
  if (running.value) {
    running.value = false;
    startedAt.value = null;

    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  } else {
    running.value = true;
    startedAt.value = Date.now();
    interval = setInterval(tick, 1000);
  }
};

const reset = () => {
  running.value = false;
  startedAt.value = null;

  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  remaining.value = PHASES[phase.value].duration;
};

const onTabChange = (val: string | number) => {
  if (running.value) return;
  phase.value = val as Phase;
  remaining.value = PHASES[val as Phase].duration;
};

onMounted(() => {
  const saved = _cookie.value;
  if (saved.startedAt !== null) {
    const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
    const adjusted = Math.max(0, saved.remaining - elapsed);
    if (adjusted > 0) {
      remaining.value = adjusted;
      startedAt.value = saved.startedAt;
      running.value = true;
      interval = setInterval(tick, 1000);
    } else {
      // Timer finished while away — advance to next phase silently
      nextPhase();
      startedAt.value = null;
    }
  }
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
  _cookie.value = {
    phase: phase.value,
    remaining: remaining.value,
    sessionsCompleted: sessionsCompleted.value,
    startedAt: startedAt.value,
  };
});
</script>

<template>
  <div class="flex flex-col gap-4 py-1">
    <!-- Phase selector -->
    <UTabs
      color="neutral"
      variant="link"
      :content="false"
      :items="tabItems"
      :model-value="phase"
      :disabled="running"
      class="w-full"
      @update:model-value="onTabChange"
    />

    <!-- Time + progress -->
    <div class="flex flex-col gap-2">
      <span
        class="text-center font-mono text-2xl font-medium text-white/70 tabular-nums"
      >
        {{ minutes }}:{{ seconds }}
      </span>

      <UProgress :model-value="progressValue" color="neutral" class="w-full" />
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-4">
      <button
        type="button"
        class="cursor-pointer text-white/30 transition-colors hover:text-white/60"
        @click="reset"
      >
        <UIcon name="i-lucide-rotate-ccw" class="size-4" />
      </button>

      <button
        type="button"
        class="cursor-pointer text-white/60 transition-colors hover:text-white/90"
        @click="toggle"
      >
        <UIcon
          :name="running ? 'i-lucide-pause' : 'i-lucide-play'"
          class="size-5"
        />
      </button>

      <button
        type="button"
        class="cursor-pointer text-white/30 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
        :disabled="running"
        @click="nextPhase"
      >
        <UIcon name="i-lucide-skip-forward" class="size-4" />
      </button>
    </div>

    <!-- Session dots -->
    <div class="flex justify-center gap-1.5">
      <div
        v-for="i in WORK_SESSIONS_BEFORE_LONG_BREAK"
        :key="i"
        class="size-1.5 rounded-full transition-colors"
        :class="
          i <= sessionsCompleted % WORK_SESSIONS_BEFORE_LONG_BREAK ||
          (sessionsCompleted > 0 &&
            sessionsCompleted % WORK_SESSIONS_BEFORE_LONG_BREAK === 0)
            ? 'bg-white/50'
            : 'bg-white/15'
        "
      />
    </div>
  </div>
</template>
