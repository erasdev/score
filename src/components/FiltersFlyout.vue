<script setup lang="ts">
import { useFilteringStore } from '../stores/filtering';
import MultiSelectBox from './MultiSelectBox.vue';
import { storeToRefs } from 'pinia';


const store = useFilteringStore();
const { filters, allTags, allGenres, allInstruments } = storeToRefs(store);
const { clearFilters} = store;
</script>
<template>

  <div data-filter-menu
    class="absolute right-0 mt-2 w-80 bg-surface-light rounded-md shadow ring-1 ring-gray-300 z-50">
    <div class="p-4 space-y-4 min-h-[320px] flex flex-col">
      <div>
        <label for="search" class="block text-base font-medium text-text-dark">Search</label>
        <div class="mt-2">
          <input
            id="search"
            v-model="filters.search"
            type="text"
            class="block w-full rounded-md bg-surface-light px-3 py-1.5 text-base text-text-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-text-light focus:ring-2 focus:ring-accent-light"
            placeholder="Title or Artist..."
          />
        </div>
      </div>

      <div>
        <label class="block text-base font-medium text-text-dark">Tags</label>
        <div class="mt-2">
          <MultiSelectBox v-model="filters.tags" :options="allTags" placeholder="Select tags" />
        </div>
      </div>

      <div>
        <label class="block text-base font-medium text-text-dark">Genres</label>
        <div class="mt-2">
          <MultiSelectBox v-model="filters.genres" :options="allGenres" placeholder="Select genres" />
        </div>
      </div>

      <div>
        <label class="block text-base font-medium text-text-dark">Instruments</label>
        <div class="mt-2">
          <MultiSelectBox v-model="filters.instruments" :options="allInstruments" placeholder="Select instruments" />
        </div>
      </div>

      <div class="pt-2 mt-auto border-t border-gray-200">
        <button
          @click="clearFilters"
          class="w-full inline-flex justify-center items-center gap-2 px-3 py-1.5 text-base font-medium text-text-dark bg-surface-light shadow-sm ring-1 ring-inset ring-gray-300 rounded-md hover:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent-light">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Clear all filters
        </button>
      </div>
    </div>
  </div>

</template>