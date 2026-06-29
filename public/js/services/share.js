export function generateShareLink(id) {
  const url = new URL(window.location.href);
  url.searchParams.set('share', id);
  return url.toString();
}
