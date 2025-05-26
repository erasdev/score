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
const currentPage = ref(1);
const itemsPerPage = 25;

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

const paginatedPdfs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedPdfs.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(sortedPdfs.value.length / itemsPerPage));

const handleSort = (key: keyof Pdf) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
  // Reset to first page when sorting changes
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>

  
    <div class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full ring-1 ring-inset ring-gray-300 bg-surface-dark overflow-hidden rounded-md">
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
            <tbody class="divide-y divide-gray-200 ring-1 ring-inset ring-gray-300 rounded-b-md bg-surface-light">
              <PdfTableRow
                v-for="pdf in paginatedPdfs"
                :key="pdf.slug"
                :pdf="pdf"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between bg-background py-2">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-surface px-4 py-2 text-base font-medium text-text-dark hover:bg-surface-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-surface px-4 py-2 text-base font-medium text-text-dark hover:bg-surface-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-base text-text-dark">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, sortedPdfs.length) }}</span>
              of
              <span class="font-medium">{{ sortedPdfs.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 bg-surface-light text-text-light ring-1 ring-inset ring-gray-300 hover:bg-surface-dark focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                  page === currentPage
                    ? 'z-10 bg-accent-dark text-accent-light focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                    : 'text-text-dark ring-1 ring-inset ring-gray-300 hover:bg-surface-dark focus:z-20 bg-surface-light focus:outline-offset-0'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 bg-surface-light text-text-light ring-1 ring-inset ring-gray-300 hover:bg-surface-dark focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

  </template>
  