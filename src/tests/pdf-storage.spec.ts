import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from '../components/Home.vue';
import type { Pdf as PdfType } from '../types/pdf';

// Mock router-link component
const RouterLink = {
  name: 'RouterLink',
  template: '<a><slot /></a>',
  props: ['to']
};

// Mock fetch
window.fetch = vi.fn();

// Mock FileReader
class MockFileReader {
  onloadend: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  result: string | null = null;

  readAsDataURL() {
    this.result = 'data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKN';
    if (this.onloadend) {
      this.onloadend();
    }
  }
}

// Mock URL.createObjectURL
const mockObjectUrl = 'blob:mock-url';
URL.createObjectURL = vi.fn(() => mockObjectUrl);

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
    artists: ['Artist 1']
  },
  {
    title: 'Test PDF 2',
    slug: 'test-pdf-2',
    description: 'Test Description 2',
    file: '/pdfs/test2.pdf',
    tags: ['tag3'],
    genres: ['genre2'],
    instruments: ['guitar'],
    artists: ['Artist 2']
  }
];

const mockSiteConfig = {
  title: 'Test Site',
  description: 'Test Description',
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#1f2937',
    accent: '#4f46e5'
  }
};

describe('PDF Storage', () => {
  const mockPdf: PdfType = {
    slug: 'test-pdf',
    title: 'Test PDF',
    description: 'Test Description',
    artists: ['Test Artist'],
    instruments: ['Piano'],
    genres: ['Classical'],
    tags: ['test'],
    file: '/pdfs/test-pdf.pdf'
  };

  const mockBase64Pdf = 'data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKN';

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    localStorage.clear();

    // Mock FileReader
    window.FileReader = MockFileReader as any;

    // Mock fetch to return our test data
    (window.fetch as Mock).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve(mockPdfData)
        });
      }
      if (url === '/site-config.json') {
        return Promise.resolve({
          json: () => Promise.resolve(mockSiteConfig)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should store PDF in localStorage', async () => {
    const wrapper = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for initial load
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    const component = wrapper.vm as any;

    // Mock File object
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    // Call handlePdfFileChange and wait for it to complete
    await component.handlePdfFileChange(mockPdf.slug, file);

    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    // Check if PDF was stored in localStorage
    const storedPdf = localStorage.getItem(`draft:pdfs:${mockPdf.slug}`);
    const storedFile = localStorage.getItem(`draft:pdfs:${mockPdf.slug}:file`);

    expect(storedPdf).toBeTruthy();
    expect(storedFile).toBeTruthy();
    expect(storedFile?.startsWith('data:application/pdf;base64,')).toBe(true);
  }, 10000);

  it('should load PDF from localStorage when not in file system', async () => {
    // Store mock PDF in localStorage
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(mockPdf));
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}:file`, mockBase64Pdf);

    // Mock empty file system response
    (window.fetch as Mock).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([])
        });
      }
      if (url === '/site-config.json') {
        return Promise.resolve({
          json: () => Promise.resolve(mockSiteConfig)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    // Check if PDF was loaded from localStorage
    expect(wrapper.vm.pdfs).toHaveLength(1);
    expect(wrapper.vm.pdfs[0].slug).toBe(mockPdf.slug);
    expect(wrapper.vm.pdfs[0].file).toBe(mockBase64Pdf);
  });

  it('should use local PDF over file system PDF when different', async () => {
    // Store modified PDF in localStorage
    const modifiedPdf = {
      ...mockPdf,
      title: 'Modified Title'
    };
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(modifiedPdf));
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}:file`, mockBase64Pdf);

    // Mock file system response
    (window.fetch as Mock).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([mockPdf])
        });
      }
      if (url === '/site-config.json') {
        return Promise.resolve({
          json: () => Promise.resolve(mockSiteConfig)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    // Check if modified PDF was used
    expect(wrapper.vm.pdfs).toHaveLength(1);
    expect(wrapper.vm.pdfs[0].title).toBe('Modified Title');
    expect(wrapper.vm.pdfs[0].file).toBe(mockBase64Pdf);
  });

  it('should remove localStorage entry when PDF matches file system', async () => {
    // Store identical PDF in localStorage without a local file
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(mockPdf));

    // Mock file system response
    (window.fetch as Mock).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([mockPdf])
        });
      }
      if (url === '/site-config.json') {
        return Promise.resolve({
          json: () => Promise.resolve(mockSiteConfig)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    // Check if localStorage entry was removed
    expect(localStorage.getItem(`draft:pdfs:${mockPdf.slug}`)).toBeNull();
    expect(wrapper.vm.pdfs).toHaveLength(1);
    expect(wrapper.vm.pdfs[0].title).toBe(mockPdf.title);
  });

  it('should handle hasLocalChanges correctly', async () => {
    const wrapper = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for initial load
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    // Initially no local changes
    expect(wrapper.vm.hasLocalChanges).toBe(false);

    // Add local PDF
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(mockPdf));
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}:file`, mockBase64Pdf);

    // Update localStorage version to trigger reactivity
    wrapper.vm.updateLocalStorageVersion();

    // Force a re-render to detect changes
    await wrapper.vm.$nextTick();

    // Should now have local changes
    expect(wrapper.vm.hasLocalChanges).toBe(true);
  });

  it('should store and load PDF from localStorage', async () => {
    const testPdf = {
      title: 'Test PDF 1',
      slug: 'test-pdf-1',
      description: 'Test Description 1',
      file: '/pdfs/test1.pdf',
      tags: ['tag1', 'tag2'],
      genres: ['genre1'],
      instruments: ['piano'],
      artists: ['Artist 1']
    };

    const testPdf2 = {
      title: 'Test PDF 2',
      slug: 'test-pdf-2',
      description: 'Test Description 2',
      file: '/pdfs/test2.pdf',
      tags: ['tag3'],
      genres: ['genre2'],
      instruments: ['guitar'],
      artists: ['Artist 2']
    };

    // Mock fetch responses
    (window.fetch as Mock).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([testPdf, testPdf2])
        });
      }
      if (url === '/site-config.json') {
        return Promise.resolve({
          json: () => Promise.resolve(mockSiteConfig)
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for initial load
    await vi.runAllTimersAsync();
    await wrapper.vm.$nextTick();

    // Verify initial state
    expect(wrapper.vm.pdfs).toHaveLength(2);
    expect(wrapper.vm.pdfs[0].title).toBe('Test PDF 1');
    expect(wrapper.vm.pdfs[1].title).toBe('Test PDF 2');

    // Store a PDF in localStorage
    const updatedPdf = {
      ...testPdf,
      title: 'Updated Title',
      description: 'Updated Description'
    };
    localStorage.setItem(`draft:pdfs:${testPdf.slug}`, JSON.stringify(updatedPdf));

    // Re-mount to test localStorage loading
    const wrapper2 = mount(Home, {
      global: {
        components: {
          RouterLink
        }
      }
    });

    // Wait for all promises to resolve
    await vi.runAllTimersAsync();
    await wrapper2.vm.$nextTick();

    // Verify updated state
    expect(wrapper2.vm.pdfs).toHaveLength(2);
    expect(wrapper2.vm.pdfs[0].title).toBe('Updated Title');
    expect(wrapper2.vm.pdfs[0].description).toBe('Updated Description');
    expect(wrapper2.vm.pdfs[1].title).toBe('Test PDF 2');
  });
});
