<script setup lang="ts">
import type { Pdf } from '../types/pdf';
import SortableTableHeader from './SortableTableHeader.vue';
import PdfTableRow from './PdfTableRow.vue';
import { ref, computed } from 'vue';

const props = defineProps({
  pdfs: {
    type: Array as () => Pdf[],
    required: true,
  },
});

const sortKey = ref<keyof Pdf>('title');
const sortDirection = ref<'asc' | 'desc'>('asc');

const sortedPdfs = computed(() => {
  if (!props.pdfs) return [];
  
  return [...props.pdfs].sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];
    
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      const comparison = aValue.join(', ').localeCompare(bValue.join(', '));
      return sortDirection.value === 'asc' ? comparison : -comparison;
    }
    
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

const handleSort = (key: keyof Pdf) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8">
  
      <div class="py-4 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full ring-1 ring-inset ring-gray-300 bg-gray-50 rounded-md">
              <thead>
                <tr>
                  <SortableTableHeader
                    label="Title"
                    sort-key="title"
                    :current-sort-key="sortKey"
                    :sort-direction="sortDirection"
                    @sort="handleSort"
                  />
                  <SortableTableHeader
                    label="Artist(s)"
                    sort-key="artists"
                    :current-sort-key="sortKey"
                    :sort-direction="sortDirection"
                    @sort="handleSort"
                  />
                  <SortableTableHeader
                    label="Instrument(s)"
                    sort-key="instruments"
                    :current-sort-key="sortKey"
                    :sort-direction="sortDirection"
                    @sort="handleSort"
                  />
                  <SortableTableHeader
                    label="Tags"
                    sort-key="tags"
                    :current-sort-key="sortKey"
                    :sort-direction="sortDirection"
                    @sort="handleSort"
                  />
                  <th scope="col" class="relative py-3.5 pr-0 pl-3">
                    <span class="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 ring-1 ring-inset ring-gray-300 rounded-b-md bg-white">
                <PdfTableRow
                  v-for="pdf in sortedPdfs"
                  :key="pdf.slug"
                  :pdf="pdf"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  