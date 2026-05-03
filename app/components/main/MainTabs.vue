<script setup lang="ts">
import type { TabItem } from "~/components/tab/TabComponent.vue";

const tabs: TabItem[] = [
  { label: "To Do", value: "todo", icon: "i-lucide-list-check" },
  { label: "Pomodoro", value: "pomodoro", icon: "i-lucide-timer" },
  { label: "Notes", value: "notes", icon: "glyphs:note-pad-1-bold" },
  { label: "Countdown", value: "countdown", icon: "basil:timer-solid" },
];
const activeTab = ref("todo");

const { data, error } = await useFetch("/api/tab", {
  method: "GET",
});

if (error.value) {
  console.error("Error fetching initial tab:", error.value);
}

if (data.value) {
  console.log("Initial tab fetched successfully:", data.value);

  if (data.value?.currentTab) {
    activeTab.value = data.value.currentTab;
  }
}

watch(activeTab, (newVal) => {
  console.log("Active tab changed to:", newVal);

  $fetch("/api/tab", {
    method: "POST",
    body: {
      name: newVal,
    },
  })
    .then(() => {
      console.log("Tab change logged successfully");
    })
    .catch((error) => {
      console.error("Error logging tab change:", error);
    });
});
</script>

<template>
  <TabWrapper v-model="activeTab" :items="tabs">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <div v-if="activeTab === 'todo'" class="mt-4">
        <TabToDo />
      </div>

      <div v-else-if="activeTab === 'pomodoro'" class="mt-4">
        Pomodoro content
      </div>

      <div v-else-if="activeTab === 'notes'" class="mt-4">Notes content</div>

      <div v-else-if="activeTab === 'countdown'" class="mt-4">
        Countdown content
      </div>
    </Transition>
  </TabWrapper>
</template>
