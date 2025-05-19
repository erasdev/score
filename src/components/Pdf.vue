<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import LocalStorageBanner from './LocalStorageBanner.vue';
import type { Pdf } from '../types/pdf';
import deepEqual from '../helpers/deepEqual';
import fetchPdfs from '../helpers/fetchPdfs';
const route = useRoute();
const pdf = ref<Pdf | null>(null);
const hasLocalChanges = computed(() => {
  const localPdf = localStorage.getItem(`draft:pdfs:${route.params.slug}`);
  return !!localPdf;
});

onMounted(async () => {
  const all = await fetchPdfs();
  const hostedPdf = all.find((p: Pdf) => p.slug === route.params.slug);
  const localPdf = loadLocalPdf(route.params.slug as string);
  
  if (localPdf && hostedPdf) {
    // Use local version if it's different from hosted
    if (!deepEqual(localPdf, hostedPdf)) {
      pdf.value = localPdf;
    } else {
      // Remove from localStorage if identical
      localStorage.removeItem(`draft:pdfs:${route.params.slug}`);
      pdf.value = hostedPdf;
    }
  } else {
    pdf.value = localPdf || hostedPdf;
  }
});

function loadLocalPdf(slug: string) {
  const key = `draft:pdfs:${slug}`;
  const localDraft = localStorage.getItem(key);
  if (localDraft) {
    try {
      return JSON.parse(localDraft);
    } catch {
      return null;
    }
  }
  return null;
}

</script>

<template>
  <div v-if="pdf" class="p-4">
    <LocalStorageBanner :has-local-changes="hasLocalChanges" />
    <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ pdf.title }}</h1>
    <p class="text-lg mb-6 text-gray-600">{{ pdf.description }}</p>
    <iframe :src="pdf.file" class="w-full h-[80vh]" />
  </div>
</template>