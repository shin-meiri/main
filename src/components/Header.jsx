async function fetchMenu() {
  const res = await fetch('/api/data.json');
  const data = await res.json();
  return data.menu;
}

export default async function Header() {
  const menu = await fetchMenu();
  const links = menu
    .map(item => `<a href="${item.hash}" class="menu-link">${item.label}</a>`)
    .join(' ');

  return `
    <header style="padding: 1rem; background: #333; color: white;">
      <h1>My React App</h1>
      <nav>${links}</nav>
    </header>
  `;
}