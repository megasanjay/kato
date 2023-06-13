<template>
  <div class="vignette">
    <div class="text-9xl font-black text-white drop-shadow-lg">
      {{ currentTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const currentTime = ref("");

const getCurrentTime = () => {
  console.log("getCurrentTime");
  currentTime.value = dayjs().format("h:mm");
  setTimeout(getCurrentTime, 1000);
};

getCurrentTime();
</script>
