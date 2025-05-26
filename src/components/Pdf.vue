<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Pdf } from '../types/pdf';
import fetchPdfs from '../helpers/fetchPdfs';
const route = useRoute();
const pdf = ref<Pdf | null>(null);


onMounted(async () => {
  const all = await fetchPdfs();
  pdf.value = all.find((p: Pdf) => p.slug === route.params.slug);
  
});



</script>

<template>
  <div v-if="pdf" class="p-4">
    <h1 class="text-3xl font-bold mb-4 text-text-dark">{{ pdf.title }}</h1>
    <p class="text-lg mb-6 text-text-light">{{ pdf.description }}</p>
    <iframe :src="pdf.file" class="w-full h-[80vh]" />
  </div>
</template>