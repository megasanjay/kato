<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

useSeoMeta({
  title: "Metrics | Admin",
});

type MetricsResponse = {
  generatedAt: string;
  totals: {
    users: number;
    adminUsers: number;
    wallpapers: number;
    todos: number;
    notes: number;
    countdowns: number;
  };
  wallpapers: {
    today: number;
    upcoming: number;
    outlined: number;
  };
  rss: {
    feeds: number;
    subscriptions: number;
    items: number;
    staleFeeds: number;
    feedsWithNoItems: number;
    perUserFeedLimit: number;
    perFeedItemLimit: number;
    staleAfterHours: number;
  };
  limits: {
    itemLimit: number;
    usersAtOrOverLimit: {
      todos: number;
      notes: number;
      countdowns: number;
    };
    maxUsagePercent: {
      todos: number;
      notes: number;
      countdowns: number;
    };
    averagePerUser: {
      todos: number;
      notes: number;
      countdowns: number;
    };
  };
};

const dayjs = useDayjs();
const toast = useToast();
const { user } = useUserSession();

watchEffect(() => {
  if (import.meta.client && user.value && !user.value.admin) {
    navigateTo("/");
  }
});

const { data, error, status } = await useFetch<MetricsResponse>(
  "/api/admin/metrics",
  {
    method: "GET",
  },
);

if (error.value) {
  toast.add({
    title: "Unable to load metrics",
    description:
      error.value.data?.message ||
      "An error occurred while fetching admin metrics.",
    icon: "material-symbols:error",
    color: "error",
  });
}

const metrics = computed(() => data.value);
const generatedAtLabel = computed(() => {
  if (!metrics.value?.generatedAt) {
    return "-";
  }

  return dayjs(metrics.value.generatedAt).format("MMM D, YYYY h:mm A");
});
</script>

<template>
  <div class="relative h-full overflow-y-auto px-5 py-6 md:px-8 md:py-8">
    <div class="mx-auto w-full max-w-7xl space-y-5">
      <div
        v-if="status === 'pending' && !metrics"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        Loading metrics...
      </div>

      <div
        v-else-if="!metrics"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        No metrics available.
      </div>

      <template v-else>
        <div
          class="rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white/70 backdrop-blur-sm"
        >
          Updated: {{ generatedAtLabel }}
        </div>

        <UCard title="Overall Metrics">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay title="Users" :content="metrics.totals.users" />

            <DataDisplay title="Admins" :content="metrics.totals.adminUsers" />

            <DataDisplay
              title="Wallpapers"
              :content="metrics.totals.wallpapers"
            />

            <DataDisplay title="Todos" :content="metrics.totals.todos" />

            <DataDisplay title="Notes" :content="metrics.totals.notes" />

            <DataDisplay
              title="Countdowns"
              :content="metrics.totals.countdowns"
            />
          </div>
        </UCard>

        <UCard title="Wallpaper Metrics">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay
              title="Generated Today"
              :content="metrics.wallpapers.today"
            />

            <DataDisplay
              title="Upcoming"
              :content="metrics.wallpapers.upcoming"
            />

            <DataDisplay
              title="With Text Outline"
              :content="metrics.wallpapers.outlined"
            />
          </div>
        </UCard>

        <UCard title="RSS Metrics">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay title="Feeds" :content="metrics.rss.feeds" />

            <DataDisplay
              title="Subscriptions"
              :content="metrics.rss.subscriptions"
            />

            <DataDisplay title="Items" :content="metrics.rss.items" />

            <DataDisplay
              title="Stale Feeds"
              :content="metrics.rss.staleFeeds"
            />

            <DataDisplay
              title="Feeds With No Items"
              :content="metrics.rss.feedsWithNoItems"
            />

            <DataDisplay
              title="Per-user Feed Limit"
              :content="metrics.rss.perUserFeedLimit"
            />

            <DataDisplay
              title="Per-feed Item Limit"
              :content="metrics.rss.perFeedItemLimit"
            />

            <DataDisplay
              title="Stale After (Hours)"
              :content="metrics.rss.staleAfterHours"
            />
          </div>
        </UCard>

        <UCard title="Usage Limits">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay
              title="Per-user Item Limit"
              :content="metrics.limits.itemLimit"
            />

            <DataDisplay
              title="Users at/over Todo Limit"
              :content="metrics.limits.usersAtOrOverLimit.todos"
            />

            <DataDisplay
              title="Users at/over Note Limit"
              :content="metrics.limits.usersAtOrOverLimit.notes"
            />

            <DataDisplay
              title="Users at/over Countdown Limit"
              :content="metrics.limits.usersAtOrOverLimit.countdowns"
            />
          </div>
        </UCard>

        <UCard title="Max Usage % (Any Single User)">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay
              title="Todos"
              :content="metrics.limits.maxUsagePercent.todos + '%'"
            />

            <DataDisplay
              title="Notes"
              :content="metrics.limits.maxUsagePercent.notes + '%'"
            />

            <DataDisplay
              title="Countdowns"
              :content="metrics.limits.maxUsagePercent.countdowns + '%'"
            />
          </div>
        </UCard>

        <UCard title="Average Per User">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <DataDisplay
              title="Todos"
              :content="metrics.limits.averagePerUser.todos"
            />

            <DataDisplay
              title="Notes"
              :content="metrics.limits.averagePerUser.notes"
            />

            <DataDisplay
              title="Countdowns"
              :content="metrics.limits.averagePerUser.countdowns"
            />
          </div>
        </UCard>
      </template>
    </div>
  </div>
</template>
