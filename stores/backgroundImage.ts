import { defineStore } from "pinia";

export const useBackgroundImageStore = defineStore(
  "backgroundImage",
  () => {
    const backgroundImage = ref(
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format"
    );
    const previousBackgroundImage = ref(backgroundImage.value);

    const getBackgroundImage = async () => {
      // get from database
      // only update if it is different
    };

    const setBackgroundImage = (newURl: string) => {
      previousBackgroundImage.value = backgroundImage.value;

      setTimeout(() => {
        backgroundImage.value = newURl;
      }, 200);
    };

    return {
      backgroundImage,
      getBackgroundImage,
      previousBackgroundImage,
      setBackgroundImage,
    };
  },
  {
    persist: true,
  }
);
