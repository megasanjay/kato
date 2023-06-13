<template>
  <div class="flex items-center space-x-4 rounded-xl p-4">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <div v-if="clockType === 'pomodoro'">
        <ClockTimeComponent />
      </div>
      <div v-else-if="clockType === 'percent'">
        <ClockPercentComponent />
      </div>
      <div v-else>
        <ClockTimeComponent />
      </div>
    </Transition>

    <n-popover
      trigger="hover"
      content-style=" border-radius: 5px; background-color: transparent; border: 1px solid white"
      placement="bottom-start"
      raw
    >
      <template #trigger>
        <div
          class="cursor-pointer rounded-full bg-transparent p-2 text-white transition-all hover:bg-[#f5fefe] hover:text-blue-500"
        >
          <Icon name="material-symbols:swap-horiz-rounded" size="40" />
        </div>
      </template>
      <div class="flex flex-row bg-slate-50">
        <div
          class="popover-item"
          :class="{
            'bg-sky-200': clockType === 'time',
          }"
          @click="changeClockType('time')"
        >
          <Icon name="uil:clock-seven" size="20" />
          <span> Clock </span>
        </div>
        <div
          class="popover-item"
          :class="{
            'bg-sky-200': clockType === 'percent',
          }"
          @click="changeClockType('percent')"
        >
          <Icon name="mdi:clock-digital" size="20" />
          <span> Percent </span>
        </div>
        <div
          class="popover-item"
          :class="{
            'bg-sky-200': clockType === 'pomodoro',
          }"
          @click="changeClockType('pomodoro')"
        >
          <Icon name="emojione-monotone:timer-clock" size="20" />
          <span> Pomodoro </span>
        </div>
      </div>
    </n-popover>
  </div>
</template>

<script setup lang="ts">
import { useClockStore } from "~/stores/clock";

const clockStore = useClockStore();

const clockType = computed(() => clockStore.currentView);

const changeClockType = (value: string) => {
  clockStore.updateCurrentView(value);
};
</script>

<style scoped>
.popover-item {
  @apply flex cursor-pointer items-center space-x-1  p-2 text-[#07518d] transition-all hover:bg-sky-300;
}
</style>
