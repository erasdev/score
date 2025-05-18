import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from '../components/Home.vue';
import type { Pdf as PdfType } from '../types/pdf';


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

    // Mock fetch to return our test data
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockPdfData)
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should store PDF in localStorage', async () => {
    const wrapper = mount(Home);
    const component = wrapper.vm as any;

    // Mock File object
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    // Call handlePdfFileChange
    await component.handlePdfFileChange(mockPdf.slug, file);

    // Check if PDF was stored in localStorage
    const storedPdf = localStorage.getItem(`draft:pdfs:${mockPdf.slug}`);
    const storedFile = localStorage.getItem(`draft:pdfs:${mockPdf.slug}:file`);

    expect(storedPdf).toBeTruthy();
    expect(storedFile).toBeTruthy();
    expect(storedFile?.startsWith('data:application/pdf;base64,')).toBe(true);
  });

  it('should load PDF from localStorage when not in file system', async () => {
    // Store mock PDF in localStorage
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(mockPdf));
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}:file`, mockBase64Pdf);

    // Mock empty file system response
    (window.fetch as any).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([])
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home);
    const component = wrapper.vm as any;

    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick();

    // Check if PDF was loaded from localStorage
    expect(component.pdfs).toHaveLength(1);
    expect(component.pdfs[0].slug).toBe(mockPdf.slug);
    expect(component.pdfs[0].file).toBe(mockBase64Pdf);
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
    (window.fetch as any).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([mockPdf])
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home);
    const component = wrapper.vm as any;

    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick();

    // Check if modified PDF was used
    expect(component.pdfs).toHaveLength(1);
    expect(component.pdfs[0].title).toBe('Modified Title');
    expect(component.pdfs[0].file).toBe(mockBase64Pdf);
  });

  it('should remove localStorage entry when PDF matches file system', async () => {
    // Store identical PDF in localStorage
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(mockPdf));

    // Mock file system response
    (window.fetch as any).mockImplementation((url: string) => {
      if (url === '/pdf-index.json') {
        return Promise.resolve({
          json: () => Promise.resolve([mockPdf])
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const wrapper = mount(Home);

    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick();

    // Check if localStorage entry was removed
    expect(localStorage.getItem(`draft:pdfs:${mockPdf.slug}`)).toBeNull();
  });

  it('should handle hasLocalChanges correctly', async () => {
    const wrapper = mount(Home);
    const component = wrapper.vm as any;

    // Initially no local changes
    expect(component.hasLocalChanges).toBe(false);

    // Add local PDF
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}`, JSON.stringify(mockPdf));
    localStorage.setItem(`draft:pdfs:${mockPdf.slug}:file`, mockBase64Pdf);

    // Wait for changes to be detected
    await wrapper.vm.$nextTick();

    // Should now have local changes
    expect(component.hasLocalChanges).toBe(true);
  });
});
