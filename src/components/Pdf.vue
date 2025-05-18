<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import LocalStorageBanner from './LocalStorageBanner.vue';
import type { Pdf } from '../types/pdf';

const route = useRoute();
const pdf = ref<Pdf | null>(null);
const hasLocalChanges = computed(() => !!pdf.value?._lastModified);

onMounted(async () => {
  const res = await fetch('/pdf-index.json');
  const all = await res.json();
  const hostedPdf = all.find((p: Pdf) => p.slug === route.params.slug);
  const localPdf = loadLocalPdf(route.params.slug as string);
  
  if (localPdf && hostedPdf) {
    const hostedTimestamp = new Date(hostedPdf._lastModified || 0).getTime();
    const localTimestamp = new Date(localPdf._lastModified || 0).getTime();

    // If hosted version is newer, remove from localStorage
    if (hostedTimestamp > localTimestamp) {
      const key = `draft:pdfs:${hostedPdf.slug}`;
      localStorage.removeItem(key);
      pdf.value = hostedPdf;
    } else {
      // Merge hosted and local data, preserving arrays
      pdf.value = {
        ...hostedPdf,
        ...localPdf,
        // Preserve arrays by merging them
        tags: [...new Set([...(hostedPdf.tags || []), ...(localPdf.tags || [])])],
        genres: [...new Set([...(hostedPdf.genres || []), ...(localPdf.genres || [])])],
        instruments: [...new Set([...(hostedPdf.instruments || []), ...(localPdf.instruments || [])])],
        artists: [...new Set([...(hostedPdf.artists || []), ...(localPdf.artists || [])])]
      };
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
      <LocalStorageBanner 
        :has-local-changes="hasLocalChanges" 
        :last-modified="pdf._lastModified"
      />
      <h1 class="text-3xl font-bold mb-4 text-gray-800">{{ pdf.title }}</h1>
      <p class="text-lg mb-6 text-gray-600">{{ pdf.description }}</p>
      <iframe :src="pdf.file" class="w-full h-[80vh]" />
    </div>
</template>