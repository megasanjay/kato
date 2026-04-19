<script setup lang="ts">
// Landing page that fades in the time-focused home experience.
useSeoMeta({
  title: "Kato",
});

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

onBeforeUnmount(() => {
  mounted.value = false;
});
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <div v-if="mounted" class="main-home-container">
        <MainTimeFrame />
      </div>
    </Transition>
  </div>
</template>
