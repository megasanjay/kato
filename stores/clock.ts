import { defineStore } from "pinia";

export const useClockStore = defineStore(
  "clock",
  () => {
    const currentView = ref("time");
    const settingsDisplay24Hour = ref(false);

    const percentStartTime = ref(0);
    const percentEndTime = ref(0);

    const updateSettingsDisplay24Hour = (value: boolean) => {
      settingsDisplay24Hour.value = value;
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

    return {
      currentView,
      percentEndTime,
      percentStartTime,
      settingsDisplay24Hour,
      updateCurrentView,
      updatePercentEndTime,
      updatePercentStartTime,
      updateSettingsDisplay24Hour,
    };
  },
  {
    persist: true,
  }
);
