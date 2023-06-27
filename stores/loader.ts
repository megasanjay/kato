import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export const useLoaderStore = defineStore("loader", () => {
  const loadingQueue = ref<string[]>([]);

  const requestsInFlight = computed(() => {
    return loadingQueue.value.length > 0;
  });

  const generateId = () => {
    return nanoid();
  };

  const addToLoadingQueue = (value: string) => {
    loadingQueue.value.push(value);
  };

  const removeFromLoadingQueue = (value: string) => {
    const index = loadingQueue.value.indexOf(value);
    if (index > -1) {
      loadingQueue.value.splice(index, 1);
    }
  };

  return {
    addToLoadingQueue,
    removeFromLoadingQueue,
    requestsInFlight,
    generateId,
  };
});
