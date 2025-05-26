<script setup lang="ts">
import type { Pdf } from '../types/pdf';
defineProps<{
    pdfs: Pdf[];
}>();
</script>
<template>
    <div v-for="pdf in pdfs" :key="pdf.title" class="bg-surface-light rounded-lg shadow ring-1 ring-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="space-y-1">
            <h3 class="text-xl font-medium text-text-dark break-words">{{ pdf.title }}</h3>
            <p class="text-base text-text-light break-words">{{ pdf.artists.join(', ') }}</p>
          </div>

          <div class="mt-3 flex flex-row flex-wrap gap-1">
            <div v-if="pdf.tags.length" class="space-y-1">
              <span class="sr-only">Tags</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in pdf.tags" :key="tag" class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div v-if="pdf.genres.length" class="space-y-1">
              <span class="sr-only">Genres</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="genre in pdf.genres" :key="genre" class="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  {{ genre }}
                </span>
              </div>
            </div>
            
            <div v-if="pdf.instruments.length" class="space-y-1 sm:col-span-2">
              <span class="sr-only">Instruments</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="instrument in pdf.instruments" :key="instrument" class="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                  {{ instrument }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <a
              :href="`/pdfs/${pdf.slug}`"
              target="_blank"
              class="inline-flex items-center gap-1.5 text-base font-medium text-accent-dark hover:text-accent-dark/90"
            >
              View PDF
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
</template>