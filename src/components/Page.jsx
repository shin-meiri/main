let pagesData = null;

async function fetchPages() {
  if (!pagesData) {
    const res = await fetch('/api/pages.json');
    pagesData = await res.json();
  }
  return pagesData;
}

export default async function Page() {
  const hash = window.location.hash.slice(1) || 'home';
  const pages = await fetchPages();

  const page = pages[hash] || pages['home'];

  return `
    <main style="padding: 2rem;">
      <h2>${page.title}</h2>
      <div>${page.content}</div>
    </main>
  `;
}