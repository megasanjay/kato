<template>
  <main class="vignette mx-auto my-auto w-full">
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

onMounted(() => {
  mounted.value = true;
});
</script>
