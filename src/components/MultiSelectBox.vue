<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
  options: {
    type: Array as () => string[],
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select options',
  },
});

const emit = defineEmits(['update:modelValue']);

function updateValue(newValue: string[]) {
  emit('update:modelValue', newValue);
}
</script>
<template>
    <div class="w-full">
      <Listbox :modelValue="modelValue" @update:modelValue="updateValue" multiple>
        <div class="relative">
          <ListboxButton class="relative w-full border rounded bg-white py-2 pl-3 pr-10 text-left shadow-sm">
            <span class="block truncate">
              <template v-if="modelValue.length > 0">
                {{ modelValue.join(', ') }}
              </template>
              <template v-else>
                {{ placeholder }}
              </template>
            </span>
          </ListboxButton>
  
          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow-sm focus:outline-none">
            <ListboxOption
              v-for="option in options"
              :key="option"
              :value="option"
              class="cursor-pointer select-none px-3 py-2 hover:bg-gray-100"
              :class="{ 'bg-blue-100': modelValue.includes(option) }"
            >
              <div class="flex items-center gap-2">
                <input type="checkbox" :checked="modelValue.includes(option)" class="accent-blue-600" />
                <span>{{ option }}</span>
              </div>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  </template>
  

  