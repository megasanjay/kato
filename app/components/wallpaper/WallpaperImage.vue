<script setup lang="ts">
// This component is responsible for rendering the wallpaper image in the background of the app.
// It is used in the DefaultLayout component to provide a consistent background across all pages.

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

const images = computed(() => {
  if (!data.value) return [];
  return typeof data.value === "string" ? JSON.parse(data.value) : data.value;
});

const wallpaperUrl = computed(() => images.value[0]?.url ?? null);

watch(wallpaperUrl, () => {
  isImageLoaded.value = false;
  console.log("Wallpaper URL changed, resetting image loaded state.");
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

    <Transition name="fast-fade-blur" appear mode="out-in">
      <div
        v-if="isImageLoaded"
        class="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.84)_100%)] transition-opacity duration-700"
      />
    </Transition>
  </div>
</template>
