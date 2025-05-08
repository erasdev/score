<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Pdf } from '../types/pdf';

const pdfs = ref<Pdf[]>([]);

onMounted(async () => {
  const res = await fetch('/pdf-index.json');
  pdfs.value = await res.json();
});
</script>

<template>
    <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-xl font-bold mb-4">PDF Library</h1>
    <table class="table-auto w-full border">
      <thead>
        <tr>
          <th class="border px-4 py-2 text-left">Title</th>
          <th class="border px-4 py-2 text-left">Description</th>
          <th class="border px-4 py-2 text-left">Tags</th>
          <th class="border px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pdf in pdfs" :key="pdf.slug">
          <td class="border px-4 py-2">{{ pdf.title }}</td>
          <td class="border px-4 py-2">{{ pdf.description }}</td>
          <td class="border px-4 py-2">{{ pdf.tags.join(', ') }}</td>
          <td class="border px-4 py-2">
            <router-link :to="`/pdfs/${pdf.slug}`" class="text-blue-500 underline">View</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>