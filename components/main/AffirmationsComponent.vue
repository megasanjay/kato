<template>
  <div class="transition-all">
    <transition name="fast-fade-blur" appear mode="out-in">
      <p v-if="showGreeting" class="text-center text-5xl font-bold text-white">
        {{ greeting }}<span v-if="name !== ''">, {{ name }}. </span>
      </p>
      <p
        v-else
        class="mx-auto max-w-screen-md text-center font-bold text-white"
        :class="{
          'text-4xl': affirmation.length > 50,
          'text-5xl': affirmation.length <= 50,
        }"
      >
        {{ affirmation }}
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useClockStore } from "~/stores/clock";
import { useAffirmationStore } from "~/stores/affirmation";
import { useUserStore } from "~/stores/user";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(timezone);

const clockStore = useClockStore();
const userStore = useUserStore();
const affirmationStore = useAffirmationStore();

const name = computed(() => userStore.displayName);

const timeZone = computed(
  () => clockStore.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
);

const showGreeting = ref(true);
const greeting = ref("Hello");

const affirmation = ref("");

const getGreeting = () => {
  const currentTime = dayjs().tz(timeZone.value).hour();

  if (currentTime < 12) {
    greeting.value = "Good morning";
  } else if (currentTime < 18) {
    greeting.value = "Good afternoon";
  } else {
    greeting.value = "Good evening";
  }

  setTimeout(() => {
    affirmation.value = affirmationStore.dailyAffirmation.affirmation;
    showGreeting.value = false;

    setTimeout(() => {
      getGreeting();
      showGreeting.value = true;
    }, 24000);
  }, 10000);
};

onMounted(async () => {
  affirmationStore.getDailyAffirmation();

  getGreeting();
});
</script>
