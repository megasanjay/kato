<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

useSeoMeta({
  title: "RSS Status | Admin",
});

type AdminRssFeed = {
  id: string;
  title: string;
  url: string;
  subscriberCount: number;
  itemCount: number;
  overLimitBy: number;
  lastFetchedAt: string | null;
  latestItemDate: string | null;
  createdAt: string;
  isStale: boolean;
};

type AdminRssResponse = {
  generatedAt: string;
  summary: {
    feedItemLimit: number;
    staleAfterHours: number;
    totalFeeds: number;
    subscribedFeeds: number;
    staleFeeds: number;
    feedsWithNoItems: number;
    totalItems: number;
  };
  feeds: AdminRssFeed[];
};

const dayjs = useDayjs();
const toast = useToast();
const { user } = useUserSession();
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

watchEffect(() => {
  if (import.meta.client && user.value && !user.value.admin) {
    navigateTo("/");
  }
});

const { data, error, status, refresh } = await useFetch<AdminRssResponse>(
  "/api/admin/rss",
  {
    method: "GET",
  },
);

if (error.value) {
  toast.add({
    title: "Unable to load RSS status",
    description:
      error.value.data?.message ||
      "An error occurred while fetching RSS monitoring data.",
    icon: "material-symbols:error",
    color: "error",
  });
}

const model = computed(() => data.value);
const summary = computed(() => model.value?.summary);
const feeds = computed(() => model.value?.feeds ?? []);

const dateLabel = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return dayjs(value).format("MMM D, YYYY h:mm A");
};

const staleAgeLabel = (value: string | null) => {
  if (!value) {
    return "Never fetched";
  }

  return `${dayjs(value).fromNow()} `;
};

const feedName = (feed: AdminRssFeed) => {
  const title = feed.title?.trim();

  if (title) {
    return title;
  }

  try {
    return new URL(feed.url).hostname;
  } catch {
    return feed.url;
  }
};

const columns: TableColumn<AdminRssFeed>[] = [
  {
    id: "feed",
    header: "Feed",
    cell: ({ row }) => {
      const feed = row.original;

      return h("div", { class: "min-w-0" }, [
        h(
          "p",
          { class: "truncate text-sm font-medium text-white" },
          feedName(feed),
        ),
        h("p", { class: "truncate text-xs text-white/55" }, feed.url),
      ]);
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const feed = row.original;

      return h("div", { class: "flex items-center gap-2" }, [
        h(UBadge, {
          color: feed.isStale ? "warning" : "success",
          variant: "subtle",
          label: feed.isStale ? "Stale" : "Fresh",
        }),
        h(
          "span",
          { class: "text-xs text-white/55" },
          staleAgeLabel(feed.lastFetchedAt),
        ),
      ]);
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const feed = row.original;

      return h("div", { class: "flex items-center gap-2" }, [
        h(UBadge, {
          color: feed.overLimitBy > 0 ? "warning" : "neutral",
          variant: "subtle",
          label: `${feed.itemCount}`,
        }),
      ]);
    },
  },
  {
    accessorKey: "subscriberCount",
    header: "Subscribers",
  },
  {
    id: "latestItemDate",
    header: "Latest Item",
    cell: ({ row }) => dateLabel(row.original.latestItemDate),
  },
  {
    id: "open",
    header: "",
    cell: ({ row }) =>
      h(UButton, {
        to: row.original.url,
        target: "_blank",
        size: "xs",
        variant: "ghost",
        color: "neutral",
        icon: "material-symbols:open-in-new",
      }),
  },
];
</script>

<template>
  <div class="relative h-full overflow-y-auto px-5 py-6 md:px-8 md:py-8">
    <div class="mx-auto w-full max-w-7xl space-y-5">
      <div
        v-if="status === 'pending' && !model"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        Loading RSS status...
      </div>

      <div
        v-else-if="!model || !summary"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        No RSS status available.
      </div>

      <template v-else>
        <UCard title="RSS Summary">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay title="All Feeds" :content="summary.totalFeeds" />

            <DataDisplay
              title="Subscribed Feeds"
              :content="summary.subscribedFeeds"
            />

            <DataDisplay title="Stale Feeds" :content="summary.staleFeeds" />

            <DataDisplay
              title="Feeds With No Items"
              :content="summary.feedsWithNoItems"
            />

            <DataDisplay title="Total Items" :content="summary.totalItems" />

            <DataDisplay
              title="Per-feed Limit"
              :content="summary.feedItemLimit"
            />
          </div>
        </UCard>

        <div
          v-if="!feeds.length"
          class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
        >
          No subscribed RSS feeds found.
        </div>

        <div
          v-else
          class="overflow-hidden rounded-2xl border border-white/20 bg-black/45 backdrop-blur-md"
        >
          <UTable :data="feeds" :columns="columns" class="flex-1" />
        </div>
      </template>
    </div>
  </div>
</template>
