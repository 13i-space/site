// Shared bits for the link-preview images (app/og/**): the site's public
// address, a read-only Supabase fetch that needs no cookies, and turning an
// SVG portrait into a data URI the image renderer accepts.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://13i.space";

export const OG_SIZE = { width: 1200, height: 630 };

// Public rows only (the anon key, so row-level security still applies).
export async function publicRows(path) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    return res.ok ? await res.json() : [];
  } catch (e) {
    return [];
  }
}

export function svgDataUri(svg) {
  const bytes = new TextEncoder().encode(svg);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return `data:image/svg+xml;base64,${btoa(bin)}`;
}

export const absolute = (path) => (/^https?:/.test(path || "") ? path : `${SITE_URL}${path || ""}`);
