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
import { useBackgroundImageStore } from "~/stores/backgroundImage";

const mounted = ref(false);

const backgroundStore = useBackgroundImageStore();

onMounted(() => {
  mounted.value = true;

  backgroundStore.getDailyImages().then(() => {
    backgroundStore.setBackgroundImage();

    console.log("updated daily images on mounted");
  });
});
</script>
