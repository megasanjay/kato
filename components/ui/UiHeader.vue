<template>
  <header class="header-container">
    <div
      class="relative z-10 flex w-full items-center justify-between px-8 pt-4"
    >
      <nuxt-link
        to="/"
        class="group relative z-10 cursor-pointer text-white hover:text-cyan-200"
      >
        <div
          class="flex scale-95 flex-row items-center justify-start space-x-2 transition-all group-hover:scale-100 group-hover:drop-shadow-xl"
        >
          <img src="/logo/logo.svg" alt="Logo" class="w-10" />
        </div>
      </nuxt-link>

      <nuxt-link
        to="/settings"
        class="group relative z-10 cursor-pointer text-white hover:text-cyan-200"
      >
        <div
          class="flex flex-row items-center justify-start space-x-2 transition-all"
        >
          <div
            class="w-0 overflow-hidden transition-[width] group-hover:w-[64px]"
          >
            Settings
          </div>
          <Icon
            name="material-symbols:settings-b-roll-outline-rounded"
            size="20"
          />
        </div>
      </nuxt-link>
    </div>
  </header>
</template>

<script setup lang="ts"></script>
