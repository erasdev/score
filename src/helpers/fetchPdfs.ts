import deepEqual from './deepEqual';

export default async function fetchPdfs() {
    const res = await fetch('/pdf-index.json');
    const data = await res.json();
  
  // Get all draft entries from localStorage
  const draftEntries = Object.entries(localStorage)
    .filter(([key]) => key.startsWith('draft:pdfs:') && !key.endsWith(':file'))
    .map(([_, value]) => {
      try {
        return JSON.parse(value);
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

  return mergedData;
}