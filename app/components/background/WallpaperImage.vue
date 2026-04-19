<script setup lang="ts">
// This component is responsible for rendering the wallpaper image in the background of the app.
// It is used in the DefaultLayout component to provide a consistent background across all pages.

const toast = useToast();

const today = new Date().toISOString().slice(0, 10);

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
</script>

<template>
  <div class="background-image-container relative z-0 bg-slate-800">
    <img
      v-if="wallpaperUrl"
      class="absolute top-0 left-0 h-screen w-screen object-cover transition-all"
      :src="wallpaperUrl"
      alt="Wallpaper"
    />
  </div>
</template>
