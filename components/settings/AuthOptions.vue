<template>
  <div>
    <SettingsUserLogoutComponent v-if="isLoggedIn" />
    <SettingsUserLoginComponent v-else />
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

const isLoggedIn = computed(() => user.value);
</script>
