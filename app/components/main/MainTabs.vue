<script setup lang="ts">
import type { TabItem } from "~/components/tab/TabComponent.vue";

const tabs: TabItem[] = [
  { label: "Account", value: "account", icon: "i-lucide-user" },
  { label: "Password", value: "password", icon: "i-lucide-lock" },
];
const activeTab = ref("account");
</script>

<template>
  <TabComponent v-model="activeTab" :items="tabs">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <div v-if="activeTab === 'account'" class="mt-4">Account content</div>

      <div v-else-if="activeTab === 'password'" class="mt-4">
        Password content
      </div>
    </Transition>
  </TabComponent>
</template>
