<script setup lang="ts">
// Signup page that creates a user account and surfaces verification guidance.
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const config = useRuntimeConfig();
const { loggedIn } = useUserSession();

if (loggedIn.value) {
  await navigateTo("/app/dashboard");
}

useSeoMeta({
  title: "Signup",
});

const toast = useToast();
const loading = ref(false);

const showPassword = ref(false);

const schema = z.object({
  username: z.string(),
  lastName: z.string(),
  firstName: z.string().optional(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  username: "pickle_rick",
  lastName: "Sanchez",
  firstName: "Rick",
  password: "12345678",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const body = {
    username: event.data.username,
    lastName: event.data.lastName,
    firstName: event.data.firstName,
    password: event.data.password,
  };

  loading.value = true;

  await $fetch("/api/auth/signup", {
    body,
    method: "POST",
  })
    .then(() => {
      toast.add({
        title: "Account created successfully",
        color: "info",
        description: config.public.ENABLE_EMAIL_VERIFICATION
          ? "Please check your email to verify your account before logging in."
          : "You can now log in to your account.",
        icon: "material-symbols:mail-outline",
      });
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error(error.data);
      toast.add({
        title: "Error creating account",
        color: "error",
        description: error.data.statusMessage,
        icon: "material-symbols:error",
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <UButton
      icon="i-heroicons-home"
      label="Home"
      to="/"
      color="neutral"
      variant="ghost"
      class="absolute top-4"
    />

    <UCard
      class="w-full max-w-sm bg-white/55 backdrop-blur dark:bg-neutral-900/60"
    >
      <div class="w-full max-w-sm px-4 py-5 sm:p-6">
        <div class="flex flex-col items-center justify-center">
          <Icon name="line-md:account-add" :size="40" />

          <h2 class="my-1 text-2xl font-bold">Create an account</h2>

          <p class="font-medium text-slate-600 dark:text-slate-400">
            Already have an account?
            <NuxtLink to="/login" class="text-primary-500 font-medium">
              Login
            </NuxtLink>
          </p>
        </div>

        <UForm
          :schema="schema"
          :state="state"
          class="mt-6 space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Username" name="username" required>
            <UInput v-model="state.username" type="text" />
          </UFormField>

          <UFormField label="First Name" name="firstName" required>
            <UInput v-model="state.firstName" type="text" />
          </UFormField>

          <UFormField label="Last Name" name="lastName">
            <UInput v-model="state.lastName" type="text" />
          </UFormField>

          <UFormField label="Password" name="password" required>
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #trailing>
                <Icon
                  name="solar:eye-linear"
                  size="16"
                  class="cursor-pointer text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  @mousedown="showPassword = true"
                  @mouseup="showPassword = false"
                />
              </template>
            </UInput>
          </UFormField>

          <UButton
            type="submit"
            class="flex w-full justify-center"
            :loading="loading"
          >
            Create account
          </UButton>
        </UForm>
      </div>

      <template #footer>
        <p class="text-center text-sm">
          By signing up, you agree to our
          <NuxtLink to="/signup" class="text-primary-500 text-sm font-medium">
            Terms of Service</NuxtLink
          >.
        </p>
      </template>
    </UCard>
  </div>
</template>
