<script setup lang="ts">
import { useFilteringStore } from '../stores/filtering';
import { storeToRefs } from 'pinia';

const store = useFilteringStore();
const { showFilters, count } = storeToRefs(store);
</script>

<template>
    <button
        data-filter-button
        @click="showFilters = !showFilters"
        class="inline-flex items-center gap-2 px-3 py-1.5 text-base font-medium text-text-dark bg-surface-light shadow-xs ring-1 ring-inset ring-gray-300 rounded-md hover:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-accent-light transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Filters
            <span v-if="count" class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-accent-dark bg-accent-light rounded-full">
                {{ count }}
            </span>
    </button>
    
</template>