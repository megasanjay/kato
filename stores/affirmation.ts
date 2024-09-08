import { defineStore } from "pinia";
import dayjs from "dayjs";

import { useLoaderStore } from "./loader";

export const useAffirmationStore = defineStore(
  "affirmation",
  () => {
    const loaderStore = useLoaderStore();

    const dailyAffirmation = ref({
      affirmation: "",
      date: "",
    });

    const getDailyAffirmation = async () => {
      const date = dayjs().format("YYYY-MM-DD");

      if (dailyAffirmation.value && date === dailyAffirmation.value.date) {
        return;
      }

      loaderStore.addToLoadingQueue("affirmation");

      try {
        const data = await fetch(`/api/affirmation/${date}`).then((res) =>
          res.json()
        );

        console.log(data);

        loaderStore.removeFromLoadingQueue("affirmation");

        dailyAffirmation.value = data;
      } catch (e) {
        console.log(e);
      }
    };

    return {
      dailyAffirmation,
      getDailyAffirmation,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
