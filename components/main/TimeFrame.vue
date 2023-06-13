<template>
  <div class="flex items-center space-x-4 rounded-xl p-4">
    <ClockNormalTimeComponent />

    <n-popover
      trigger="click"
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
      <div class="flex flex-row space-x-1">
        <div
          class="flex cursor-pointer items-center space-x-1 rounded-md p-2 text-slate-100 transition-all hover:bg-sky-500"
          @click="changeClockType('clock')"
        >
          <Icon name="uil:clock-seven" size="20" />
          <span> Clock </span>
        </div>
        <div
          class="flex cursor-pointer items-center space-x-1 rounded-md p-2 text-slate-100 transition-all hover:bg-sky-500"
          @click="changeClockType('percent')"
        >
          <Icon name="mdi:clock-digital" size="20" />
          <span> Percent </span>
        </div>
        <div
          class="flex cursor-pointer items-center space-x-1 rounded-md p-2 text-slate-100 transition-all hover:bg-sky-500"
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
const changeClockType = (value: string) => {
  console.log("changeClockType", value);
};
</script>
