import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pdf } from '../types/pdf';

export const useFilteringStore = defineStore('filtering', () => {
    const showFilters = ref(false);
    const pdfs = ref<Pdf[]>([]);
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

    const count = computed(()=>{
        return showCount.value ? (filters.value.search ? 1 : 0) + filters.value.tags.length + filters.value.genres.length + filters.value.instruments.length : undefined
    })

    const showCount = computed(()=>{
        return filters.value.search || filters.value.tags.length || filters.value.genres.length || filters.value.instruments.length
    })

    const clearFilters = () => {
        filters.value = {
        search: '',
        tags: [],
        genres: [],
        instruments: [],
        };
    };

    const setPdfs = (newPdfs: Pdf[]) => {
        pdfs.value = newPdfs;
    };

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

    function closeFilters() {
        showFilters.value = false;
    }
    

    return {
        pdfs,
        filters,
        allTags,
        allGenres,
        allInstruments,
        filteredPdfs,
        clearFilters,
        setPdfs,
        showFilters,
        handleClickOutside,
        closeFilters,
        count
    };
}); 