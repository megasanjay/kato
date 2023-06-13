import { defineStore } from "pinia";

export const useClockStore = defineStore(
  "clock",
  () => {
    const settingsDisplay24Hour = ref(false);
    const currentView = ref("time");

    const updateSettingsDisplay24Hour = (value: boolean) => {
      settingsDisplay24Hour.value = value;
    };

    const updateCurrentView = (value: string) => {
      currentView.value = value;
    };

    return {
      currentView,
      settingsDisplay24Hour,
      updateCurrentView,
      updateSettingsDisplay24Hour,
    };
  },
  {
    persist: true,
  }
);
