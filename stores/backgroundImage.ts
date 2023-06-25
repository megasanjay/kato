import { defineStore } from "pinia";
import dayjs from "dayjs";
import { Background } from "@prisma/client";

export const useBackgroundImageStore = defineStore(
  "backgroundImage",
  () => {
    const dailyImages = ref<Background[]>([]);

    const backgroundImage = ref<BackgroundImage>({
      username: "thapapawan",
      blurHash: "L12==ht700NG9_WC-ot6MIoJtlR*",
      city: "Unknown",
      country: "United States",
      date: "2023-06-25",
      description: "None provided",
      index: 0,
      url: "https://images.unsplash.com/photo-1687462339570-620acaa71eec?ixid=M3w0MzQ2NjN8MHwxfHNlYXJjaHwxfHxhc3Ryb3Bob3RvZ3JhcGh5fGVufDB8MHwyfHwxNjg3Njc5NTUzfDA&ixlib=rb-4.0.3&auto=format",
    });
    const previousBackgroundImage = ref(backgroundImage.value);

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
      previousBackgroundImage.value = backgroundImage.value;

      const date = dayjs().format("YYYY-MM-DD");

      if (dailyImages.value.length === 0) {
        await getDailyImages();
        index.value = 0;
      }

      if (date !== dailyImages.value[0].date) {
        await getDailyImages();
        index.value = 0;
      }

      if (date !== backgroundImage.value.date) {
        index.value = 0;
        backgroundImage.value = dailyImages.value[index.value];
      }
    };

    const updateBackgroundImage = () => {
      previousBackgroundImage.value = backgroundImage.value;

      setTimeout(() => {
        index.value = (index.value + 1) % dailyImages.value.length;

        backgroundImage.value = dailyImages.value[index.value];
      }, 200);
    };

    return {
      backgroundImage,
      dailyImages,
      getDailyImages,
      previousBackgroundImage,
      setBackgroundImage,
      updateBackgroundImage,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
