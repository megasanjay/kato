<template>
  <main class="flex h-full w-full items-center justify-center">
    <section
      class="container flex h-max w-max max-w-screen-lg flex-row items-center justify-start rounded-xl bg-white/30 p-4 backdrop-blur-xl"
    >
      <div class="mx-12">
        <ClientOnly>
          <Vue3Lottie
            animation-link="https://assets7.lottiefiles.com/packages/lf20_e1y24wm2.json"
            :height="300"
            :width="300"
            class="drop-shadow-xl"
          />
        </ClientOnly>
      </div>

      <div class="mx-12 flex w-full flex-1 flex-grow-[2] flex-col text-white">
        <h1 class="drop-shadow-xl">Verification link sent!</h1>

        <p class="mt-6 text-base text-white drop-shadow-xl">
          We've sent a verification link to your email address. Please click the
          link in the email to verify your account.
        </p>

        <n-divider />

        <p class="text-sm text-white drop-shadow-xl">
          If you don't see the email, please check your spam folder. If you
          still don't see the email, please contact us at
          <a
            href="mailto:help@kato.day"
            class="text-sky-300 hover:text-sky-200"
          >
            help@kato.day</a
          >.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    if (user.value.email_confirmed_at) {
      return navigateTo("/projects");
    }
  }
});
</script>
