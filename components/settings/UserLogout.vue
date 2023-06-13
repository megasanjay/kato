<template>
  <div class="p-4 text-white">
    <p class="mb-4">
      Use this page to log out of your account. You will be redirected to the
      home page. Any data you have stored on your device will be deleted.
    </p>

    <n-button
      color="#07518d"
      size="large"
      :disabled="!isLoggedIn"
      strong
      round
      @click="logout"
    >
      <Icon name="majesticons:logout" size="20" />
      Sign Out
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";

const message = useMessage();

const { auth } = useSupabaseAuthClient();
const user = useSupabaseUser();

const isLoggedIn = computed(() => user.value);

const logout = async () => {
  await auth.signOut();

  message.success("You have been logged out.");

  navigateTo("/");
};
</script>
