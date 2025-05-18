<script setup lang="ts">
import type { Pdf } from '../types/pdf';

defineProps<{
  pdf: Pdf;
}>();
</script>

<template>
  <tr>
    <td class="px-3 py-5 text-sm whitespace-nowrap">
      <div class="font-medium text-gray-900">{{ pdf.title }}</div>
    </td>
    <td class="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
      <div class="mt-1 text-gray-500">{{ pdf.artists.join(', ') }}</div>
    </td>
    <td class="px-3 py-5 text-sm whitespace-nowrap text-gray-500">{{ pdf.instruments.join(', ') }}</td>
    <td class="px-3 py-5 text-sm whitespace-nowrap text-gray-500">{{ pdf.tags.join(', ') }}</td>
    <td class="relative py-5 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap">
      <router-link :to="`/pdfs/${pdf.slug}`" class="text-indigo-600 hover:text-indigo-900"
        >View<span class="sr-only">, {{ pdf.slug }}</span></router-link
      >
    </td>
  </tr>
</template> 