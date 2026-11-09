// Prefix site-internal paths with the GitHub Pages base path (/edo-after-dark/).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function u(path = ''): string {
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}
