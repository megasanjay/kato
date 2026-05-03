<script setup lang="ts">
export interface TabItem {
  label: string;
  value: string;
  icon: string;
}

const props = defineProps<{
  items: TabItem[];
  modelValue?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const activeTab = computed({
  get: () => props.modelValue ?? props.items[0]?.value ?? "",
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <div class="relative w-full">
    <div class="scroll-wrapper max-h-[calc(5/12*100vh)] overflow-y-scroll px-1">
      <slot :active-tab="activeTab" />
    </div>

    <div
      class="absolute top-full left-0 z-10 w-full pt-2 opacity-0 transition-opacity duration-300 hover:pointer-events-auto hover:opacity-100"
    >
      <div class="w-full border-b border-white/20" />

      <div class="mt-2 flex items-start justify-start">
        <UTooltip
          v-for="item in items"
          :key="item.value"
          :text="item.label"
          :delay-duration="200"
          placement="bottom"
        >
          <button
            type="button"
            class="cursor-pointer border-b-2 px-2 py-1 transition-colors"
            :class="
              activeTab === item.value
                ? 'border-white/40 text-white/60'
                : 'border-transparent text-white/30 hover:text-white/50'
            "
            @click="activeTab = item.value"
          >
            <UIcon :name="item.icon" class="size-4" />
          </button>
        </UTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-wrapper {
  scrollbar-width: none;
}

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
