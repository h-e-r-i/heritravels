// Fetch real photos & summary from Wikipedia / Wikimedia Commons.
// Cached in localStorage to keep the UI fast on repeat visits.

export type WikiSummary = {
  title: string;
  extract: string;
  images: string[]; // absolute URLs
  pageUrl?: string;
};

const MEM = new Map<string, WikiSummary>();
const LS_PREFIX = "heri.wiki.v2:";

function readCache(key: string): WikiSummary | null {
  if (MEM.has(key)) return MEM.get(key)!;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    const p = JSON.parse(raw) as WikiSummary;
    MEM.set(key, p);
    return p;
  } catch {
    return null;
  }
}

function writeCache(key: string, v: WikiSummary) {
  MEM.set(key, v);
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(v));
  } catch {
    /* quota */
  }
}

async function findTitle(query: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&origin=*&srsearch=${encodeURIComponent(query)}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = (await r.json()) as { query?: { search?: Array<{ title: string }> } };
  return j.query?.search?.[0]?.title ?? null;
}

export async function fetchDestinationWiki(name: string, country: string): Promise<WikiSummary | null> {
  const key = `${name}::${country}`.toLowerCase();
  const cached = readCache(key);
  if (cached) return cached;

  try {
    const title = (await findTitle(`${name} ${country}`)) ?? name;

    // Summary + lead image
    const sumR = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    );
    const sum = sumR.ok
      ? ((await sumR.json()) as {
          title?: string;
          extract?: string;
          thumbnail?: { source?: string };
          originalimage?: { source?: string };
          content_urls?: { desktop?: { page?: string } };
        })
      : null;

    // Page images list
    const imgsR = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=images&imlimit=25&titles=${encodeURIComponent(title)}`,
    );
    const imgTitles: string[] = [];
    if (imgsR.ok) {
      const j = (await imgsR.json()) as {
        query?: { pages?: Record<string, { images?: Array<{ title: string }> }> };
      };
      const pages = j.query?.pages ?? {};
      for (const p of Object.values(pages)) {
        for (const im of p.images ?? []) {
          const t = im.title;
          if (/\.(jpg|jpeg|png|webp)$/i.test(t) && !/(flag|coat|icon|logo|map|locator|svg|symbol|seal)/i.test(t)) {
            imgTitles.push(t);
          }
        }
      }
    }

    // Resolve to URLs (limit)
    const resolved: string[] = [];
    for (const t of imgTitles.slice(0, 6)) {
      try {
        const r = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&iiurlwidth=1200&titles=${encodeURIComponent(t)}`,
        );
        if (!r.ok) continue;
        const j = (await r.json()) as {
          query?: { pages?: Record<string, { imageinfo?: Array<{ thumburl?: string; url?: string }> }> };
        };
        const pages = j.query?.pages ?? {};
        for (const p of Object.values(pages)) {
          const info = p.imageinfo?.[0];
          const u = info?.thumburl ?? info?.url;
          if (u) resolved.push(u);
        }
      } catch { /* ignore */ }
    }

    const hero = sum?.originalimage?.source ?? sum?.thumbnail?.source;
    if (hero) resolved.unshift(hero);

    const value: WikiSummary = {
      title: sum?.title ?? title,
      extract: sum?.extract ?? "",
      images: Array.from(new Set(resolved)).slice(0, 8),
      pageUrl: sum?.content_urls?.desktop?.page,
    };
    writeCache(key, value);
    return value;
  } catch (e) {
    console.warn("wiki fetch failed", name, e);
    return null;
  }
}
