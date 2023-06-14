<template>
  <div class="flex flex-col space-y-2 p-4 text-white">
    <div class="flex flex-row space-x-4">
      <p class="text-white drop-shadow-xl">Use a 24-hour clock?</p>
      <n-switch
        :value="display24Hours"
        :round="false"
        @update:value="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClockStore } from "~/stores/clock";

const clockStore = useClockStore();

const display24Hours = computed(() => clockStore.display24Hours);

const handleChange = (value: boolean) => {
  clockStore.updateDisplay24Hours(value);
};
</script>
