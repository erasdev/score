<script setup lang="ts">
import type { Pdf } from '../types/pdf';
import DownloadIcon from './Icons/DownloadIcon.vue';
import ViewIcon from './Icons/ViewIcon.vue';
defineProps<{
  pdf: Pdf;
}>();
</script>

<template>
  <tr>
    <td class="px-3 py-5 text-base whitespace-nowrap">
      <div class="font-medium text-gray-800">{{ pdf.title }}</div>
    </td>
    <td class="px-3 py-5 text-base whitespace-nowrap text-gray-600">
      <div class="mt-1 text-gray-600">{{ pdf.artists.join(', ') }}</div>
    </td>
    <td class="px-3 py-5 text-base whitespace-nowrap text-gray-600">{{ pdf.instruments.join(', ') }}</td>
    <td class="px-3 py-5 text-base whitespace-nowrap text-gray-600">{{ pdf.tags.join(', ') }}</td>
    <td class="relative py-5 pr-4 pl-3 text-right text-base font-medium whitespace-nowrap">
      <div class="flex justify-end gap-2">
        <a
          :href="`/pdfs/${pdf.title}.pdf`"
          download
          class="text-accent hover:text-accent-dark"
        >
          <span class="sr-only">Download {{ pdf.title }}</span>
          <DownloadIcon />
        </a>
        <router-link :to="`/pdfs/${pdf.slug}`" class="text-accent hover:text-accent-dark">
          <span class="sr-only">View {{ pdf.title }}</span>
          <ViewIcon />
        </router-link>
      </div>
    </td>
  </tr>
</template> 