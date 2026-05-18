<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  layout: "settings",
});

useSeoMeta({
  title: "Wallpaper Details",
});

type CurrentWallpaper = {
  username: string;
  city: string;
  country: string;
  date: string;
  description: string;
  url: string;
  unsplashUrl: string;
  authorName: string;
  portfolioUrl: string;
  blurhash: string;
};

const dayjs = useDayjs();
const toast = useToast();
const today = dayjs().format("YYYY-MM-DD");

const { data, error, status } = await useFetch<CurrentWallpaper>(
  `/api/wallpaper/${today}`,
  {
    method: "GET",
    transform: (value) =>
      typeof value === "string"
        ? (JSON.parse(value) as CurrentWallpaper)
        : value,
  },
);

if (error.value) {
  toast.add({
    title: "Unable to load wallpaper details",
    description:
      error.value.data?.message ||
      "An error occurred while loading the current wallpaper.",
    color: "error",
  });
}

const wallpaper = computed(() => data.value);

const formattedDate = computed(() => {
  if (!wallpaper.value?.date) {
    return "-";
  }

  return dayjs(wallpaper.value.date).format("dddd, MMMM D, YYYY");
});

const location = computed(() => {
  if (!wallpaper.value) {
    return "Unknown location";
  }

  const parts = [wallpaper.value.city, wallpaper.value.country].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Unknown location";
});

const hasUnsplashLink = computed(() =>
  Boolean(wallpaper.value?.unsplashUrl?.trim()),
);

const hasPortfolioLink = computed(() =>
  Boolean(wallpaper.value?.portfolioUrl?.trim()),
);
</script>

<template>
  <div class="space-y-5 pb-6">
    <UPageHeader
      title="Wallpaper Details"
      description="More information about the current wallpaper shown in Kato."
    />

    <div class="flex rounded-lg px-4 py-4">
      <div
        v-if="status === 'pending' && !wallpaper"
        class="py-6 text-center text-sm"
      >
        Loading wallpaper details...
      </div>

      <div v-else-if="!wallpaper" class="py-6 text-center text-sm">
        No wallpaper details are available for today.
      </div>

      <div
        v-else
        class="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
      >
        <div class="overflow-hidden rounded-xl">
          <img
            :src="wallpaper.url"
            :alt="`Wallpaper for ${formattedDate}`"
            class="h-full max-h-[28rem] w-full object-cover"
          />
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <p class="text-xs">Date</p>

            <p class="text-sm">
              {{ formattedDate }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-xs">Description</p>

            <p class="text-sm">
              {{ wallpaper.description || "No description available." }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-xs">Photographer</p>

            <p class="text-sm">
              {{ wallpaper.authorName || "Unknown author" }}
              <span v-if="wallpaper.username" class="">
                ({{ wallpaper.username }})
              </span>
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-xs">Location</p>

            <p class="text-sm">
              {{ location }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2 pt-2">
            <UButton
              v-if="hasUnsplashLink"
              :to="wallpaper.unsplashUrl"
              target="_blank"
              color="neutral"
              variant="soft"
              icon="material-symbols:open-in-new"
            >
              View on Unsplash
            </UButton>

            <UButton
              v-if="hasPortfolioLink"
              :to="wallpaper.portfolioUrl"
              target="_blank"
              color="neutral"
              variant="soft"
              icon="material-symbols:link"
            >
              Author Portfolio
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
