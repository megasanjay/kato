<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});

useSeoMeta({
  title: "Users | Admin",
});

type ItemLimit = {
  current: number;
  max: number;
};

type AdminUser = {
  id: string;
  username: string;
  firstName: string;
  createdAt: string;
  limits: {
    todos: ItemLimit;
    notes: ItemLimit;
    countdowns: ItemLimit;
  };
};

const dayjs = useDayjs();
const toast = useToast();
const { user } = useUserSession();
const UBadge = resolveComponent("UBadge");

watchEffect(() => {
  if (import.meta.client && user.value && !user.value.admin) {
    navigateTo("/");
  }
});

const { data, error, status } = await useFetch<AdminUser[]>(
  "/api/admin/users",
  {
    method: "GET",
  },
);

if (error.value) {
  toast.add({
    title: "Unable to load users",
    description:
      error.value.data?.message ||
      "An error occurred while fetching user monitoring data.",
    icon: "material-symbols:error",
    color: "error",
  });
}

const users = computed(() => data.value ?? []);

const formatJoined = (value: string) => dayjs(value).format("MMM D, YYYY");

const usagePercent = (limit: ItemLimit) =>
  Math.min(100, Math.round((limit.current / limit.max) * 100));

const usageColor = (limit: ItemLimit) => {
  const value = usagePercent(limit);

  if (value >= 100) return "error";
  if (value >= 90) return "warning";

  return "success";
};

const columns: TableColumn<AdminUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => row.original.firstName || "-",
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => formatJoined(row.original.createdAt),
  },
  {
    id: "todos",
    header: "Todos",
    cell: ({ row }) => {
      const limit = row.original.limits.todos;

      return h("div", { class: "flex items-center gap-2" }, [
        h(UBadge, {
          color: usageColor(limit),
          variant: "subtle",
          label: `${limit.current}/${limit.max}`,
        }),
        h(
          "span",
          { class: "text-xs text-white/60" },
          `${usagePercent(limit)}%`,
        ),
      ]);
    },
  },
  {
    id: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const limit = row.original.limits.notes;

      return h("div", { class: "flex items-center gap-2" }, [
        h(UBadge, {
          color: usageColor(limit),
          variant: "subtle",
          label: `${limit.current}/${limit.max}`,
        }),
        h(
          "span",
          { class: "text-xs text-white/60" },
          `${usagePercent(limit)}%`,
        ),
      ]);
    },
  },
  {
    id: "countdowns",
    header: "Countdowns",
    cell: ({ row }) => {
      const limit = row.original.limits.countdowns;

      return h("div", { class: "flex items-center gap-2" }, [
        h(UBadge, {
          color: usageColor(limit),
          variant: "subtle",
          label: `${limit.current}/${limit.max}`,
        }),
        h(
          "span",
          { class: "text-xs text-white/60" },
          `${usagePercent(limit)}%`,
        ),
      ]);
    },
  },
];
</script>

<template>
  <div class="relative h-full overflow-y-auto">
    <div class="mx-auto w-full max-w-7xl">
      <div
        v-if="status === 'pending' && !users.length"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        Loading users...
      </div>

      <div
        v-else-if="!users.length"
        class="rounded-2xl border border-white/15 bg-black/40 p-8 text-center text-white/75 backdrop-blur-sm"
      >
        No users found.
      </div>

      <div
        v-else
        class="overflow-hidden rounded-2xl border border-white/20 bg-black/45 backdrop-blur-md"
      >
        <UTable :data="users" :columns="columns" class="flex-1" />
      </div>
    </div>
  </div>
</template>
