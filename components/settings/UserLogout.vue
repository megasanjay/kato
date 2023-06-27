<template>
  <section class="px-6">
    <h1>Logout</h1>
    <n-divider />

    <p class="drop-shadow-m pt-1 text-white">
      Use this button to log out of your account. You will be redirected to the
      home page. Any data you have stored on your device will be deleted.
    </p>

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-col space-y-2 pt-1">
          <div class="py-3">
            <n-button
              color="#07518d"
              size="large"
              :disabled="!isLoggedIn"
              strong
              round
              @click="logout"
            >
              <Icon name="majesticons:logout" size="20" class="mr-2" />
              Sign Out
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";

const message = useMessage();

const { auth } = useSupabaseAuthClient();
const user = useSupabaseUser();

const isLoggedIn = computed(() => user.value);

const logout = async () => {
  await auth.signOut();

  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  window.localStorage.clear();

  message.success("You have been logged out.");

  navigateTo("/");
};
</script>
