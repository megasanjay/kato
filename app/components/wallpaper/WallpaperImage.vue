<script setup lang="ts">
// Wallpaper loader that fetches the current day's image and renders the backdrop.
import { decode } from "blurhash";

const dayjs = useDayjs();
const toast = useToast();
const isImageLoaded = ref(false);
const blurhashDataUrl = ref<string | null>(null);
const wallpaperImg = useTemplateRef<HTMLImageElement>("wallpaperImg");

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

// Decode at 1×1 to get the average color — pure JS, safe to run on the server.
const blurhashBgColor = computed(() => {
  const hash = image.value?.blurhash;
  if (!hash) return "rgb(30,41,59)"; // slate-800 fallback
  try {
    const px = decode(hash, 1, 1);

    return `rgb(${px[0]},${px[1]},${px[2]})`;
  } catch {
    return "rgb(30,41,59)";
  }
});

const paintBlurhash = (hash: string) => {
  const W = 32;
  const H = 18;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const pixels = decode(hash, W, H);
  const imageData = ctx.createImageData(W, H);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
  blurhashDataUrl.value = canvas.toDataURL();
};

onMounted(() => {
  const hash = image.value?.blurhash;
  if (hash) paintBlurhash(hash);

  // If the image was already cached by the browser, @load won't fire again.
  if (wallpaperImg.value?.complete) {
    isImageLoaded.value = true;
  }
});

watch(wallpaperUrl, () => {
  isImageLoaded.value = false;
});
</script>

<template>
  <div
    class="background-image-container absolute inset-0 z-0 overflow-hidden"
    :style="{ backgroundColor: blurhashBgColor }"
  >
    <img
      v-if="blurhashDataUrl"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
      :class="isImageLoaded ? 'opacity-0' : 'opacity-100'"
      :src="blurhashDataUrl"
      alt=""
      aria-hidden="true"
    />

    <img
      v-show="wallpaperUrl"
      ref="wallpaperImg"
      class="wallpaper-image absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
      :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
      :src="wallpaperUrl ?? undefined"
      alt="Wallpaper"
      @load="isImageLoaded = true"
      @error="isImageLoaded = false"
    />

    <div
      class="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.84)_100%)] transition-opacity duration-700"
    />
  </div>
</template>
