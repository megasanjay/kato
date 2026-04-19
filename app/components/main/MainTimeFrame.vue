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
      class="text-outline-stone-500 mt-6 text-9xl font-semibold tracking-tight text-white"
    >
      {{ formattedTime }}
    </h1>

    <p class="text-outline-stone-500 mt-6 text-2xl text-slate-200">
      {{ formattedDate }}
    </p>
  </div>
</template>
