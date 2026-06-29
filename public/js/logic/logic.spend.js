export function buildSpendMapForMonth(year, month, pages) {
  const map = {};
  pages.forEach(page => {
    if (!page.date) return;
    const [y, m] = page.date.split('-');
    if (Number(y) === year && Number(m) === month) {
      let total = 0;
      if (page.items && Array.isArray(page.items)) {
        page.items.forEach(item => {
          const price = parseFloat(item.price) || 0;
          total += price;
        });
      }
      map[page.date] = (map[page.date] || 0) + total;
    }
  });
  return map;
}

export function buildYearlyTotals(year, pages) {
  const totals = new Array(12).fill(0);
  pages.forEach(page => {
    if (!page.date) return;
    const [y, m] = page.date.split('-');
    if (Number(y) === year) {
      const monthIndex = Number(m) - 1;
      let total = 0;
      if (page.items && Array.isArray(page.items)) {
        page.items.forEach(item => {
          const price = parseFloat(item.price) || 0;
          total += price;
        });
      }
      totals[monthIndex] += total;
    }
  });
  return totals;
}
