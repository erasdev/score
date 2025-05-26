
export default async function fetchPdfs() {
    const res = await fetch('/pdf-index.json');
    return await res.json();
  
}