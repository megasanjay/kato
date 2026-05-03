<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

useSeoMeta({
  title: "Admin Wallpapers",
});

type AdminWallpaper = {
  id: string;
  date: string;
  url: string;
  description: string;
  authorName: string;
  username: string;
  unsplashUrl: string;
  portfolioUrl: string;
  city: string;
  country: string;
  addTextStroke: boolean;
  createdAt: string;
};

const dayjs = useDayjs();
const toast = useToast();
const { user } = useUserSession();

watchEffect(() => {
  if (import.meta.client && user.value && !user.value.admin) {
    navigateTo("/");
  }
});

const {
  data: wallpapers,
  error,
  status,
} = await useFetch<AdminWallpaper[]>("/api/admin/wallpaper", {
  method: "GET",
});

if (error.value) {
  toast.add({
    title: "Unable to load wallpapers",
    description:
      error.value.data?.message ||
      "An error occurred while fetching wallpapers.",
    icon: "material-symbols:error",
    color: "error",
  });
}

const deletingId = ref<string | null>(null);
const updatingId = ref<string | null>(null);

const today = computed(() => dayjs().format("YYYY-MM-DD"));

const formattedDate = (date: string) =>
  dayjs(date).format("dddd, MMMM D, YYYY");

const isUpcoming = (date: string) => dayjs(date).isAfter(today.value, "day");

const isToday = (date: string) => date === today.value;

const setTextOutline = async (wallpaper: AdminWallpaper, enabled: boolean) => {
  if (updatingId.value) {
    return;
  }

  const previousValue = wallpaper.addTextStroke;
  wallpaper.addTextStroke = enabled;
  updatingId.value = wallpaper.id;

  try {
    await $fetch(`/api/admin/wallpaper/${wallpaper.id}`, {
      method: "PATCH",
      body: {
        addTextStroke: enabled,
      },
    });

    toast.add({
      title: enabled ? "Text outline enabled" : "Text outline disabled",
      description: `${formattedDate(wallpaper.date)} preview updated.`,
      color: "success",
      icon: "material-symbols:check-circle",
    });
  } catch (patchError: unknown) {
    const message =
      patchError && typeof patchError === "object" && "data" in patchError
        ? (patchError as { data?: { message?: string } }).data?.message
        : undefined;

    wallpaper.addTextStroke = previousValue;

    toast.add({
      title: "Failed to update outline",
      description: message || "Could not update the text outline setting.",
      color: "error",
      icon: "material-symbols:error",
    });
  } finally {
    updatingId.value = null;
  }
};

const deleteWallpaper = async (wallpaper: AdminWallpaper) => {
  if (deletingId.value) {
    return;
  }

  deletingId.value = wallpaper.id;

  try {
    await $fetch(`/api/admin/wallpaper/${wallpaper.id}`, {
      method: "DELETE",
    });

    if (wallpapers.value) {
      wallpapers.value = wallpapers.value.filter(
        (item) => item.id !== wallpaper.id,
      );
    }

    toast.add({
      title: "Wallpaper deleted",
      description: `${formattedDate(wallpaper.date)} removed from schedule.`,
      color: "success",
      icon: "material-symbols:delete-outline",
    });
  } catch (deleteError: unknown) {
    const message =
      deleteError && typeof deleteError === "object" && "data" in deleteError
        ? (deleteError as { data?: { message?: string } }).data?.message
        : undefined;

    toast.add({
      title: "Delete failed",
      description: message || "Could not delete this wallpaper.",
      color: "error",
      icon: "material-symbols:error",
    });
  } finally {
    deletingId.value = null;
  }
};
</script>

<template>
  <div class="relative h-full overflow-y-auto">
    <div class="mx-auto w-full max-w-7xl">
      <div
        v-if="status === 'pending' && !wallpapers?.length"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        Loading wallpapers...
      </div>

      <div
        v-else-if="!wallpapers?.length"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        No wallpapers found.
      </div>

      <div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <article
          v-for="wallpaper in wallpapers"
          :key="wallpaper.id"
          class="overflow-hidden rounded-2xl border border-white/20 bg-black/45 backdrop-blur-md"
        >
          <div class="relative h-64 w-full overflow-hidden md:h-72">
            <img
              :src="wallpaper.url"
              :alt="`Wallpaper for ${formattedDate(wallpaper.date)}`"
              class="absolute inset-0 h-full w-full object-cover"
            />

            <div
              class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,0.45)_68%,rgba(0,0,0,0.8)_100%)]"
            />

            <div class="absolute inset-0 flex items-center justify-center px-4">
              <div class="flex w-max flex-col">
                <h2
                  class="text-center text-5xl font-semibold tracking-tight text-white"
                  :class="{ 'preview-add-stroke': wallpaper.addTextStroke }"
                >
                  12:23
                </h2>

                <p
                  class="w-full text-center text-lg text-white"
                  :class="{ 'preview-add-stroke': wallpaper.addTextStroke }"
                >
                  {{ formattedDate(wallpaper.date) }}
                </p>
              </div>
            </div>

            <div class="absolute top-3 left-3 flex gap-2">
              <UBadge
                v-if="isUpcoming(wallpaper.date)"
                color="warning"
                variant="solid"
                label="Upcoming"
              />

              <UBadge
                v-else-if="isToday(wallpaper.date)"
                color="primary"
                variant="solid"
                label="Today"
              />

              <UBadge v-else color="neutral" variant="solid" label="Past" />
            </div>
          </div>

          <div class="space-y-4 p-4 md:p-5">
            <div>
              <p class="text-sm font-semibold text-white">
                {{ formattedDate(wallpaper.date) }}
              </p>

              <p class="mt-1 line-clamp-2 text-sm text-white/75">
                {{ wallpaper.description }}
              </p>
            </div>

            <p class="text-xs text-white/65">
              by {{ wallpaper.authorName }} ({{ wallpaper.username }}) •
              {{ wallpaper.city }},
              {{ wallpaper.country }}
            </p>

            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <UButton
                  size="sm"
                  color="neutral"
                  variant="soft"
                  :loading="updatingId === wallpaper.id"
                  @click="setTextOutline(wallpaper, !wallpaper.addTextStroke)"
                >
                  {{ wallpaper.addTextStroke ? "Disable" : "Enable" }}
                  Text Outline
                </UButton>

                <UBadge
                  :color="wallpaper.addTextStroke ? 'success' : 'neutral'"
                  variant="subtle"
                  :label="
                    wallpaper.addTextStroke ? 'Outline On' : 'Outline Off'
                  "
                />
              </div>

              <div class="flex items-center gap-2">
                <UButton
                  :to="wallpaper.unsplashUrl"
                  target="_blank"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  icon="material-symbols:open-in-new"
                >
                  Source
                </UButton>

                <UPopover mode="click">
                  <UButton
                    size="sm"
                    color="error"
                    variant="soft"
                    icon="material-symbols:delete-outline"
                    :loading="deletingId === wallpaper.id"
                  >
                    Delete
                  </UButton>

                  <template #content>
                    <div class="w-64 p-3">
                      <p class="text-sm text-neutral-800 dark:text-white">
                        Delete wallpaper for
                        {{ formattedDate(wallpaper.date) }}?
                      </p>

                      <p
                        class="mt-1 text-xs text-neutral-500 dark:text-neutral-400"
                      >
                        This cannot be undone.
                      </p>

                      <div class="mt-3 flex justify-end gap-2">
                        <UButton
                          label="Cancel"
                          color="neutral"
                          size="xs"
                          variant="soft"
                        />

                        <UButton
                          label="Delete"
                          color="error"
                          size="xs"
                          variant="solid"
                          :loading="deletingId === wallpaper.id"
                          @click="deleteWallpaper(wallpaper)"
                        />
                      </div>
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-add-stroke {
  text-shadow:
    1px 0 0 #000,
    0 -1px 0 #000,
    0 1px 0 #000,
    -1px 0 0 #000;
}
</style>
