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
      <div class="font-medium text-text-dark">{{ pdf.title }}</div>
    </td>
    <td class="px-3 py-5 text-base whitespace-nowrap text-text-light">
      <div class="mt-1 text-text-light">{{ pdf.artists.join(', ') }}</div>
    </td>
    <td class="px-3 py-5 text-base whitespace-nowrap text-text-light">{{ pdf.instruments.join(', ') }}</td>
    <td class="px-3 py-5 text-base whitespace-nowrap text-text-light">{{ pdf.tags.join(', ') }}</td>
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