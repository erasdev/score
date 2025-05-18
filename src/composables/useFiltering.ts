import { ref, computed, type Ref, watch } from 'vue';
import type { Pdf } from '../types/pdf';

export function useFiltering(pdfs: Ref<Pdf[]>) {
  const filters = ref({
    search: '',
    tags: [] as string[],
    genres: [] as string[],
    instruments: [] as string[],
  });

  const extractUniqueSorted = (getter: (pdf: Pdf) => string[]) => {
    const set = new Set<string>();
    pdfs.value.forEach(pdf => getter(pdf)?.forEach(item => set.add(item)));
    return [...set].sort();
  };

  const allTags = computed(() => extractUniqueSorted(pdf => pdf.tags));
  const allGenres = computed(() => extractUniqueSorted(pdf => pdf.genres));
  const allInstruments = computed(() => extractUniqueSorted(pdf => pdf.instruments));

  const filteredPdfs = computed(() => {
    if (!pdfs.value) return [];
    
    return pdfs.value.filter((pdf: Pdf) => {
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

  // Watch for changes in the pdfs array
  watch(pdfs, () => {
    // Force recomputation of filtered results
    filteredPdfs.value;
  }, { deep: true });

  return {
    filters,
    allTags,
    allGenres,
    allInstruments,
    filteredPdfs,
    clearFilters,
  };
} 