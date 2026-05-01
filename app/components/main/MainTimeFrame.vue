<script setup lang="ts">
// Live clock component that refreshes the displayed time once per second.
const dayjs = useDayjs();

const now = ref(dayjs());

const formattedTime = computed(() => now.value.format("h:mm"));
const formattedDate = computed(() => now.value.format("dddd, MMMM D, YYYY"));

let intervalId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = dayjs();
  }, 1000);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="flex w-max flex-col items-start justify-start">
    <h1 class="text-9xl font-semibold tracking-tight text-white">
      {{ formattedTime }}
    </h1>

    <p class="w-full text-center text-2xl text-slate-200">
      {{ formattedDate }}
    </p>
  </div>
</template>
