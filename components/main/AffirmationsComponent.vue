<template>
  <div>
    <transition name="fast-fade-blur" appear mode="out-in">
      <p v-if="showGreeting" class="text-center text-6xl font-bold text-white">
        {{ greeting }}, Sanjay.
      </p>
      <p v-else class="text-center text-5xl font-bold text-white">
        {{ affirmation }}
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const showGreeting = ref(true);
const greeting = ref("Hello");

const affirmation = ref("");

const getGreeting = () => {
  const currentTime = dayjs().hour();

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
