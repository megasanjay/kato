import { defineStore } from "pinia";

export const useClockStore = defineStore(
  "clock",
  () => {
    const currentView = ref("time");

    const display24Hours = ref(false);

    const percentStartTime = ref(0);
    const percentEndTime = ref(0);

    const timeZone = ref("");

    const updateDisplay24Hours = (value: boolean) => {
      display24Hours.value = value;
    };

    const updateCurrentView = (value: string) => {
      currentView.value = value;
    };

    const updatePercentStartTime = (value: number) => {
      percentStartTime.value = value;
    };

    const updatePercentEndTime = (value: number) => {
      percentEndTime.value = value;
    };

    const updateTimeZone = (value: string) => {
      timeZone.value = value;
    };

    return {
      currentView,
      display24Hours,
      percentEndTime,
      percentStartTime,
      timeZone,
      updateCurrentView,
      updateDisplay24Hours,
      updatePercentEndTime,
      updatePercentStartTime,
      updateTimeZone,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
