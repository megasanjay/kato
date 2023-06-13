<template>
  <header
    class="header left-0 top-0 z-50 mx-auto mb-8 w-full pb-3 pt-2 text-slate-50"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start">
        <div class="px-2">
          <NuxtLink
            to="/"
            class="flex flex-row items-center justify-start space-x-2"
          >
            <img src="/logo/logo.svg" alt="Logo" class="w-10" />
            <span class="text-xl font-bold">Kato</span>
          </NuxtLink>
        </div>
        <div class="flex w-fit justify-start space-x-4">
          <NuxtLink to="/" class="navigation-item"> Home </NuxtLink>
          <NuxtLink to="/projects" class="navigation-item"> Projects </NuxtLink>
          <NuxtLink to="/404" class="navigation-item"> 404 </NuxtLink>
        </div>
      </div>
      <div class="flex flex-row space-x-8">
        <n-space justify="space-between" align="center">
          <n-input size="large" placeholder="Search">
            <template #suffix>
              <Icon name="ion:search-sharp" />
            </template>
          </n-input>

          <div class="flex items-center justify-center space-x-2">
            <nuxt-link v-if="!loggedIn" to="/auth/login">
              <n-button type="primary" secondary> Login </n-button>
            </nuxt-link>
            <nuxt-link v-if="!loggedIn" to="/auth/register">
              <n-button type="info" secondary> Sign Up </n-button>
            </nuxt-link>

            <n-popover
              v-else
              trigger="click"
              content-style="padding: 8px; border-radius: 5px"
              footer-style="padding: 8px; border-radius: 5px"
              placement="bottom-end"
            >
              <template #trigger>
                <n-avatar
                  :size="48"
                  :src="`https://api.dicebear.com/6.x/thumbs/svg?seed=${user?.email}`"
                  class="hover:cursor-pointer hover:opacity-80"
                />
              </template>
              <div class="flex flex-col">
                <nuxt-link to="/profile" class="dropdown-item">
                  <Icon name="mingcute:user-4-fill" size="20" />
                  <span> Your profile </span>
                </nuxt-link>
                <nuxt-link to="/profile" class="dropdown-item">
                  <Icon name="ic:baseline-settings" size="20" />
                  <span> Settings </span>
                </nuxt-link>
              </div>
              <template #footer>
                <div class="dropdown-item" @click="logout">
                  <Icon name="majesticons:logout" size="20" />
                  <span> Logout </span>
                </div>
              </template>
            </n-popover>
          </div>
        </n-space>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { auth } = useSupabaseAuthClient();
const user = useSupabaseUser();

const loggedIn = computed(() => user.value);

const logout = async () => {
  await auth.signOut();
  window.location.href = "/";
};
</script>

<style scoped>
.navigation-item {
  @apply font-semibold text-slate-600 transition-all hover:text-slate-800;
}

.dropdown-item {
  @apply flex w-full cursor-pointer items-center justify-start space-x-2 px-2 py-1 text-base font-normal text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800;
}
</style>
