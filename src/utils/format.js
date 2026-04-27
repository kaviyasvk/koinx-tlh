export const fmt = (n, decimals = 2) => {
  if (n === undefined || n === null || isNaN(n)) return '₹0.00';
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};
 
export const fmtQty = (n) => {
  if (!n && n !== 0) return '—';
  const abs = Math.abs(n);
  if (abs < 1e-10) return '~0';
  if (abs > 1e9) return n.toExponential(2);
  if (abs > 1000) return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  if (abs > 1) return n.toLocaleString('en-IN', { maximumFractionDigits: 4 });
  return n.toPrecision(4);
};
 