<script setup lang="ts">
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
  <div class="flex flex-col items-center justify-center">
    <h1
      class="mt-6 text-6xl font-semibold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
    >
      {{ formattedTime }}
    </h1>

    <p class="mt-6 text-lg text-slate-200 sm:text-xl md:text-2xl">
      {{ formattedDate }}
    </p>
  </div>
</template>
