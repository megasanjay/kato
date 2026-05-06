<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  layout: "settings",
});

useSeoMeta({
  title: "RSS Feeds",
});

type RssSubscription = {
  id: string;
  title: string;
  url: string;
  subscribedAt: string;
  itemCount: number;
  lastFetchedAt: string | null;
};

type RssFeedItem = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  feedId: string;
  feedUrl: string;
  feedTitle: string;
};

const USER_FEED_LIMIT = 10;

const toast = useToast();
const dayjs = useDayjs();
const feedUrl = ref("");
const isAdding = ref(false);
const removingFeedId = ref<string | null>(null);
const unsubscribeConfirmFeedId = ref<string | null>(null);

const {
  data: subscriptionsData,
  error: subscriptionsError,
  status: subscriptionsStatus,
  refresh: refreshSubscriptions,
} = await useFetch<RssSubscription[]>("/api/rss/subscriptions", {
  method: "GET",
});

const {
  data: itemsData,
  error: itemsError,
  status: itemsStatus,
  refresh: refreshItems,
} = await useFetch<RssFeedItem[]>("/api/rss", {
  method: "GET",
});

if (subscriptionsError.value) {
  toast.add({
    title: "Unable to load subscriptions",
    description:
      subscriptionsError.value.data?.message ||
      "An error occurred while loading your RSS subscriptions.",
    color: "error",
  });
}

if (itemsError.value) {
  toast.add({
    title: "Unable to load feed items",
    description:
      itemsError.value.data?.message ||
      "An error occurred while loading recent RSS items.",
    color: "error",
  });
}

const subscriptions = computed(() => subscriptionsData.value ?? []);
const items = computed(() => itemsData.value ?? []);

const remainingSlots = computed(
  () => USER_FEED_LIMIT - subscriptions.value.length,
);

const feedDisplayName = (feed: RssSubscription) => {
  const title = feed.title.trim();

  if (title.length > 0) {
    return title;
  }

  try {
    return new URL(feed.url).hostname;
  } catch {
    return feed.url;
  }
};

const formatDateTime = (value: string | null) => {
  if (!value) return "Never";

  return dayjs(value).format("MMM D, YYYY h:mm A");
};

const daysAgo = (date: string) => {
  const d = dayjs().diff(dayjs(date), "day");

  if (d < 1) {
    return "Today";
  } else if (d === 1) {
    return "Yesterday";
  } else {
    return `${d} days ago`;
  }
};

const addFeed = async () => {
  const trimmed = feedUrl.value.trim();

  if (!trimmed || isAdding.value || remainingSlots.value <= 0) {
    return;
  }

  isAdding.value = true;

  try {
    await $fetch<{ id: string; url: string; title: string }>("/api/rss", {
      method: "POST",
      body: { url: trimmed },
    });

    feedUrl.value = "";

    await Promise.all([refreshSubscriptions(), refreshItems()]);

    toast.add({
      title: "Feed subscribed",
      description: "Your RSS feed was added successfully.",
      color: "success",
    });
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
          ? "You are already subscribed to this feed."
          : status === 403
            ? "You can subscribe to up to 10 feeds."
            : status === 422
              ? "That URL could not be fetched or parsed as RSS/Atom."
              : "Please verify the feed URL and try again.",
      color: "error",
    });
  } finally {
    isAdding.value = false;
  }
};

const unsubscribe = async (feed: RssSubscription) => {
  if (removingFeedId.value) return;

  removingFeedId.value = feed.id;

  try {
    await $fetch(`/api/rss/${feed.id}`, { method: "DELETE" });

    await Promise.all([refreshSubscriptions(), refreshItems()]);

    toast.add({
      title: "Unsubscribed",
      description: `Removed ${feedDisplayName(feed)} from your subscriptions.`,
      color: "success",
    });

    unsubscribeConfirmFeedId.value = null;
  } catch (cause: unknown) {
    const status = (cause as { statusCode?: number })?.statusCode;

    toast.add({
      title: status === 404 ? "Feed not found" : "Failed to unsubscribe",
      description:
        status === 404
          ? "This subscription no longer exists."
          : "Please try again in a moment.",
      color: "error",
    });
  } finally {
    removingFeedId.value = null;
  }
};
</script>

<template>
  <div class="space-y-5 py-6">
    <UPageHeader
      title="RSS Feeds"
      description="Manage your RSS feed subscriptions here."
    />

    <UCard title="Subscribe">
      <div class="space-y-4">
        <p class="text-sm">
          Add an RSS or Atom feed URL. You can subscribe to up to
          {{ USER_FEED_LIMIT }} feeds.
        </p>

        <div class="flex flex-col gap-3 md:flex-row md:items-end">
          <UFormField class="flex-1" label="Feed URL" name="feedUrl">
            <UInput
              v-model="feedUrl"
              type="url"
              placeholder="https://example.com/feed.xml"
              @keydown.enter="addFeed"
            />
          </UFormField>

          <UButton
            color="primary"
            icon="material-symbols:add"
            :loading="isAdding"
            :disabled="!feedUrl.trim() || remainingSlots <= 0"
            @click="addFeed"
          >
            Subscribe
          </UButton>
        </div>

        <p class="">
          {{ subscriptions.length }} / {{ USER_FEED_LIMIT }} subscribed

          <span v-if="remainingSlots > 0"
            >( {{ remainingSlots }} slots left )</span
          >

          <span v-else>( limit reached )</span>
        </p>
      </div>
    </UCard>

    <UCard title="Your Subscriptions">
      <div
        v-if="subscriptionsStatus === 'pending' && !subscriptions.length"
        class="py-4 text-sm"
      >
        Loading subscriptions...
      </div>

      <div v-else-if="subscriptions.length === 0" class="py-4 text-sm">
        You do not have any RSS subscriptions yet.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="feed in subscriptions"
          :key="feed.id"
          class="flex flex-col justify-between gap-3 rounded-lg border p-3 md:flex-row md:items-center"
        >
          <div class="min-w-0 space-y-1">
            <p class="truncate text-sm font-medium">
              {{ feedDisplayName(feed) }}
            </p>

            <p class="truncate">
              {{ feed.url }}
            </p>

            <p class=" ">
              {{ feed.itemCount }} items, last fetched
              {{ formatDateTime(feed.lastFetchedAt) }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <UButton
              :to="feed.url"
              target="_blank"
              size="xs"
              variant="soft"
              color="neutral"
              icon="material-symbols:open-in-new"
            >
              Open
            </UButton>

            <UPopover
              :open="unsubscribeConfirmFeedId === feed.id"
              mode="click"
              @update:open="
                (open) => (unsubscribeConfirmFeedId = open ? feed.id : null)
              "
            >
              <UButton
                size="xs"
                variant="soft"
                color="error"
                icon="material-symbols:delete-outline"
                :loading="removingFeedId === feed.id"
                :disabled="Boolean(removingFeedId)"
              >
                Unsubscribe
              </UButton>

              <template #content>
                <div class="w-56 p-3">
                  <p class="text-sm">
                    Unsubscribe from {{ feedDisplayName(feed) }}?
                  </p>

                  <div class="mt-3 flex justify-end gap-2">
                    <UButton
                      label="Cancel"
                      color="neutral"
                      variant="soft"
                      size="xs"
                      @click="unsubscribeConfirmFeedId = null"
                    />

                    <UButton
                      label="Unsubscribe"
                      color="error"
                      variant="solid"
                      size="xs"
                      :loading="removingFeedId === feed.id"
                      @click="unsubscribe(feed)"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </div>
    </UCard>

    <UCard title="Latest Items">
      <div
        v-if="itemsStatus === 'pending' && !items.length"
        class="py-4 text-sm"
      >
        Loading latest items...
      </div>

      <div v-else-if="items.length === 0" class="py-4 text-sm">
        No RSS items found yet.
      </div>

      <ul v-else class="space-y-1.5">
        <li
          v-for="item in items"
          :key="item.id"
          class="list-none rounded-md px-2 py-1 transition-colors hover:bg-white/5"
        >
          <NuxtLink
            :href="item.link || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between gap-3"
          >
            <div class="min-w-0">
              <p class="/85 truncate text-sm">
                {{ item.title || "(untitled)" }}
              </p>

              <p class="truncate">
                {{ item.feedTitle || item.feedUrl }}
              </p>
            </div>

            <UTooltip :text="formatDateTime(item.pubDate)">
              <p class="shrink-0">
                {{ daysAgo(item.pubDate) }}
              </p>
            </UTooltip>
          </NuxtLink>
        </li>
      </ul>
    </UCard>
  </div>
</template>
