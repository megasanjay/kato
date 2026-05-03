<script setup lang="ts">
interface RssFeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  feedId: string;
  feedUrl: string;
  feedTitle: string;
}

const { loggedIn } = useUserSession();
const toast = useToast();

const { data, error } = await useFetch<RssFeedItem[]>("/api/rss");

const items = ref<RssFeedItem[]>(data.value ?? []);

if (error.value) {
  console.error("Error fetching RSS feeds:", error.value);
}

const isModalOpen = ref(false);
const isAdding = ref(false);
const feedUrl = ref("");

const openModal = () => {
  feedUrl.value = "";
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  feedUrl.value = "";
};

const feedHostname = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const formatDate = (raw: string) => {
  const d = new Date(raw);

  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const addFeed = async () => {
  const trimmed = feedUrl.value.trim();

  if (!trimmed) return;

  isAdding.value = true;

  try {
    const created = await $fetch<{
      id: string;
      url: string;
      title: string;
      items: Omit<RssFeedItem, "feedId" | "feedUrl" | "feedTitle">[];
    }>("/api/rss", {
      method: "POST",
      body: { url: trimmed },
    });

    const createdItems: RssFeedItem[] = created.items.map((item) => ({
      ...item,
      feedId: created.id,
      feedUrl: created.url,
      feedTitle: created.title,
    }));

    items.value = [...createdItems, ...items.value]
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
      )
      .slice(0, 20);

    closeModal();
  } catch (cause: unknown) {
    const status = (cause as { statusCode?: number })?.statusCode;

    toast.add({
      title:
        status === 409
          ? "Already subscribed"
          : status === 403
            ? "Feed limit reached"
            : status === 422
              ? "Could not fetch feed"
              : "Failed to add feed",
      description:
        status === 409
          ? "You've already added this feed."
          : status === 403
            ? "You can subscribe to up to 10 feeds per account."
            : status === 422
              ? "The URL could not be fetched. Check that it points to a valid RSS or Atom feed."
              : "Please check the URL and try again.",
      color: "error",
    });

    console.error("Failed to add RSS feed:", cause);
  } finally {
    isAdding.value = false;
  }
};
</script>

<template>
  <div>
    <p v-if="!loggedIn" class="mt-2 ml-1 text-sm text-white/20">
      This feature is only available to logged-in users. <br />
      Please
      <NuxtLink
        to="/login"
        class="underline underline-offset-2 transition-colors hover:text-white/80"
        >log in</NuxtLink
      >
      or
      <NuxtLink
        to="/signup"
        class="underline underline-offset-2 transition-colors hover:text-white/80"
        >sign up</NuxtLink
      >
      for access to this feature!
    </p>

    <div v-else class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-white/25">Latest from your RSS feeds...</p>

        <button
          type="button"
          class="cursor-pointer text-white/30 transition-colors hover:text-white/60"
          @click="openModal"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
        </button>
      </div>

      <UModal v-model:open="isModalOpen" title="Add RSS feed">
        <template #body>
          <div class="space-y-1">
            <label class="text-xs tracking-[0.16em] text-white/25 uppercase">
              Feed URL
            </label>

            <input
              v-model="feedUrl"
              type="url"
              placeholder="https://example.com/feed.xml"
              class="w-full border-b border-white/10 bg-transparent pb-2 text-sm text-white/70 placeholder-white/40 transition-colors outline-none focus:border-white/30"
              @keydown.enter="addFeed"
            />
          </div>
        </template>

        <template #footer>
          <div class="flex w-full items-center justify-between gap-3">
            <button
              type="button"
              class="text-sm text-white/25 transition-colors hover:text-white/55"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              type="button"
              class="text-sm text-white/40 transition-colors hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="isAdding || !feedUrl.trim()"
              @click="addFeed"
            >
              {{ isAdding ? "Adding..." : "Add feed" }}
            </button>
          </div>
        </template>
      </UModal>

      <p v-if="items.length === 0" class="text-sm text-white/20">
        No items found yet. Press + to subscribe to a feed.
      </p>

      <div v-else class="flex flex-col gap-1.5">
        <li v-for="item in items" :key="item.id" class="group/item list-none">
          <a
            :href="item.link || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-baseline justify-between gap-3"
          >
            <div class="min-w-0">
              <p
                class="truncate text-sm text-white/70 transition-colors group-hover/item:text-white/85"
              >
                {{ item.title || "(untitled)" }}
              </p>

              <p class="truncate text-xs text-white/40">
                {{ item.feedTitle || feedHostname(item.feedUrl) }}
              </p>
            </div>

            <p class="shrink-0 text-[11px] text-white/20">
              {{ formatDate(item.pubDate) }}
            </p>
          </a>
        </li>
      </div>
    </div>
  </div>
</template>
