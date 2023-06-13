import { defineStore } from "pinia";

export const useClockStore = defineStore(
  "clock",
  () => {
    const settingsDisplay24Hour = ref(false);

    const updateSettingsDisplay24Hour = (value: boolean) => {
      settingsDisplay24Hour.value = value;
    };

    return { settingsDisplay24Hour, updateSettingsDisplay24Hour };
  },
  {
    persist: true,
  }
);
