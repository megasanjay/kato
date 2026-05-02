<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const { loggedIn, user } = useUserSession();

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

  if (loggedIn.value && user.value) {
    name.value = user.value.firstName || user.value.username;
  }

  if (currentTime < 12) {
    greeting.value = name.value
      ? `Good morning, ${name.value}`
      : "Good morning";
  } else if (currentTime < 18) {
    greeting.value = name.value
      ? `Good afternoon, ${name.value}`
      : "Good afternoon";
  } else {
    greeting.value = name.value
      ? `Good evening, ${name.value}`
      : "Good evening";
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
  <div class="mt-6 flex flex-col justify-end">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <p
        v-if="showGreeting"
        key="greeting"
        class="text-left text-2xl font-bold text-slate-100 md:text-5xl"
      >
        {{ greeting }}
      </p>

      <p
        v-else
        key="affirmation"
        class="text-left font-bold text-slate-100 drop-shadow-xl"
        :class="{
          'text-2xl md:text-4xl': affirmation.length > 50,
          'text-2xl md:text-5xl': affirmation.length <= 50,
        }"
      >
        {{ affirmation }}
      </p>
    </Transition>

    <Transition name="fast-fade-blur" appear>
      <p v-if="!loggedIn" class="mt-2 ml-1 text-sm text-white/50">
        <NuxtLink
          to="/login"
          class="underline underline-offset-2 transition-colors hover:text-white/80"
          >Log in</NuxtLink
        >
        or
        <NuxtLink
          to="/signup"
          class="underline underline-offset-2 transition-colors hover:text-white/80"
          >sign up</NuxtLink
        >
        for a more personalized experience.
      </p>
    </Transition>
  </div>
</template>
