<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import MultiSelectBox from './MultiSelectBox.vue';
import PdfTable from './PdfTable.vue';
import LocalStorageBanner from './LocalStorageBanner.vue';
import type { Pdf } from '../types/pdf';
import type { SiteConfig } from '../types/site';
import { useFiltering } from '../composables/useFiltering';

const pdfs = ref<Pdf[]>([]);
const siteConfig = ref<SiteConfig>({
  title: "Ricky Bob Dog's Collection",
  description: "A collection of musical scores and arrangements.",
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#1f2937',
    accent: '#4f46e5'
  }
});

const hasLocalChanges = computed(() => {
  return Object.keys(localStorage).some(key => key.startsWith('draft:'));
});

const { filters, allTags, allGenres, allInstruments, filteredPdfs, clearFilters } = useFiltering(pdfs);
const showFilters = ref(false);

defineExpose({ pdfs, handlePdfFileChange });

// Close filters when clicking outside (only on md and above)
const handleClickOutside = (event: MouseEvent) => {
  // Only apply click-outside behavior on md and above
  if (window.innerWidth < 768) return;

  const target = event.target as HTMLElement;
  const filterButton = document.querySelector('[data-filter-button]');
  const filterMenu = document.querySelector('[data-filter-menu]');
  
  // Don't close if clicking the button or inside the menu
  if (filterButton?.contains(target) || filterMenu?.contains(target)) {
    return;
  }
  
  if (showFilters.value) {
    showFilters.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => {
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      return obj1[key].length === obj2[key].length && 
             obj1[key].every((item: any, i: number) => deepEqual(item, obj2[key][i]));
    }
    return deepEqual(obj1[key], obj2[key]);
  });
}

async function savePdfToLocalStorage(slug: string, file: File | Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        localStorage.setItem(`draft:pdfs:${slug}:file`, reader.result as string);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Function to handle PDF file changes
async function handlePdfFileChange(slug: string, file: File) {
  try {
    await savePdfToLocalStorage(slug, file);
    // Update the PDF entry in localStorage
    const existingPdf = pdfs.value.find(p => p.slug === slug);
    if (existingPdf) {
      const updatedPdf = {
        ...existingPdf,
        file: URL.createObjectURL(file)
      };
      localStorage.setItem(`draft:pdfs:${slug}`, JSON.stringify(updatedPdf));
      // Update the PDF in the list
      const index = pdfs.value.findIndex(p => p.slug === slug);
      if (index !== -1) {
        pdfs.value[index] = updatedPdf;
      }
    }
  } catch (error) {
    console.error('Failed to save PDF file:', error);
  }
}

onMounted(async () => {
  // Load site configuration
  try {
    const configRes = await fetch('/site-config.json');
    const configData = await configRes.json();
    const localConfig = loadLocalConfig();
    
    if (localConfig) {
      siteConfig.value = localConfig;
    } else {
      siteConfig.value = configData;
    }
  } catch (error) {
    console.error('Failed to load site configuration:', error);
  }

  // Load PDFs
  const res = await fetch('/pdf-index.json');
  const data = await res.json();
  
  // Get all draft entries from localStorage
  const draftEntries = Object.entries(localStorage)
    .filter(([key]) => key.startsWith('draft:'))
    .map(([key, value]) => {
      try {
        const draft = JSON.parse(value);
        // If this is a PDF file entry, load the actual file
        if (key.startsWith('draft:pdfs:') && key.endsWith(':file')) {
          return null; // Skip file entries as we'll handle them separately
        }
        return draft;
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  // Merge draft entries with fetched data
  const mergedData = [...data];
  
  for (const draft of draftEntries) {
    const existingIndex = mergedData.findIndex(pdf => pdf.slug === draft.slug);
    
    // Check if we have a local PDF file
    const localPdfKey = `draft:pdfs:${draft.slug}:file`;
    const localPdfFile = localStorage.getItem(localPdfKey);
    
    if (existingIndex !== -1) {
      const hostedPdf = mergedData[existingIndex];
      
      // If they're identical and no local file, remove from localStorage
      if (deepEqual(hostedPdf, draft) && !localPdfFile) {
        const key = `draft:pdfs:${hostedPdf.slug}`;
        localStorage.removeItem(key);
        localStorage.removeItem(localPdfKey);
        mergedData[existingIndex] = hostedPdf;
      } else {
        // Use local version with local file if available
        mergedData[existingIndex] = {
          ...draft,
          file: localPdfFile || hostedPdf.file
        };
      }
    } else {
      // Add new draft entry with local file if available
      mergedData.push({
        ...draft,
        file: localPdfFile || draft.file
      });
    }
  }

  pdfs.value = mergedData;
});

function loadLocalConfig(): SiteConfig | null {
  const localConfig = localStorage.getItem('draft:site-config');
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch {
      return null;
    }
  }
  return null;
}

</script>

<template>
  <div>
    <LocalStorageBanner 
      :has-local-changes="hasLocalChanges" 
    />
    <!-- Site Description -->
    <div class="px-4 sm:px-6 lg:px-8 mb-6">
      <p class="text-lg text-gray-600">{{ siteConfig.description }}</p>
    </div>
    <!-- Filter Button -->
    <div class="relative sm:px-6 lg:px-8">
      <div class="flex justify-end">
        <div class="relative">
          <button
            data-filter-button
            @click="showFilters = !showFilters"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-base font-medium text-gray-800 bg-white shadow-xs ring-1 ring-inset ring-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Filters
            <span v-if="filters.search || filters.tags.length || filters.genres.length || filters.instruments.length" class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
              {{ (filters.search ? 1 : 0) + filters.tags.length + filters.genres.length + filters.instruments.length }}
            </span>
          </button>

          <!-- Flyout Filters for Desktop -->
          <div class="hidden md:block">
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-show="showFilters"
                data-filter-menu
                class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow ring-1 ring-gray-300 z-50"
              >
                <div class="p-4 space-y-4 min-h-[320px] flex flex-col">
                  <div>
                    <label for="search" class="block text-base font-medium text-gray-800">Search</label>
                    <div class="mt-2">
                      <input
                        id="search"
                        v-model="filters.search"
                        type="text"
                        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
                        placeholder="Title or Artist..."
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-base font-medium text-gray-800">Tags</label>
                    <div class="mt-2">
                      <MultiSelectBox v-model="filters.tags" :options="allTags" placeholder="Select tags" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-base font-medium text-gray-800">Genres</label>
                    <div class="mt-2">
                      <MultiSelectBox v-model="filters.genres" :options="allGenres" placeholder="Select genres" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-base font-medium text-gray-800">Instruments</label>
                    <div class="mt-2">
                      <MultiSelectBox v-model="filters.instruments" :options="allInstruments" placeholder="Select instruments" />
                    </div>
                  </div>

                  <div class="pt-2 mt-auto border-t border-gray-200">
                    <button
                      @click="clearFilters"
                      class="w-full inline-flex justify-center items-center gap-2 px-3 py-1.5 text-base font-medium text-gray-800 bg-white shadow-sm ring-1 ring-inset ring-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Inline Filters for Mobile -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showFilters" class="block md:hidden">
        <div class="p-4 mt-2 space-y-4 min-h-[320px] flex flex-col bg-white rounded-md shadow ring-1 ring-gray-300">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-medium text-gray-800">Filters</h2>
            <button
              @click="showFilters = false"
              class="inline-flex items-center gap-1.5 px-2 py-1 text-base font-medium text-gray-800 hover:text-gray-900 focus:outline-none"
            >
              <span>Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <div>
            <label for="search" class="block text-base font-medium text-gray-800">Search</label>
            <div class="mt-2">
              <input
                id="search"
                v-model="filters.search"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
                placeholder="Title or Artist..."
              />
            </div>
          </div>

          <div>
            <label class="block text-base font-medium text-gray-800">Tags</label>
            <div class="mt-2">
              <MultiSelectBox v-model="filters.tags" :options="allTags" placeholder="Select tags" />
            </div>
          </div>

          <div>
            <label class="block text-base font-medium text-gray-800">Genres</label>
            <div class="mt-2">
              <MultiSelectBox v-model="filters.genres" :options="allGenres" placeholder="Select genres" />
            </div>
          </div>

          <div>
            <label class="block text-base font-medium text-gray-800">Instruments</label>
            <div class="mt-2">
              <MultiSelectBox v-model="filters.instruments" :options="allInstruments" placeholder="Select instruments" />
            </div>
          </div>

          <div class="pt-2 mt-auto border-t border-gray-200">
            <button
              @click="clearFilters"
              class="w-full inline-flex justify-center items-center gap-2 px-3 py-1.5 text-base font-medium text-gray-800 bg-white shadow-sm ring-1 ring-inset ring-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Card View -->
    <div 
      class="block md:hidden space-y-4 transition-all mt-2 duration-300 ease-out"
      :class="{ 'translate-y-0 delay-200': !showFilters, 'translate-y-[10px]': showFilters }"
    >
      <div v-if="filteredPdfs.length === 0" class="bg-white rounded-lg shadow ring-1 ring-gray-200 p-8 text-center">
        <p class="text-lg text-gray-600">No scores available yet. Check back soon!</p>
      </div>
      <div v-else v-for="pdf in filteredPdfs" :key="pdf.title" class="bg-white rounded-lg shadow ring-1 ring-gray-200 overflow-hidden">
        <div class="p-4">
          <div class="space-y-1">
            <h3 class="text-xl font-medium text-gray-800 break-words">{{ pdf.title }}</h3>
            <p class="text-base text-gray-600 break-words">{{ pdf.artists.join(', ') }}</p>
          </div>

          <div class="mt-3 flex flex-row flex-wrap gap-1">
            <div v-if="pdf.tags.length" class="space-y-1">
              <span class="sr-only text-sm font-medium text-gray-600">Tags</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in pdf.tags" :key="tag" class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div v-if="pdf.genres.length" class="space-y-1">
              <span class="sr-only text-sm font-medium text-gray-600">Genres</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="genre in pdf.genres" :key="genre" class="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  {{ genre }}
                </span>
              </div>
            </div>
            
            <div v-if="pdf.instruments.length" class="space-y-1 sm:col-span-2">
              <span class="sr-only text-sm font-medium text-gray-600">Instruments</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="instrument in pdf.instruments" :key="instrument" class="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                  {{ instrument }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <a
              :href="`/pdfs/${pdf.title}.pdf`"
              target="_blank"
              class="inline-flex items-center gap-1.5 text-base font-medium text-indigo-700 hover:text-indigo-800"
            >
              View PDF
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  

    <!-- Desktop Table View -->
    <div class="hidden md:block">
      <div v-if="filteredPdfs.length === 0" class="bg-white rounded-lg shadow ring-1 ring-gray-200 p-8 text-center">
        <p class="text-lg text-gray-600">No scores available yet. Check back soon!</p>
      </div>
      <PdfTable v-else :pdfs="filteredPdfs" />
    </div>
  </div>
</template>
