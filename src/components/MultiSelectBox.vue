<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMultiSelect } from '../composables/useMultiSelect';

const props = defineProps<{
  modelValue: string[];
  options: string[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const { isActive, activate, deactivate } = useMultiSelect();
const containerRef = ref<HTMLElement | null>(null);

const isDropdownActive = computed(() => isActive());

const toggleOption = (option: string) => {
  const newValue = props.modelValue.includes(option)
    ? props.modelValue.filter(item => item !== option)
    : [...props.modelValue, option];
  emit('update:modelValue', newValue);
};

const removeOption = (option: string) => {
  emit('update:modelValue', props.modelValue.filter(item => item !== option));
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const inputContainer = containerRef.value?.querySelector('[data-input]');
  const dropdownList = containerRef.value?.querySelector('[data-dropdown]');
  
  // If we're clicking on the input container or an option, don't close
  if (target.closest('li') || inputContainer?.contains(target)) {
    return;
  }
  
  // If we're clicking inside the dropdown but not on an option, close it
  if (dropdownList?.contains(target)) {
    deactivate();
    return;
  }
  
  // If we're clicking outside both the input and dropdown, close it
  deactivate();
};

const openDropdown = () => {
  activate();
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="containerRef">
    <div class="relative">
      <!-- Input container -->
      <div
        data-input
        @click.stop="openDropdown"
        class="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-text-light shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-light cursor-pointer"
      >
        <div class="flex flex-wrap gap-1.5 min-h-6 items-center">
          <span v-if="modelValue.length === 0" class="text-text-light">{{ placeholder }}</span>
          <span
            v-for="option in modelValue"
            :key="option"
            class="inline-flex items-center gap-1 rounded bg-accent-light px-2 py-0.5 text-sm text-accent-dark"
          >
            {{ option }}
            <button
              @click.stop="removeOption(option)"
              class="text-accent-light hover:text-accent-dark"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <!-- Dropdown menu -->
      <div
        v-if="isDropdownActive"
        class="absolute z-10 mt-1 w-full rounded-md bg-white shadow ring-1 ring-gray-300 focus:outline-none"
      >
        <ul class="max-h-60 overflow-auto py-1 text-sm">
          <li
            v-for="option in options"
            :key="option"
            @click.stop="toggleOption(option)"
            class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-accent-dark hover:text-accent-light"
            :class="{ 'bg-accent-light': modelValue.includes(option) }"
          >
            <span class="block truncate text" :class="{ 'font-medium': modelValue.includes(option) }">
              {{ option }}
            </span>
            <span
              v-if="modelValue.includes(option)"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-accent-dark"
            >
              ✓
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

  