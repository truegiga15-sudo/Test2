export function formatYears(years: number): string {
  if (years < 1_000) return `${years.toFixed(0)} yr`;
  if (years < 1_000_000) return `${(years / 1_000).toFixed(2)} kyr`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(2)} Myr`;
  return `${(years / 1_000_000_000).toFixed(2)} Gyr`;
}

export function formatScientific(value: number, unit = ""): string {
  if (!Number.isFinite(value)) return `∞ ${unit}`.trim();
  if (value === 0) return `0 ${unit}`.trim();
  return `${value.toExponential(3)} ${unit}`.trim();
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "∞";
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}
