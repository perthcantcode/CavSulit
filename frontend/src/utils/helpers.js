export const CAT_ICONS = {
  food: '🍱', drinks: '🧋', merch: '👕', accessories: '💍',
  school_supplies: '📚', beauty: '💅', services: '🛠️', other: '🛒',
};

export const COLLEGES = ['CEIT','CON','CEMDS','COE','CAS','Main Gate','Canteen','Dormitory','Other'];
export const CATEGORIES = ['food','drinks','merch','accessories','school_supplies','beauty','services','other'];
export const DEPARTMENTS = ['CEIT','CON','CEMDS','COE','CAS','STAFF','INSTRUCTOR','OTHER'];

export const badgeLabel = (level) => {
  if (level === 'cvsu')       return { label: '★ CvSU Verified',  cls: 'badge-cvsu' };
  if (level === 'trusted')    return { label: '★★ Trusted',       cls: 'badge-trusted' };
  if (level === 'top_seller') return { label: '★★★ Top Seller',   cls: 'badge-top' };
  return null;
};

export const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

export const fmt = (n) => new Intl.NumberFormat('en-PH').format(n);

export const photoUrl = (p) =>
  p ? (p.startsWith('http') ? p : `http://localhost:5000${p}`) : null;
