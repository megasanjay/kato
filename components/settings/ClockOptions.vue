<template>
  <div class="flex flex-col justify-start space-y-10 p-4 text-white">
    <div class="flex flex-row space-x-4">
      <p class="text-white drop-shadow-xl">Use a 24-hour clock?</p>
      <n-switch
        :value="display24Hours"
        :round="false"
        @update:value="handle24hourChange"
      />
    </div>

    <n-form-item label="Time Zone:" size="large" label-placement="left">
      <div class="flex w-[500px] items-center space-x-4">
        <n-select
          v-model:value="timezone"
          :options="options"
          filterable
          :consistent-menu-width="false"
          @update:value="handleTimeZoneChange"
        />
      </div>
    </n-form-item>
  </div>
</template>

<script setup lang="ts">
import { useClockStore } from "~/stores/clock";
import { generateListOfTimezones } from "~/utils/listofTimezones";

const clockStore = useClockStore();

const display24Hours = computed(() => clockStore.display24Hours);
const timezone = ref(
  clockStore.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
);

const handle24hourChange = (value: boolean) => {
  clockStore.updateDisplay24Hours(value);
};

const handleTimeZoneChange = (value: string) => {
  clockStore.updateTimeZone(value);
};

const options = generateListOfTimezones();
</script>
