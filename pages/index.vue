<script setup>
const mounted = ref(false);

definePageMeta({
  layout: "home",
});

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <main class="main-page-container relative h-full w-full">
    <div class="absolute bottom-0 left-0 w-full">
      <Transition name="fast-fade-blur" appear mode="out-in">
        <div v-if="mounted" class="main-home-container">
          <MainTimeFrame />
          <MainAffirmationsComponent />
        </div>
      </Transition>
    </div>
  </main>
</template>
