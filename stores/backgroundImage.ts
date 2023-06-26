import { defineStore } from "pinia";
import dayjs from "dayjs";
import { Background } from "@prisma/client";

export const useBackgroundImageStore = defineStore(
  "backgroundImage",
  () => {
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

      const images = await fetch(`/api/backgroundImages/${date}`).then((res) =>
        res.json()
      );

      dailyImages.value = images;
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
        backgroundImage.value = dailyImages.value[index.value];
        backgroundImageUrl.value = dailyImages.value[index.value].url;
      } else {
        backgroundImage.value = dailyImages.value[index.value];
        backgroundImageUrl.value = dailyImages.value[index.value].url;
      }
    };

    const updateBackgroundImage = () => {
      setTimeout(() => {
        index.value = (index.value + 1) % dailyImages.value.length;

        backgroundImage.value = dailyImages.value[index.value];
        backgroundImageUrl.value = dailyImages.value[index.value].url;
      }, 200);
    };

    return {
      backgroundImage,
      dailyImages,
      getDailyImages,
      setBackgroundImage,
      backgroundImageUrl,
      updateBackgroundImage,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
