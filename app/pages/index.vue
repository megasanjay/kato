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
      <div v-if="mounted" class="top-left">
        <MainTimeFrame />
      </div>
    </Transition>

    <Transition name="fast-fade-blur" appear mode="out-in">
      <div v-if="mounted" class="bottom-left">
        <MainAffirmations />
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

.top-left {
  grid-area: 2 / 2 / 4 / 6;
}
.top-right {
  grid-area: 2 / 8 / 4 / 12;
}
.middle-center {
  grid-area: 5 / 5 / 9 / 9;
}
.bottom-left {
  grid-area: 10 / 2 / 12 / 7;
}
.bottom-right {
  grid-area: 10 / 9 / 12 / 12;
}
.top-left-extended {
  grid-area: 2 / 2 / 4 / 7;
}
</style>
