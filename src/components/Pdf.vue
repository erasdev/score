<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pdf = ref(null);

onMounted(async () => {
  const res = await fetch('/pdf-index.json');
  const all = await res.json();
  pdf.value = all.find(p => p.slug === route.params.slug);
});
</script>

<template>
    <div v-if="pdf" class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-2">{{ pdf.title }}</h1>
      <p class="mb-4">{{ pdf.description }}</p>
      <iframe :src="pdf.file" class="w-full h-[80vh]" />
    </div>
  </template>