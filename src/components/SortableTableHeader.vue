<script setup lang="ts" generic="T extends Record<string, any>">
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

interface Props {
  label: string;
  sortKey: keyof T;
  currentSortKey: keyof T;
  sortDirection: 'asc' | 'desc';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'sort', key: keyof T): void;
}>();

const handleClick = () => {
  emit('sort', props.sortKey);
};
</script>
  
<template>
  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-text-dark">
    <button @click="handleClick" class="group inline-flex items-center">
      {{ label }}
      <span :class="[
        'ml-2 flex-none rounded-sm',
        currentSortKey === sortKey ? 'bg-surface-light text-text-dark' : 'text-text-light group-hover:text-text-dark'
      ]">
        <ChevronDownIcon :class="[
          'size-5',
          currentSortKey === sortKey && sortDirection === 'desc' ? 'rotate-180' : ''
        ]" aria-hidden="true" />
      </span>
    </button>
  </th>
</template> 