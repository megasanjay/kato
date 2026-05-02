<script setup lang="ts">
// Live clock component that refreshes the displayed time once per second.
const dayjs = useDayjs();

const now = ref(dayjs());

const formattedTime = computed(() => now.value.format("h:mm"));
const formattedDate = computed(() => now.value.format("dddd, MMMM D, YYYY"));

let intervalId: ReturnType<typeof setInterval> | undefined;

const today = dayjs().format("YYYY-MM-DD");

const { data, error } = await useFetch(`/api/wallpaper/${today}/stroke`, {
  method: "GET",
});

if (error.value) {
  console.error("Error fetching stroke wallpaper:", error.value);
}

const addStroke = computed(() => {
  return data.value ? data.value.addTextStroke : false;
});

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
  <div class="flex w-max flex-col">
    <h1
      class="text-center text-9xl font-semibold tracking-tight text-white"
      :class="{ 'add-stroke': addStroke }"
    >
      {{ formattedTime }}
    </h1>

    <p class="w-full text-center text-4xl text-white">
      {{ formattedDate }}
    </p>
  </div>
</template>

<style lang="css" scoped>
.add-stroke {
  text-shadow:
    1px 0 0 #000,
    0 -1px 0 #000,
    0 1px 0 #000,
    -1px 0 0 #000;
}
</style>
