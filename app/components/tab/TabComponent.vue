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
  <div class="group w-full">
    <div
      class="flex justify-end border-b border-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <UTooltip
        v-for="item in items"
        :key="item.value"
        :text="item.label"
        :delay-duration="200"
      >
        <button
          type="button"
          class="-mb-px border-b-2 px-3 py-2.5 transition-colors"
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

    <slot :active-tab="activeTab" />
  </div>
</template>
