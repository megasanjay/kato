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
  grid-area: 2 / 2 / 4 / 4;
}
.top-center {
  grid-area: 2 / 5 / 4 / 7;
}
.top-right {
  grid-area: 2 / 8 / 4 / 10;
}
.middle-left {
  grid-area: 5 / 2 / 7 / 4;
}
.middle-center {
  grid-area: 5 / 5 / 7 / 7;
}
.middle-right {
  grid-area: 5 / 8 / 7 / 10;
}
.bottom-left {
  grid-area: 8 / 2 / 10 / 4;
}
.bottom-center {
  grid-area: 8 / 5 / 10 / 7;
}
.bottom-right {
  grid-area: 8 / 8 / 10 / 10;
}
</style>
