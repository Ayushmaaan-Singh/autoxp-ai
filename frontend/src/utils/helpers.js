export const fmtPrice = (p) => {
  if (p >= 10000000) return `₹${(p/10000000).toFixed(2)} Cr`;
  if (p >= 100000)   return `₹${(p/100000).toFixed(2)} L`;
  return `₹${p.toLocaleString('en-IN')}`;
};
