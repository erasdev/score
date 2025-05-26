<script setup lang="ts">
import FiltersFlyout from './FiltersFlyout.vue';
import FiltersInline from './FiltersInline.vue';
import FiltersButton from './FiltersButton.vue';
import { useFilteringStore } from '../stores/filtering';
import { storeToRefs } from 'pinia';

const store = useFilteringStore();
const { showFilters } = storeToRefs(store);

</script>
<template>
      <div class="relative sm:px-6 lg:px-8">
      <div class="flex justify-end items-center">
        <div class="relative">
          <FiltersButton />
          <!-- Inline Flyout for Desktop -->
          <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
          <FiltersFlyout  v-show="showFilters" class="hidden md:block" />
          </Transition>
        </div>
      </div>
    </div>

    <!-- Inline Filters for Mobile -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <FiltersInline v-if="showFilters" class="block md:hidden" />
    </Transition>
</template>