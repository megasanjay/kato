<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone);
const name = ref("");

const today = dayjs().tz(timeZone.value).format("YYYY-MM-DD");

const { data: affirmationData } = await useFetch(`/api/affirmation/${today}`, {
  method: "GET",
});

const showGreeting = ref(true);
const greeting = ref("Hello");

const affirmation = ref("");

let switchToAffirmationTimeout: ReturnType<typeof setTimeout> | undefined;
let cycleTimeout: ReturnType<typeof setTimeout> | undefined;

const parsedAffirmation = computed(() => {
  if (!affirmationData.value) return "";

  const resolvedData =
    typeof affirmationData.value === "string"
      ? JSON.parse(affirmationData.value)
      : affirmationData.value;

  return resolvedData?.affirmation || "";
});

const getGreeting = () => {
  const currentTime = dayjs().tz(timeZone.value).hour();

  if (currentTime < 12) {
    greeting.value = "Good morning";
  } else if (currentTime < 18) {
    greeting.value = "Good afternoon";
  } else {
    greeting.value = "Good evening";
  }

  switchToAffirmationTimeout = setTimeout(() => {
    affirmation.value = parsedAffirmation.value;
    showGreeting.value = false;

    cycleTimeout = setTimeout(() => {
      getGreeting();
      showGreeting.value = true;
    }, 24000);
  }, 10000);
};

onMounted(async () => {
  getGreeting();
});

onBeforeUnmount(() => {
  if (switchToAffirmationTimeout) {
    clearTimeout(switchToAffirmationTimeout);
  }

  if (cycleTimeout) {
    clearTimeout(cycleTimeout);
  }
});
</script>

<template>
  <div class="flex h-full items-end">
    <p
      v-if="showGreeting"
      class="text-left text-2xl font-bold text-slate-100 md:text-5xl"
    >
      {{ greeting }}<span v-if="name !== ''">, {{ name }}. </span>
    </p>

    <p
      v-else
      class="text-left font-bold text-slate-100 drop-shadow-xl"
      :class="{
        'text-2xl md:text-4xl': affirmation.length > 50,
        'text-2xl md:text-5xl': affirmation.length <= 50,
      }"
    >
      {{ affirmation }}
    </p>
  </div>
</template>
