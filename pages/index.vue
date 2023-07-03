<template>
  <main class="mx-auto my-auto w-full">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <div v-if="mounted">
        <MainTimeFrame />
        <MainAffirmationsComponent />

        <MainSearchComponent />
      </div>
    </Transition>
  </main>
</template>

<script setup>
const mounted = ref(false);

/**
 * TODO: Update this page to use a grid layout
 */

onMounted(() => {
  mounted.value = true;
});
</script>
