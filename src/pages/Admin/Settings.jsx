// Di dalam Settings.jsx
const [newPage, setNewPage] = useState({ title: '', slug: '', content: '' });

const addPage = () => {
  if (!newPage.title || !newPage.slug) {
    setMessage('Judul dan slug wajib diisi.');
    return;
  }

  const newPageData = {
    id: Date.now(), // simple unique id
    ...newPage,
  };

  const updatedData = {
    ...data,
    pages: [...(data.pages || []), newPageData],
  };

  fetch('/api/data.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
    .then((res) => res.json())
    .then(() => {
      // Update state
      setData(updatedData);
      setNewPage({ title: '', slug: '', content: '' });
      setMessage('✅ Halaman berhasil dibuat!');
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(() => {
      setMessage('❌ Gagal menyimpan.');
    });
};

const deletePage = (slug) => {
  const updated = data.pages.filter((p) => p.slug !== slug);
  const updatedData = { ...data, pages: updated };

  fetch('/api/data.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
    .then((res) => res.json())
    .then(() => {
      setData(updatedData);
      setMessage('🗑️ Halaman dihapus.');
      setTimeout(() => setMessage(''), 2000);
    });
};