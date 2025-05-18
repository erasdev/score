<script setup lang="ts">
import type { Pdf } from '../types/pdf';

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
          class="text-indigo-700 hover:text-indigo-800"
        >
          <span class="sr-only">Download {{ pdf.title }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
        <router-link :to="`/pdfs/${pdf.slug}`" class="text-indigo-700 hover:text-indigo-800">
          <span class="sr-only">View {{ pdf.title }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
        </router-link>
      </div>
    </td>
  </tr>
</template> 