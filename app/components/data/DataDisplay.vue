<script setup lang="ts">
// Generic title-and-content presenter with a slot fallback for custom rendering.
const props = defineProps({
  title: {
    default: "",
    type: String,
  },
  content: {
    default: "",
    type: [String, Number],
  },
});

const hasContent = computed(
  () =>
    props.content !== "" &&
    props.content !== null &&
    props.content !== undefined,
);
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold">{{ title }}</h3>

    <p v-if="hasContent" class="pl-1 text-lg">{{ content }}</p>

    <slot v-else />
  </div>
</template>
