import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const displayName = ref("");
    const fullName = ref("");

    const updateDisplayName = (newDisplayName: string) => {
      displayName.value = newDisplayName;
    };

    const updateFullName = (newFullName: string) => {
      fullName.value = newFullName;
    };

    return {
      displayName,
      fullName,
      updateDisplayName,
      updateFullName,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
