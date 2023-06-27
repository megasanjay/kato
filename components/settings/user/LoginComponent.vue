<template>
  <section class="px-6">
    <h1>Login</h1>
    <n-divider />

    <p class="drop-shadow-m pt-1 text-white">
      You can sync your data across devices by logging in. This will also allow
      you to save your data to the cloud. If you don't have an account, you can
      create one by clicking the "Sign Up" button below.
    </p>

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-col space-y-2 pt-1">
          <div class="flex justify-start space-x-4 py-3">
            <NuxtLink to="/auth/login">
              <n-button color="#07518d" size="large" strong round>
                <Icon name="majesticons:logout" size="20" class="mr-2" />
                Login
              </n-button>
            </NuxtLink>

            <NuxtLink to="/auth/login">
              <n-button color="#07518d" size="large" strong round>
                <Icon name="majesticons:logout" size="20" class="mr-2" />
                Register
              </n-button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
