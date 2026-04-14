export interface Discount {
  id?: string;
  name: string;
  percent: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Extra {
  id: string;
  title: string;
  description?: string;
  priceCents: number;
  unit: "person" | "vehicle" | "camera" | "adult";
  kidsFree?: boolean;
  upgradeGroup?: string;
  active?: boolean;
}

function ddmmyyyyToIso(date: string): string | null {
  const parts = date.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  if (!d || !m || !y) return null;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function normaliseToIso(date: string): string | null {
  if (!date) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) return ddmmyyyyToIso(date);
  return null;
}

export function findDiscountForDate(
  date: string,
  discounts: Discount[]
): Discount | null {
  const iso = normaliseToIso(date);
  if (!iso) return null;
  const matches = discounts.filter((d) => {
    if (!d.active) return false;
    const start = normaliseToIso(d.startDate);
    const end = normaliseToIso(d.endDate);
    if (!start || !end) return false;
    return iso >= start && iso <= end;
  });
  if (matches.length === 0) return null;
  return matches.reduce((best, cur) =>
    cur.percent > best.percent ? cur : best
  );
}

export function applyDiscountCents(baseCents: number, percent: number): number {
  if (!percent || percent <= 0) return baseCents;
  const capped = Math.min(percent, 100);
  return Math.max(0, baseCents - Math.floor((baseCents * capped) / 100));
}

export function isoRangeIncludes(
  iso: string,
  startIso: string,
  endIso: string
): boolean {
  return iso >= startIso && iso <= endIso;
}

export function toIsoDate(date: string): string | null {
  return normaliseToIso(date);
}
