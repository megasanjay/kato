import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const displayName = ref("");
    const fullName = ref("");
    const birthday = ref("");

    const updateDisplayName = (newDisplayName: string) => {
      displayName.value = newDisplayName;
    };

    const updateFullName = (newFullName: string) => {
      fullName.value = newFullName;
    };

    const updateBirthday = (newBirthday: string) => {
      birthday.value = newBirthday;
    };

    return {
      birthday,
      displayName,
      fullName,
      updateBirthday,
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
