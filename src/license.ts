export const PRODUCT_SLUG = 'prerequisite-pathboard';
export const BUY_URL = `https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/checkout`;
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${PRODUCT_SLUG}`;

interface Verdict { valid: boolean; checkedAt: number }

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
}

export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export function hasPaidLicense(): boolean {
  if (!localStorage.getItem(LICENSE_KEY)) return false;
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? '{}') as Verdict;
    return verdict.valid !== false;
  } catch { return true; }
}

export async function verifyLicense(): Promise<boolean | null> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return null;
  let cached: Verdict | null = null;
  try { cached = JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null; } catch { /* verify below */ }
  if (cached && Date.now() - cached.checkedAt < 86_400_000) return cached.valid;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) return null;
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return result.valid;
  } catch { return null; }
}
