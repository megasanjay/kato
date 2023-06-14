<template>
  <div class="flex flex-col space-y-2 p-4 text-white">
    <n-form-item label="Display Name" size="large">
      <div class="flex items-center space-x-4">
        <n-input
          v-model:value="displayName"
          size="large"
          class="!w-[250px]"
          placeholder="April"
        />

        <n-button color="#07518d" strong @click="updateDisplayName">
          <Icon name="majesticons:logout" size="20" />
          Save
        </n-button>
      </div>
    </n-form-item>

    <n-form-item label="Full Name" size="large">
      <div class="flex items-center space-x-4">
        <n-input
          v-model:value="fullName"
          size="large"
          class="!w-[250px]"
          placeholder="April Ludgate"
        />

        <n-button color="#07518d" strong @click="updateFullName">
          <Icon name="majesticons:logout" size="20" />
          Save
        </n-button>
      </div>
    </n-form-item>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const displayName = ref("");
const fullName = ref("");

onMounted(() => {
  displayName.value = userStore.displayName;
  fullName.value = userStore.fullName;
});

const updateDisplayName = () => {
  userStore.updateDisplayName(displayName.value);
};

const updateFullName = () => {
  userStore.updateFullName(fullName.value);
};
</script>
