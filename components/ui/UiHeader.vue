<template>
  <header
    class="relative z-10 flex w-full items-center justify-between px-4 py-2"
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
  </header>
</template>

<script setup lang="ts"></script>
