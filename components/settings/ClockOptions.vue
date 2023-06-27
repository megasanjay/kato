<template>
  <section class="px-6">
    <h1>Clock Options</h1>
    <p class="pt-1">
      This panel allows you to change the functionality of the clock on your
      dashboard.
    </p>

    <n-divider />

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="guidance:24-hours" size="25" />
          <p class="ml-2 text-xl font-semibold">Use 24 hours?</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            By default, the clock uses a 12-hour clock. You can change this to a
            24-hour clock by toggling the switch below.
          </p>

          <div class="flex items-center space-x-4 pt-3">
            <n-switch
              :value="display24Hours"
              :round="false"
              @update:value="handle24hourChange"
            />

            <p class="text-base">
              {{ display24Hours ? "Enabled" : "Disabled" }}
            </p>
          </div>
        </div>
      </div>

      <n-divider />

      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="file-icons:moment-timezone" size="25" />
          <p class="ml-2 text-xl font-semibold">Timezone</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            Your timezone is automatically detected by your browser. You can use
            the dropdown below to change your timezone if you want to use a
            different timezone.
          </p>

          <div class="max-w-[400px] pt-3">
            <n-select
              v-model:value="timezone"
              :options="options"
              size="large"
              filterable
              :consistent-menu-width="false"
              @update:value="handleTimeZoneChange"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
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
