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
  <div class="parent flex h-full w-full">
    <Transition name="fast-fade-blur" appear mode="out-in">
      <div
        v-if="mounted"
        class="top-center flex flex-col items-center justify-center"
      >
        <MainTimeFrame />

        <!-- <MainAffirmations /> -->
      </div>
    </Transition>

    <Transition name="fast-fade-blur" appear mode="out-in">
      <div class="bottom-left">
        <MainTabs />
      </div>
    </Transition>

    <Transition name="fast-fade-blur" appear mode="out-in">
      <div class="bottom-right">
        <MainNavigationButtons />
      </div>
    </Transition>
  </div>
</template>

<style lang="css" scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.bottom-left {
  grid-area: 7 / 2 / 12 / 7;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  min-height: 0;
  /* border: 1px solid; */
}
.bottom-right {
  grid-area: 7 / 8 / 12 / 12;
}
.top-center {
  grid-area: 2 / 3 / 5 / 11;
}
</style>
