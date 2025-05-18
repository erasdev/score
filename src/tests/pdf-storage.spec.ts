import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from '../components/Home.vue';
import Pdf from '../components/Pdf.vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { Pdf as PdfType } from '../types/pdf';
import type { ComponentPublicInstance } from 'vue';

// Add type definitions for component instances
interface HomeInstance extends ComponentPublicInstance {
  pdfs: PdfType[];
}

interface PdfInstance extends ComponentPublicInstance {
  pdf: PdfType;
}

// Configure Vitest
vi.useFakeTimers();

// Mock data
const mockPdfData: PdfType[] = [
  {
    title: 'Test PDF 1',
    slug: 'test-pdf-1',
    description: 'Test Description 1',
    file: '/pdfs/test1.pdf',
    tags: ['tag1', 'tag2'],
    genres: ['genre1'],
    instruments: ['piano'],
    artists: ['Artist 1'],
    _lastModified: '2024-03-20T10:00:00.000Z' // Older timestamp
  },
  {
    title: 'Test PDF 2',
    slug: 'test-pdf-2',
    description: 'Test Description 2',
    file: '/pdfs/test2.pdf',
    tags: ['tag3'],
    genres: ['genre2'],
    instruments: ['guitar'],
    artists: ['Artist 2'],
    _lastModified: '2024-03-20T10:00:00.000Z'
  }
];

// Mock localStorage
vi.fn();
vi.fn();
vi.fn();
vi.fn();
vi.fn();
// Mock fetch
const mockFetch = vi.fn();
Object.defineProperty(window, 'fetch', {
  value: mockFetch,
  writable: true
});

// Create router once for all tests
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>Home</div>' }
    },
    {
      path: '/pdf/:slug',
      component: Pdf
    },
    {
      path: '/pdfs/:slug',
      component: Pdf
    }
  ]
});

// Update the mountWithRouter function to use proper typing
const mountWithRouter = <T extends ComponentPublicInstance>(component: any, options = {}) => {
  return mount(component, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: true
      }
    },
    ...options
  }) as unknown as ReturnType<typeof mount<T>>;
};

describe('PDF Storage Integration', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    localStorage.clear();

    // Mock fetch to return our test data
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockPdfData)
    });
  });

  describe('Home Component', () => {
    it('should use local version when it is newer than hosted version', async () => {
      // Setup local storage with newer draft data
      const draftData = {
        title: 'Test PDF 1',
        slug: 'test-pdf-1',
        description: 'Updated Description',
        tags: ['new-tag'],
        genres: ['new-genre'],
        instruments: ['new-instrument'],
        artists: ['New Artist'],
        _lastModified: '2024-03-21T10:00:00.000Z' // Newer timestamp
      };

      localStorage.setItem('draft:pdfs:test-pdf-1', JSON.stringify(draftData));

      // Mount component
      const wrapper = mountWithRouter<HomeInstance>(Home);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Get the merged data
      const mergedData: PdfType[] = wrapper.vm.pdfs;

      // Verify the merged data
      expect(mergedData).toHaveLength(2);

      // Find the merged PDF
      const mergedPdf = mergedData.find((p: PdfType) => p.slug === 'test-pdf-1');
      expect(mergedPdf).toBeDefined();

      // Verify merged fields
      expect(mergedPdf?.description).toBe('Updated Description');
      expect(mergedPdf?.tags).toContain('tag1');
      expect(mergedPdf?.tags).toContain('tag2');
      expect(mergedPdf?.tags).toContain('new-tag');
    });

    it('should use hosted version and remove local version when hosted is newer', async () => {
      // Setup local storage with older draft data
      const draftData = {
        title: 'Test PDF 1',
        slug: 'test-pdf-1',
        description: 'Updated Description',
        tags: ['new-tag'],
        genres: ['new-genre'],
        instruments: ['new-instrument'],
        artists: ['New Artist'],
        _lastModified: '2024-03-19T10:00:00.000Z' // Older timestamp
      };

      localStorage.setItem('draft:pdfs:test-pdf-1', JSON.stringify(draftData));

      // Mount component
      const wrapper = mountWithRouter<HomeInstance>(Home);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Verify localStorage was cleaned up
      expect(localStorage.getItem('draft:pdfs:test-pdf-1')).toBeNull();

      // Get the merged data
      const mergedData: PdfType[] = wrapper.vm.pdfs;

      // Verify the data matches hosted version
      expect(mergedData).toHaveLength(2);
      const pdf = mergedData.find((p: PdfType) => p.slug === 'test-pdf-1');
      expect(pdf).toEqual(mockPdfData[0]);
    });

    it('should handle invalid local storage data gracefully', async () => {
      // Setup invalid local storage data
      localStorage.setItem('draft:pdfs:test-pdf-1', 'invalid-json');

      // Mount component
      const wrapper = mountWithRouter<HomeInstance>(Home);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Verify the data is still valid
      const mergedData: PdfType[] = wrapper.vm.pdfs;
      expect(mergedData).toHaveLength(2);
      expect(mergedData).toEqual(mockPdfData);
    });
  });

  describe('Pdf Component', () => {
    it('should use local version when it is newer than hosted version', async () => {
      // Setup local storage with newer draft data
      const draftData = {
        title: 'Test PDF 1',
        slug: 'test-pdf-1',
        description: 'Updated Description',
        tags: ['new-tag'],
        genres: ['new-genre'],
        instruments: ['new-instrument'],
        artists: ['New Artist'],
        _lastModified: '2024-03-21T10:00:00.000Z' // Newer timestamp
      };

      localStorage.setItem('draft:pdfs:test-pdf-1', JSON.stringify(draftData));

      // Set up the route
      await router.push('/pdf/test-pdf-1');
      await router.isReady();

      // Mount component
      const wrapper = mountWithRouter<PdfInstance>(Pdf);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Get the merged data
      const mergedPdf:PdfType = wrapper.vm.pdf;

      // Verify merged fields
      expect(mergedPdf).toBeDefined();
      expect(mergedPdf?.description).toBe('Updated Description');
      expect(mergedPdf?.tags).toContain('tag1');
      expect(mergedPdf?.tags).toContain('tag2');
      expect(mergedPdf?.tags).toContain('new-tag');
    });

    it('should use hosted version and remove local version when hosted is newer', async () => {
      // Setup local storage with older draft data
      const draftData = {
        title: 'Test PDF 1',
        slug: 'test-pdf-1',
        description: 'Updated Description',
        tags: ['new-tag'],
        genres: ['new-genre'],
        instruments: ['new-instrument'],
        artists: ['New Artist'],
        _lastModified: '2024-03-19T10:00:00.000Z' // Older timestamp
      };

      localStorage.setItem('draft:pdfs:test-pdf-1', JSON.stringify(draftData));

      // Set up the route
      await router.push('/pdf/test-pdf-1');
      await router.isReady();

      // Mount component
      const wrapper = mountWithRouter<PdfInstance>(Pdf);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Verify localStorage was cleaned up
      expect(localStorage.getItem('draft:pdfs:test-pdf-1')).toBeNull();

      // Get the merged data
      const pdf = wrapper.vm.pdf;

      // Verify the data matches hosted version
      expect(pdf).toBeDefined();
      expect(pdf).toEqual(mockPdfData[0]);
    });

    it('should handle missing local storage data', async () => {
      // Set up the route
      await router.push('/pdf/test-pdf-1');
      await router.isReady();

      // Mount component
      const wrapper = mountWithRouter<PdfInstance>(Pdf);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Verify the data matches the fetched data
      const pdf = wrapper.vm.pdf;
      expect(pdf).toBeDefined();
      expect(pdf).toEqual(mockPdfData[0]);
    });

    it('should handle invalid local storage data gracefully', async () => {
      // Setup invalid local storage data
      localStorage.setItem('draft:pdfs:test-pdf-1', 'invalid-json');

      // Set up the route
      await router.push('/pdf/test-pdf-1');
      await router.isReady();

      // Mount component
      const wrapper = mountWithRouter<PdfInstance>(Pdf);

      // Wait for fetch and next tick
      await vi.runAllTimersAsync();
      await wrapper.vm.$nextTick();

      // Verify the data matches the fetched data
      const pdf = wrapper.vm.pdf;
      expect(pdf).toBeDefined();
      expect(pdf).toEqual(mockPdfData[0]);
    });
  });
});
