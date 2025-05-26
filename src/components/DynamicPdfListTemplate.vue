<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useFilteringStore } from '../stores/filtering';
import { storeToRefs } from 'pinia';
import EmptyStateMessage from './EmptyStateMessage.vue';
import PdfCardList from './PdfCardList.vue';
import PdfTable from './PdfTable.vue';
import fetchPdfs from '../helpers/fetchPdfs';

const store = useFilteringStore();
const { filteredPdfs, showFilters } = storeToRefs(store);
const { handleClickOutside, setPdfs } = store;

onMounted(async () => {
    const pdfs = await fetchPdfs();
    setPdfs(pdfs);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<template>
     <!-- Mobile Card View -->
    <div 
      class="block md:hidden space-y-4 transition-all mt-2 duration-300 ease-out"
      :class="{ 'translate-y-0 delay-200': !showFilters, 'translate-y-[10px]': showFilters }">
      <EmptyStateMessage v-if="filteredPdfs.length === 0" />
      <PdfCardList v-else :pdfs="filteredPdfs" />
    </div>
  

    <!-- Desktop Table View -->
    <div class="hidden md:block py-4 px-4 sm:px-6 lg:px-8">
      <EmptyStateMessage v-if="filteredPdfs.length === 0" />
      <PdfTable v-else :pdfs="filteredPdfs" />
    </div>
</template>