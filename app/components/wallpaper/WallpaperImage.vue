<script setup lang="ts">
// Wallpaper loader that fetches the current day's image and renders the backdrop.

const dayjs = useDayjs();
const toast = useToast();
const isImageLoaded = ref(false);

const today = dayjs().format("YYYY-MM-DD");

const { data, error } = await useFetch(`/api/wallpaper/${today}`, {
  method: "GET",
});

if (error.value) {
  toast.add({
    title: "Error fetching wallpaper",
    description:
      error.value.data?.message ||
      "An error occurred while fetching the wallpaper.",
    icon: "material-symbols:error",
    color: "error",
  });
}

const image = computed(() => {
  if (!data.value) return null;

  return typeof data.value === "string" ? JSON.parse(data.value) : data.value;
});

const wallpaperUrl = computed(() => image.value?.url ?? null);

watch(wallpaperUrl, () => {
  isImageLoaded.value = false;
});
</script>

<template>
  <div
    class="background-image-container absolute inset-0 z-0 overflow-hidden bg-slate-800"
  >
    <img
      v-if="wallpaperUrl"
      class="wallpaper-image absolute inset-0 h-full w-full object-cover transition-all"
      :src="wallpaperUrl"
      alt="Wallpaper"
      @load="isImageLoaded = true"
      @error="isImageLoaded = false"
    />

    <div
      class="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.84)_100%)] transition-opacity duration-700"
    />
  </div>
</template>
