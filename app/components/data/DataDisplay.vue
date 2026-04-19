<script setup lang="ts">
// Generic title-and-content presenter with a slot fallback for custom rendering.
const props = defineProps({
  title: {
    default: "",
    type: String,
  },
  content: {
    default: "",
    type: String,
  },
});

const hasContent = computed(() => props.content.length > 0);
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold">{{ title }}</h3>

    <p v-if="hasContent" class="text-lg">{{ content }}</p>

    <slot v-else />
  </div>
</template>
