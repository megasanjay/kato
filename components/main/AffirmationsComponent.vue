<template>
  <div>
    <transition name="fast-fade-blur" appear mode="out-in">
      <p v-if="showGreeting" class="text-center text-6xl font-bold text-white">
        {{ greeting }}<span v-if="name !== ''">, {{ name }}. </span>
      </p>
      <p v-else class="text-center text-5xl font-bold text-white">
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
import { useUserStore } from "~/stores/user";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(utc);
// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(timezone);

const clockStore = useClockStore();
const userStore = useUserStore();

const name = computed(() => userStore.displayName);

const timeZone = computed(() => clockStore.timeZone);

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
    showGreeting.value = false;

    affirmation.value = "You are awesome!";
  }, 10000);
};

getGreeting();
</script>
