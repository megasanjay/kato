import { defineStore } from "pinia";
import dayjs from "dayjs";
import { Background } from "@prisma/client";

import { useLoaderStore } from "./loader";

export const useBackgroundImageStore = defineStore(
  "backgroundImage",
  () => {
    const loaderStore = useLoaderStore();

    const dailyImages = ref<Background[]>([]);

    const backgroundImage = ref<BackgroundImage>({});
    const backgroundImageUrl = ref("");

    const index = ref(0);

    const getDailyImages = async () => {
      const date = dayjs().format("YYYY-MM-DD");

      if (dailyImages.value.length > 0) {
        if (date === dailyImages.value[0].date) {
          return;
        }
      }

      const loaderID = loaderStore.generateId();
      loaderStore.addToLoadingQueue(loaderID);

      const images = await fetch(`/api/backgroundImages/${date}`).then((res) =>
        res.json()
      );

      loaderStore.removeFromLoadingQueue(loaderID);

      dailyImages.value = images;
    };

    const setStoreValues = () => {
      backgroundImage.value = dailyImages.value[index.value];
      backgroundImageUrl.value = dailyImages.value[index.value].url;
    };

    const getNextBackgroundImage = () => {
      if (dailyImages.value.length > 0) {
        const tempIndex = (index.value + 1) % dailyImages.value.length;

        return dailyImages.value[tempIndex].url;
      } else {
        return "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
      }
    };

    const setBackgroundImage = async () => {
      const date = dayjs().format("YYYY-MM-DD");

      if (dailyImages.value.length === 0) {
        await getDailyImages();
        index.value = 0;
      }

      if (date !== dailyImages.value[0].date) {
        await getDailyImages();
        index.value = 0;
      }

      if (
        "date" in backgroundImage.value &&
        date !== backgroundImage.value.date
      ) {
        index.value = 0;
      }

      setStoreValues();
    };

    const updateBackgroundImage = () => {
      index.value = (index.value + 1) % dailyImages.value.length;

      setStoreValues();
    };

    return {
      backgroundImage,
      dailyImages,
      index,
      getDailyImages,
      setBackgroundImage,
      backgroundImageUrl,
      updateBackgroundImage,
      getNextBackgroundImage,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
