
<script setup>
import { ref, computed, onMounted } from 'vue';
import MultiSelectBox from './MultiSelectBox.vue';

const pdfs = ref([]);
const filters = ref({
  search: '',
  tags: [],
  genres: [],
  instruments: [],
});

const extractUniqueSorted = (getter) => {
  const set = new Set();
  pdfs.value.forEach(pdf => getter(pdf)?.forEach(item => set.add(item)));
  return [...set].sort();
};

const allTags = computed(() => extractUniqueSorted(pdf => pdf.tags));
const allGenres = computed(() => extractUniqueSorted(pdf => pdf.genres));
const allInstruments = computed(() => extractUniqueSorted(pdf => pdf.instruments));

const filteredPdfs = computed(() => {
  return pdfs.value.filter(pdf => {
    const search = filters.value.search.toLowerCase();
    const matchesSearch =
      !search ||
      pdf.title?.toLowerCase().includes(search) ||
      pdf.artists?.some(a => a.toLowerCase().includes(search));

    const matchesTags =
      filters.value.tags.length === 0 ||
      filters.value.tags.every(tag => pdf.tags?.includes(tag));

    const matchesGenres =
      filters.value.genres.length === 0 ||
      filters.value.genres.every(genre => pdf.genres?.includes(genre));

    const matchesInstruments =
      filters.value.instruments.length === 0 ||
      filters.value.instruments.every(inst => pdf.instruments?.includes(inst));

    return matchesSearch && matchesTags && matchesGenres && matchesInstruments;
  });
});

const clearFilters = () => {
  filters.value = {
    search: '',
    tags: [],
    genres: [],
    instruments: [],
  };
};

onMounted(async () => {
  const res = await fetch('/pdf-index.json');
  pdfs.value = await res.json();
});
</script>


<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PDF Library</h1>

    <!-- Filters -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-6">
  <div>
    <label class="block font-semibold mb-1">Search (Title or Artist):</label>
    <input v-model="filters.search" type="text" class="w-full border rounded px-2 py-1" placeholder="Search..." />
  </div>

  <div>
    <label class="block font-semibold mb-1">Tags:</label>
    <MultiSelectBox v-model="filters.tags" :options="allTags" placeholder="Select tags" />
  </div>

  <div>
    <label class="block font-semibold mb-1">Genres:</label>
    <MultiSelectBox v-model="filters.genres" :options="allGenres" placeholder="Select genres" />
  </div>

  <div>
    <label class="block font-semibold mb-1">Instruments:</label>
    <MultiSelectBox v-model="filters.instruments" :options="allInstruments" placeholder="Select instruments" />
  </div>
</div>

    <!-- Clear Filters -->
    <button @click="clearFilters" class="mb-6 px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 text-sm">
      Clear Filters
    </button>

    <!-- Table -->
    <table class="table-auto w-full border text-sm">
      <thead>
        <tr>
          <th class="border px-4 py-2 text-left">Title</th>
          <th class="border px-4 py-2 text-left">Description</th>
          <th class="border px-4 py-2 text-left">Tags</th>
          <th class="border px-4 py-2 text-left">Artists</th>
          <th class="border px-4 py-2 text-left">Genres</th>
          <th class="border px-4 py-2 text-left">Instruments</th>
          <th class="border px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pdf in filteredPdfs" :key="pdf.slug">
          <td class="border px-4 py-2">{{ pdf.title }}</td>
          <td class="border px-4 py-2">{{ pdf.description }}</td>
          <td class="border px-4 py-2">{{ pdf.tags?.join(', ') }}</td>
          <td class="border px-4 py-2">{{ pdf.artists?.join(', ') }}</td>
          <td class="border px-4 py-2">{{ pdf.genres?.join(', ') }}</td>
          <td class="border px-4 py-2">{{ pdf.instruments?.join(', ') }}</td>
          <td class="border px-4 py-2">
            <router-link :to="`/pdfs/${pdf.slug}`" class="text-blue-500 underline">View</router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="filteredPdfs.length === 0" class="mt-6 text-center text-gray-500">No matching results.</p>
  </div>
</template>
