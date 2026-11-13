import artworksRaw from '../data/artworks.json';
import meta from '../data/meta.json';

export type Detail = { x: number; y: number; scale: number; title: string; text: string; note?: string };
export type Artwork = {
  id: string;
  group: 'core' | 'urban';
  title: string;
  titleJa: string | null;
  titleEn: string | null;
  artist: string;
  series: string | null;
  seriesNo: number | null;
  year: string | null;
  curatorialTime: string | null;
  timeLabel: string;
  parallel: boolean;
  region: string;
  location: {
    historicalName: string;
    modernName: string;
    lat: number | null;
    lng: number | null;
    confidence: 'exact' | 'approximate' | 'hypothetical';
    note: string | null;
  };
  image: {
    src: string;
    width: number;
    height: number;
    collection: string;
    accession?: string;
    source: string;
    sourceUrl: string;
    license: string;
  } | null;
  apa?: string;
  summary: string;
  sections: Record<string, string>;
  perspectives: string[];
  details: Detail[];
  status: string;
};

export const artworks = artworksRaw as Artwork[];
export const { times, regions, perspectives, confidence } = meta;

// Curatorial order: night hours 18:00 → 05:00, prologue (no time) first.
const hourOrder = (t: string | null) => {
  if (!t) return -1;
  const h = Number(t.slice(0, 2));
  return h < 12 ? h + 24 : h;
};

export const ordered = [...artworks].sort(
  (a, b) => hourOrder(a.curatorialTime) - hourOrder(b.curatorialTime) || Number(a.parallel) - Number(b.parallel) || a.id.localeCompare(b.id),
);

export const byId = (id: string) => artworks.find((a) => a.id === id);
export const regionName = (id: string) => regions.find((r) => r.id === id)?.name ?? id;
export const perspectiveName = (id: string) => perspectives.find((p) => p.id === id)?.name ?? id;

// Commons thumbnails: request a smaller rendition for grids/cards.
// Commons serves standard widths only (e.g. 330, 500, 960, 1280).
export function thumb(src: string, width: 330 | 500 | 960 | 1280 = 500): string {
  // The Met: "web-large" (~600px long edge, ~100KB) for lists and the timeline;
  // the original (~3MB) only when 1280 is asked for (zoomable detail views use image.src directly).
  if (src.includes('images.metmuseum.org')) return width <= 960 ? src.replace('/original/', '/web-large/') : src;
  const m = src.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f])\/([0-9a-f]{2})\/(.+)$/);
  if (!m) return src;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${m[3]}/${width}px-${m[3]}`;
}

export const isLandscape = (a: Artwork) => !!a.image && a.image.width > a.image.height;

export function artworkApa(a: Artwork): string | null {
  if (a.apa) return a.apa;
  if (!a.image) return null;
  const title = a.titleJa ?? a.title;
  const en = a.titleEn ? ` [${a.titleEn}]` : '';
  const series = a.series ? `（${a.series}，第 ${a.seriesNo} 景）` : '';
  const year = a.year ?? 'n.d.';
  const where = a.image.collection && !/^(待查證|原典藏館未標明)/.test(a.image.collection) ? `${a.image.collection}. ` : '';
  return `Utagawa, H. (${year}). *${title}*${en} [Woodblock print]${series}. ${where}Retrieved November 9, 2026, from ${a.image.source}: ${a.image.sourceUrl}`;
}
