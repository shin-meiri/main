export default function Contact() {
  return (
    <div className="page contact">
      <h1>Hubungi Saya</h1>
      <form>
        <input type="text" placeholder="Nama" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Pesan"></textarea>
        <button type="submit">Kirim</button>
      </form>
    </div>
  );
}